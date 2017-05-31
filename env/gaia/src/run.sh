#!/usr/bin/env bash

export TEST_ROOT=/tmp/olympos/stage/bf327b70-1789-494a-aadf-f768d4b169b1
export OUT_ROOT=/tmp/olympos/out/bf327b70-1789-494a-aadf-f768d4b169b1
export UUID=testuuid

go run main.go

unset UUID
unset TEST_ROOT
unset OUT_ROOT
