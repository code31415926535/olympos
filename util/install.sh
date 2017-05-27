#!/usr/bin/env bash

source ./install.conf

# Create docker network
echo "Setting up private network ..."
docker network create --driver bridge ${OLYMPOS_NET}

if [ $? -ne 0 ]; then
    echo "Failed to setup private network ... exiting ..."
    exit 1
fi

# Create database
echo "Deploying database ..."
docker run \
--name ${ATHENA_HOSTNAME} \
--hostname ${ATHENA_HOSTNAME} \
--network ${OLYMPOS_NET} \
-e ATHENA_PORT=${ATHENA_PORT} \
-d olympos/athena:latest

if [ $? -ne 0 ]; then
	echo "Failed to deploy database ... exiting ..."
	exit 1
fi

echo "Deployed database!"
sleep 5

echo "Deploying API server ..."
docker run \
--name ${ARES_HOSTNAME} \
--hostname ${ARES_HOSTNAME} \
--network ${OLYMPOS_NET} \
-e ARES_PORT=${ARES_PORT} -e ARES_PROTOCOL=${ARES_PROTOCOL} \
-e ATHENA_HOSTNAME=${ATHENA_HOSTNAME} -e ATHENA_PORT=${ATHENA_PORT} -e ATHENA_NAME={$ATHENA_NAME} \
-e ADMIN_USERNAME=${ADMIN_USERNAME} -e ADMIN_PASSWORD=${ADMIN_PASSWORD} \
-e JOBRUNNER_USERNAME=${JOBRUNNER_USERNAME} -e JOBRUNNER_PASSWORD=${JOBRUNNER_PASSWORD} \
-e HERMES_HOSTNAME="localhost" -e HERMES_PORT=${HERMES_PORT} \
--expose ${ARES_PORT} \
-p ${ARES_PORT}:${ARES_PORT} \
-d olympos/ares:latest

if [ $? -ne 0 ]; then
    echo "Failed to deploy API server ... exiting ..."
    exit 1
fi

echo "API server will seeds the default users into the database!"
sleep 5

api_server="http://localhost:${ARES_PORT}"
echo "API server endpoint is: ${api_server}"
echo "Running general API server test ..."
python data.py test-api ${ADMIN_USERNAME} ${ADMIN_PASSWORD} ${api_server}

if [ $? -ne 0 ]; then
    echo "Failed API server test ... exiting ..."
    exit 1
fi

echo "Deploying mock data ..."
python data.py add-mock-data ${ADMIN_USERNAME} ${ADMIN_PASSWORD} ${api_server}
if [ $? -ne 0 ]; then
    echo "Failed to deploy mock data ... exiting ..."
    exit 1
fi

# TODO: Deploy job-runner
# TODO: Job-runner functional tests
# TODO: Deploy UI server

echo
echo "-----------------------------------------------------"
echo "Olympos testing framework has successfully installed!"
echo
echo "Here are some useful tips: "
echo "  - keep the 'install.conf' file, since it is used by the uninstall script."
echo "    Olympos can still be removed manually, but it is more difficult that way."
echo "  - to get started, visit the olympos built-in user interface 'aphrodite':"
echo "    <aphrodite url here>"
echo "  - you can also check out the rest application programming interface documentation at:"
echo "    http://localhost:${ARES_PORT}/swagger"
echo
echo " Happy testing!"
echo "-----------------------------------------------------"