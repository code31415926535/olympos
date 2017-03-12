#!/bin/bash

if [ $1 = "up" ]; then
	docker run -d --hostname ares --name ares -p 8080:8080 -e ARES_PORT=8080 -e ARES_PROTOCOL="http" -e ATHENA_HOSTNAME="athena" -e ATHENA_PORT=27017 -e ATHENA_NAME=test --link athena:athena olympos/ares:latest
fi

if [ $1 = "down" ]; then
	docker stop ares
	docker rm ares
fi

if [ $1 = "build" ]; then
	cd ../api && ./build.sh
fi
