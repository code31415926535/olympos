#!/bin/bash

if [ $1 = "up" ]; then
	docker run --hostname athena --name athena -d olympos/athena:latest
fi

if [ $1 = "down" ]; then
	docker stop athena
	docker rm athena
fi

if [ $1 = "build" ]; then
	cd ../db && ./build.sh
fi
