package controllers_impl

import (
	"server/controllers"
	"server/model"
)

type ControllerFactoryImpl struct {}

func (ControllerFactoryImpl) GetController(controllerId controllers.ControllerId, factory model.DaoFactory) controllers.Controller {
	switch controllerId {
	case controllers.EnvControllerId:
		return &EnvController{
			DaoFactory: factory,
		}
	default:
		return nil
	}
}