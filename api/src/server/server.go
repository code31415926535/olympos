package server

import (
	"github.com/emicklei/go-restful"
	"net/http"
	"fmt"
	"logger"
	"github.com/emicklei/go-restful-swagger12"
	"server/controllers"
	"cfg"
	"server/model"
)

type RestServer struct {
	container 		*restful.Container
	controllerFactory	controllers.ControllerFactory
	daoFactory		model.DaoFactory
}

func NewRestServer(controllerFactory controllers.ControllerFactory, daoFactory model.DaoFactory) *RestServer {
	return &RestServer{
		container: restful.DefaultContainer,
		controllerFactory: controllerFactory,
		daoFactory: daoFactory,

	}
}

func (s *RestServer) AllControllers() *RestServer {
	logger.Log.Info("Registering all controllers ...")

	controller := s.controllerFactory.GetController(controllers.EnvControllerId, s.daoFactory)
	controller.RegisterTo(s.container)

	return s
}

func (s *RestServer) CreateSwagger() *RestServer {
	config := swagger.Config {
		WebServices:    restful.DefaultContainer.RegisteredWebServices(),
		WebServicesUrl: fmt.Sprintf("http://localhost:%d", cfg.SwaggerPort()),
		ApiPath:        "/apidocs.json",

		SwaggerPath:     "/apidocs/",
		SwaggerFilePath: "/home/iamgod/Documents/olympos/swagger-ui-2.1.4/dist" }
	swagger.RegisterSwaggerService(config, restful.DefaultContainer)

	return s
}

func (s *RestServer) ListenAndServe() {
	logger.Log.Info("Starting server ...")

	if cfg.AresProtocol() == cfg.ProtocolHttp {
		err := http.ListenAndServe(fmt.Sprintf(":%d", cfg.AresPort()), nil)
		if err != nil {
			logger.Log.Error(err)
		}
	} else {
		logger.Log.Fatal("Https not supported ...")
	}

}