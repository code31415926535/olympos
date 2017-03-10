export CRIMSON_PROTOCOL=http
export CRIMSON_PORT=8080
export LOG_LEVEL=debug
export DB_HOSTNAME=localhost
export DB_PORT=5432
export DB_NAME=test

nodejs app

unset CRIMSON_PROTOCOL
unset CRIMSON_PORT
unset LOG_LEVEL
unset DB_HOSTNAME
unset DB_PORT
unset DB_NAME

