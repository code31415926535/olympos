package model

import "server/model/entities"

type EnvDAO interface {
	GetAllEnvs() ([]entities.Env, error)
	GetEnvByName(name string) (*entities.Env, error)
	CreateEnv(env entities.Env) (error)
	//UpdateEnv(env entities.Env) (error)
	DeleteEnv(env entities.Env) (error)
}
