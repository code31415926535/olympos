package cfg

import (
	"os"
	"strconv"
)

const (
	ARES_PORT_ENV = "ARES_PORT"

	APHRODITE_PORT_ENV = "APHRODITE_PORT"
)

func CreateFromEnv() {
	aresPort, _ = strconv.Atoi(os.Getenv(ARES_PORT_ENV))

	aphroditePort, _ = strconv.Atoi(os.Getenv(APHRODITE_PORT_ENV))

	staticDir = "/var/www/static"
}

func AresPort() int {
	return aresPort
}

func AphroditePort() int {
	return aphroditePort
}

func StaticDir() string {
	return staticDir
}

var	aresPort	int

var 	aphroditePort	int

var	staticDir	string