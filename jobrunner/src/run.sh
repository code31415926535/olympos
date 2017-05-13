#!/bin/bash

export HERMES_PORT=8087
export HERMES_TIMEOUT=20
export HERMES_POLL_INTERVAL=2

export HERMES_STAGING_DIR=./stage
export HERMES_OUTPUT_DIR=./out
export HERMES_LOG_DIR=./log

export ARES_HOST=localhost
export ARES_PORT=8080

./hermes

unset ARES_PORT
unset ARES_HOST

unset HERMES_POLL_INTERVAL
unset HERMES_TIMEOUT
unset HERMES_PORT
