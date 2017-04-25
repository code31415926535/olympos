package main

import (
	"logger"
	"cfg"
	"server"
	"server/controllers/implementation"
	"server/model/implementation"
	"server/persistence"
)

func main() {

	logger.InitLogger()

	logger.Log.Info("Using default config map")
	cfg.CreateDefault()

	err := persistence.SetupMongoConnection()
	if err != nil {
		panic("Failed to connect to db!")
	}

	logger.Log.Info("Starting Ares API server ...")
	server.
		NewRestServer(controllers_impl.ControllerFactoryImpl{}, model_impl.DaoFactoryImpl{}).
		AllControllers().
		CreateSwagger().
		ListenAndServe()
}
