package types

import (
	"os"
	"logger"
	"path"
)

type File struct {
	Name	string `json:"name"`
	Content	string `json:"content"`
}

func (f File) Create(stagingDir string) error {
	fullPath := path.Join(stagingDir, f.Name)
	filePath, _ := path.Split(fullPath)

	err := os.MkdirAll(filePath, 0666)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	osFile, err := os.Create(fullPath)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}
	defer osFile.Close()

	_, err = osFile.WriteString(f.Content)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	return nil
}