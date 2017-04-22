package logger

import (
	"github.com/op/go-logging"
	"os"
)

var Log *logging.Logger = logging.MustGetLogger("main")

func InitLogger() {
	var backend = logging.NewLogBackend(os.Stderr, "", 0)

	var format = logging.MustStringFormatter(
		`[%{time:15:04:05.000}] [%{shortfunc}] [%{level:.4s}] [%{module:.8s}] [%{message}]`,
	)

	var backendFormatter = logging.NewBackendFormatter(backend, format)
	logging.SetBackend(backendFormatter)
}
