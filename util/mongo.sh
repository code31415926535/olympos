#!/bin/bash

if [ $1 = "up" ]; then
	docker run --hostname athena -p 5432:27017 --name athena -e ATHENA_PORT=27017 -d olympos/athena:latest
fi

if [ $1 = "down" ]; then
	docker stop athena
	docker rm athena
fi

if [ $1 = "build" ]; then
	cd ../db && ./build.sh
fi
