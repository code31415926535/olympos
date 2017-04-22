package server

import (
	"github.com/emicklei/go-restful"
	"net/http"
	"fmt"
	"types"
	"logger"
	"cfg"
	"system"
)

var Log = logger.Log

type RestServer struct {
	port	int
}

func (s *RestServer) CreateServer() {
	s.port = cfg.Port()
	ws := new(restful.WebService)
	ws.Consumes(restful.MIME_JSON)
	ws.Produces(restful.MIME_JSON)
	ws.Route(ws.POST("/").To(createJob))

	restful.Add(ws)
}

func (s *RestServer) ListenAndServe() {
	Log.Info("Server Started!")
	err := http.ListenAndServe(fmt.Sprintf(":%d", s.port), nil)
	if err != nil {
		Log.Error(err)
	}
}

func createJob(req *restful.Request, resp *restful.Response) {
	var job *types.Job = new(types.Job)
	err := req.ReadEntity(job)
	if err != nil {
		Log.Error(err)
		resp.WriteErrorString(http.StatusBadRequest, err.Error())
		return
	}

	system.CreateExecution(job)
}