#!/usr/bin/env bash

export TEST_ROOT=/tmp/olympos/stage/3a439a0f-8859-4a50-9f5d-23567789b61d
export OUT_ROOT=/tmp/olympos/out/3a439a0f-8859-4a50-9f5d-23567789b61d
export UUID=testuuid

go run main.go

unset UUID
unset TEST_ROOT
unset OUT_ROOT
