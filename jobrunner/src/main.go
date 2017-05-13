package main

import (
	"server"
	"logger"
	"cfg"
)

func main() {

	logger.InitLogger()

	logger.Log.Info("Using default config map")
	cfg.CreateFromEnv()

	logger.Log.Info("Setting up execution engine...")
	cfg.ExecutionEngine().Setup()

	logger.Log.Info("Starting Hermes Job Runner...")
	s := server.RestServer{}
	s.CreateServer()
	s.ListenAndServe()
}
