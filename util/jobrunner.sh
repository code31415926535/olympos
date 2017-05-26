#!/bin/bash

if [ $1 = "up" ]; then
	docker run -d --hostname hermes --name hermes -p 8087:8087 -e ARES_PORT=8080 -e ARES_HOST="ares" -e HERMES_PORT=8087 -e HERMES_TIMEOUT=20 -e HERMES_POLL_INTERVAL=2 --link ares:ares olympos/ares:latest
fi

if [ $1 = "down" ]; then
	docker stop hermes
	docker rm hermes
fi

if [ $1 = "build" ]; then
	cd ../jobrunner && ./build.sh
fi
