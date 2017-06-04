#!/usr/bin/env bash

npm run build

cd ./server
export GOPATH=`pwd`
cd ./src
CGO_ENABLED=1 go build -o aphrodite
cd ../..

docker build --tag olympos/aphrodite:latest .