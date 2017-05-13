#!/bin/bash

export GOPATH=`pwd`
cd ./src
go get github.com/emicklei/go-restful
go get github.com/fsouza/go-dockerclient
go get github.com/op/go-logging

CGO_ENABLED=1 go build -o hermes

cd ..
docker build --tag olympos/hermes:latest .