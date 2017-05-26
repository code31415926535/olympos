#!/usr/bin/env bash

source ./install.conf

echo "Removing database ..."
docker stop ${ATHENA_HOSTNAME}
docker rm ${ATHENA_HOSTNAME}
echo "Database removed!"