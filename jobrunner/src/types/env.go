package types

import (
	"logger"
	"cfg"
)

var Log = logger.Log

type Env struct {
	Image	string `json:"image"`
}

func (e Env) CheckImage() (bool) {
	exists, err := cfg.ExecutionEngine().CheckIfImageExists(e.Image)
	if err != nil {
		Log.Error(err.Error())
		return false
	}

	return exists
}
