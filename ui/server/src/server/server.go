package server

import (
	"net/http"
	"text/template"
	"log"
	"cfg"
	"fmt"
	"path"
	"os"
	"io/ioutil"
)

const (
	CONFIG_JSON_TEMPLATE_FILENAME = "configJson.js.template"
	CONFIG_JSON_FILENAME = "configJson.js"
)

type UiServer interface {
	Configure() error
	Start() error
}

func NewUiServer() UiServer {
	return &uiServer{}
}

type uiConfig struct {
	AresPort	int
}

type uiServer struct {
	staticDir	string
	port		int
	config		*uiConfig
}

func (s *uiServer) parseConfigJson() error {
	templateFileName := path.Join(s.staticDir, CONFIG_JSON_TEMPLATE_FILENAME)
	outputFileName := path.Join(s.staticDir, CONFIG_JSON_FILENAME)

	tmp, err := ioutil.ReadFile(templateFileName)
	if err != nil {
		return err
	}

	outputFile, err := os.Create(outputFileName)
	if err != nil {
		return err
	}

	t := template.New("configJson")
	t, err = t.Parse(string(tmp))
	if err != nil {
		return err
	}

	err = t.Execute(outputFile, s.config)
	if err != nil {
		return err
	}

	err = os.Remove(templateFileName)
	if err != nil {
		return err
	}

	return nil
}

func (s *uiServer) Configure() error {
	s.staticDir = cfg.StaticDir()
	s.port = cfg.AphroditePort()
	s.config = &uiConfig{
		AresPort: cfg.AresPort(),
	}

	err := s.parseConfigJson()
	if err != nil {
		return err
	}

	return nil
}

func (s *uiServer) Start() error {
	fs := http.FileServer(http.Dir(s.staticDir))
	http.Handle("/", fs)

	log.Printf("Running UI server on: %d\n", s.port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", s.port), nil)

	return err
}