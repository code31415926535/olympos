#!/usr/bin/env bash

export ARES_PORT=8080
export ARES_HOSTNAME=localhost
export APHRODITE_PORT=3000

go run main.go

unset APHRODITE_PORT
unset ARES_PORT
unset ARES_HOSTNAME