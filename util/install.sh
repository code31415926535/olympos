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

sleep 10

echo "Deploying API server ..."
docker run \
--name ${ARES_HOSTNAME} \
--hostname ${ARES_HOSTNAME} \
--network ${OLYMPOS_NET} \
-e ARES_PORT=${ARES_PORT} -e ARES_PROTOCOL=${ARES_PROTOCOL} \
-e ATHENA_HOSTNAME=${ATHENA_HOSTNAME} -e ATHENA_PORT=${ATHENA_PORT} -e ATHENA_NAME={$ATHENA_NAME} \
-e ADMIN_USERNAME=${ADMIN_USERNAME} -e ADMIN_PASSWORD=${ADMIN_PASSWORD} \
-e JOBRUNNER_USERNAME=${JOBRUNNER_USERNAME} -e JOBRUNNER_PASSWORD=${JOBRUNNER_PASSWORD} \
-e HERMES_HOSTNAME=${HERMES_HOSTNAME} -e HERMES_PORT=${HERMES_PORT} \
--expose ${ARES_PORT} \
-p ${ARES_PORT}:${ARES_PORT} \
-d olympos/ares:latest
if [ $? -ne 0 ]; then
    echo "Failed to deploy API server ... exiting ..."
    exit 1
fi
echo "API server will seeds the default users into the database!"

sleep 10

api_server="http://localhost:${ARES_PORT}"
echo "API server endpoint is: ${api_server}"
echo "Running general API server test ..."
python data.py test-api ${ADMIN_USERNAME} ${ADMIN_PASSWORD} ${api_server}
if [ $? -ne 0 ]; then
    echo "Failed API server test ... exiting ..."
    exit 1
fi
echo "All tests passed!"

echo "Deploying mock data ..."
python data.py add-mock-data ${ADMIN_USERNAME} ${ADMIN_PASSWORD} ${api_server}
if [ $? -ne 0 ]; then
    echo "Failed to deploy mock data ... exiting ..."
    exit 1
fi
echo "Mock data deployed!"

sleep 1

echo "Deploying jobrunner ..."
docker run \
--name ${HERMES_HOSTNAME} \
--hostname ${HERMES_HOSTNAME} \
--network ${OLYMPOS_NET} \
-e ARES_HOSTNAME=${ARES_HOSTNAME} -e ARES_PORT=${ARES_PORT} \
-e JOBRUNNER_USERNAME=${JOBRUNNER_USERNAME} -e JOBRUNNER_PASSWORD=${JOBRUNNER_PASSWORD} \
-e HERMES_PORT=${HERMES_PORT} \
-e HERMES_TIMEOUT=${HERMES_TIMEOUT} -e HERMES_POLL_INTERVAL=${HERMES_POLL_INTERVAL} \
-v /var/run/docker.sock:/var/run/docker.sock \
-d olympos/hermes:latest
if [ $? -ne 0 ]; then
    echo "Failed to deploy jobrunner ... exiting ..."
    exit 1
fi
echo "Jobrunner deployed!"

sleep 1

echo "Running sample jobs ..."
python data.py test-run ${ADMIN_USERNAME} ${ADMIN_PASSWORD} ${api_server}
if [ $? -ne 0 ]; then
    echo "Sample job test failed ..."
    exit 1
fi
echo "Sample jobs test finished with success!"

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