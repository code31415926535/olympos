package controllers

import (
	"github.com/emicklei/go-restful"
)

type Controller interface {
	RegisterTo(container *restful.Container) ()
}