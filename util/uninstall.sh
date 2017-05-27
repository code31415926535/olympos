#!/usr/bin/env bash

source ./install.conf

echo "Removing Jobrunner ..."
docker stop ${HERMES_HOSTNAME}
docker rm ${HERMES_HOSTNAME}
echo "Jobrunner removed ..."

echo "Removing API server ..."
docker stop ${ARES_HOSTNAME}
docker rm ${ARES_HOSTNAME}
echo "API server removed ..."

echo "Removing database ..."
docker stop ${ATHENA_HOSTNAME}
docker rm ${ATHENA_HOSTNAME}
echo "Database removed!"

echo "Removing docker network ..."
docker network rm ${OLYMPOS_NET}

echo "Olympos uninstalled successfully!"