#!/usr/bin/env bash

export GOPATH=`pwd`
cd ./src
go get gopkg.in/yaml.v2

CGO_ENABLED=1 go build -o gaia

cd ..
docker build --tag olympos/gaia:1.0 .