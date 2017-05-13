#!/bin/bash

./mongo.sh up
sleep 5
./api.sh up
sleep 5
./jobrunner.sh up
