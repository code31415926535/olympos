export ARES_PROTOCOL=http
export ARES_PORT=8080

export LOG_LEVEL=debug

export ATHENA_HOSTNAME=localhost
export ATHENA_PORT=5432
export ATHENA_NAME=test

export HERMES_PORT=8087
export HERMES_HOSTNAME=localhost

nodejs app

unset ARES_PROTOCOL
unset ARES_PORT
unset LOG_LEVEL
unset ATHENA_HOSTNAME
unset ATHENA_PORT
unset ATHENA_NAME
unset HERMES_PORT
unset HERMES_HOSTNAME
