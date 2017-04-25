package model_impl

import (
	"server/model/entities"
	"server/persistence"
	"cfg"
	"logger"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const (
	EnvCollection = "envs"
)

type EnvDAOImpl struct {}

func (e EnvDAOImpl) GetAllEnvs() ([]entities.Env, error) {
	var result []entities.Env = []entities.Env{}

	session := persistence.Session()

	err := session.DB(cfg.AthenaDbName()).C(EnvCollection).Find(nil).All(&result)
	if err != nil {
		logger.Log.Error(err.Error())
		return nil, err
	}

	return result, err
}

func (e EnvDAOImpl) GetEnvByName(name string) (*entities.Env, error) {
	var result entities.Env = entities.Env{}

	session := persistence.Session()

	err := session.DB(cfg.AthenaDbName()).C(EnvCollection).Find(bson.M{"name":name}).One(&result)
	if err != nil {
		logger.Log.Error(err.Error())
		return nil, err
	}

	return &result, nil
}

func (e EnvDAOImpl) CreateEnv(env entities.Env) error {
	session := persistence.Session()

	err := session.DB(cfg.AthenaDbName()).C(EnvCollection).Insert(env)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	return nil
}

func (e EnvDAOImpl) DeleteEnv(env entities.Env) (error) {
	_ := persistence.Session()

	return nil
}