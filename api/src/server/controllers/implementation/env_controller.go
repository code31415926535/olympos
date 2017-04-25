package controllers_impl

import (
	"github.com/emicklei/go-restful"
	"server/status"
	"logger"
	"server/model/entities"
	"server/model"
)

type EnvController struct {
	DaoFactory	model.DaoFactory
}

func (e EnvController) RegisterTo(container *restful.Container) () {
	ws := new(restful.WebService)

	logger.Log.Debug("Registering env controller ...")
	ws.
		Path("/env").
		Consumes(restful.MIME_JSON).
		Produces(restful.MIME_JSON)

	e.
		registerGetAllEnvs(ws).
		registerPostEnv(ws)

	container.Add(ws)
}

/*
	Get All Environments.
 */
func (e EnvController) registerGetAllEnvs(ws *restful.WebService) EnvController {
	ws.Route(
		ws.GET("/").
		To(e.getAllEnvs).
		Doc("Get all envs.").
		Operation("getAllEnvs").
		Writes([]entities.Env{}).
		Returns(status.Ok.Code(), status.Ok.Message(), []entities.Env{}).
		Returns(status.InternalServerError.Code(), status.InternalServerError.Message(), nil))

	return e
}

func (e EnvController) getAllEnvs(req *restful.Request, resp *restful.Response) {
	logger.Log.Debug("Geting all envs...")
	envs, err := e.DaoFactory.GetEnvDao().GetAllEnvs()
	if err != nil {
		logger.Log.Error(err.Error())
		resp.WriteErrorString(status.InternalServerError.Code(), status.InternalServerError.Message())
		return
	}

	logger.Log.Debug(envs)
	resp.WriteHeaderAndEntity(status.Ok.Code(), envs)
}

/*
	Create new Environment.
 */
func (e EnvController) registerPostEnv(ws *restful.WebService) EnvController {
	ws.Route(
		ws.POST("/").
		To(e.postEnv).
		Doc("Create a new env.").
		Operation("postEnv").
		Reads(entities.Env{}).
		Returns(status.Created.Code(), status.Created.Message(), entities.Env{}).
		Returns(status.BadRequest.Code(), status.BadRequest.Message(), nil).
		Returns(status.Conflict.Code(), status.Conflict.Message(), nil).
		Returns(status.InternalServerError.Code(), status.InternalServerError.Message(), nil))

	return e
}

func (e EnvController) postEnv(req *restful.Request, resp *restful.Response) {
	logger.Log.Debug("Creating env ...")
	env := entities.Env{}
	err := req.ReadEntity(&env)
	if err != nil {
		logger.Log.Error(err.Error())
		resp.WriteErrorString(status.BadRequest.Code(), status.BadRequest.Message())
		return
	}

	envDao := e.DaoFactory.GetEnvDao()

	err = envDao.CreateEnv(env)
	if err != nil {
		logger.Log.Error(err.Error())
		resp.WriteErrorString(status.InternalServerError.Code(), status.InternalServerError.Message())
		return
	}

	logger.Log.Debug(env)
	resp.WriteHeaderAndEntity(status.Created.Code(), env)
}