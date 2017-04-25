package model

type DaoFactory interface {
	GetEnvDao() EnvDAO
}