package types

import (
	"logger"
	"cfg"
)

var Log = logger.Log

type Env struct {
	Name		string `json:"name"`
	Image		string `json:"image"`
	Description 	string `json:"description"`
	TestMount	string `json:"test_mount"`
	OutMount	string `json:"out_mount"`
}

func (e Env) CheckImage() (bool) {
	exists, err := cfg.ExecutionEngine().CheckIfImageExists(e.Image)
	if err != nil {
		Log.Error(err.Error())
		return false
	}

	return exists
}