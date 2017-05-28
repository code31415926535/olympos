# Olympos testing framework

Olympos is my Final Examination proiect. It consists of 5 modules:
 - Athena: mongodb database.
 - Ares: rest-api server.
 - Hermes: jobrunner.
 - Gaia: testing environment.
 - Aphrodite: ui.
 
# How to run

## Prerequisites

Docker - version >= `1.12.6`
Go - version >= `1.8`

## Build

To build the api server:
```sh
cd ./api
./build.sh
```

To build the database server:
```sh
cd ./db
./build.sh
```

To build the testing environment:
```sh
cd ./env/gaia
./build.sh
```

To build the jobrunner:
```sh
cd ./jobrunner
./build.sh
```

To build the ui:
`WORK IN PROGRESS`

## Running

1. `cd ./util`.
2. Optional: Change the configuration in `install.conf` (NOT TESTED)
3. Run `install.sh` to install olympos.
