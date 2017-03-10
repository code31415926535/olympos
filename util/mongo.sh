#!/bin/bash

if [ $1 = "up" ]; then
	docker run --name we-db -p 5432:27017 -d wecode/db:latest
fi

if [ $1 = "down" ]; then
	docker stop we-db
	docker rm we-db
fi
