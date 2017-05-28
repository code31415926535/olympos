#!/usr/bin/env bash

export TEST_ROOT=/home/iamgod/Documents/weCode/tests/hello/test
export OUT_ROOT=/home/iamgod/Documents/weCode/tests/hello
export UUID=testuuid

go run main.go

unset UUID
unset TEST_ROOT
unset OUT_ROOT