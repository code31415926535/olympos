package controllers

import "server/model"

type ControllerId int

const (
	EnvControllerId ControllerId = iota
)


type ControllerFactory interface {
	GetController(controllerId ControllerId, factory model.DaoFactory) Controller
}
