package model_impl

import "server/model"

type DaoFactoryImpl struct {}

func (DaoFactoryImpl) GetEnvDao() model.EnvDAO {
	return &EnvDAOImpl{}
}