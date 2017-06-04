# Olympos testing framework

Olympos is my Final Examination proiect. It consists of 5 modules:
 - Athena: mongodb database.
 - Ares: rest-api server.
 - Hermes: jobrunner.
 - Gaia: testing environment.
 - Aphrodite: ui.

For more information regarding each module, check out:
 - [Athena](db/README.md)
 - [Ares](api/README.md)
 - [Hermes](jobrunner/README.md)
 - [Gaia](env/gaia/README.md)
 - [Aphrodite](ui/README.md)

# How to run

## Prerequisites

### Runtime
Docker - version >= `1.12.6`

### Building
Go - version >= `1.8`

npm - version `5.0.0`

node - version `8.0.0`

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
```sh
cd ./ui
./build.sh
```

## Running

1. `cd ./util`.
2. Optional: Change the configuration in `install.conf` (NOT TESTED)
3. Run `install.sh` to install olympos.
