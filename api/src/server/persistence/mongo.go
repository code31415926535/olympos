package persistence

import (
	mgo "gopkg.in/mgo.v2"
	"logger"
)


func SetupMongoConnection() (error) {
	if session == nil {
		logger.Log.Info("Setting up mongo connection ...")

		//var mongoDialInfo = &mgo.DialInfo{
		//	Addrs:    []string{fmt.Sprintf("%s:%d", cfg.AthenaHostname(), cfg.AthenaPort())},
		//	Database: cfg.AthenaDbName(),
		//	Timeout: 10*time.Second,
		//}

		s, err := mgo.Dial("localhost")
		if err != nil {
			logger.Log.Error(err.Error())
			return err
		}

		logger.Log.Info("done!")
		session = s
		return nil
	}

	logger.Log.Info("Mongo connection already set up!")
	return nil
}

func Session() *mgo.Session {
	return session.Clone()
}

var session *mgo.Session = nil