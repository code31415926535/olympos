package main

import (
	"server"
	"log"
	"cfg"
)

func main() {
	safe := func(err error) {
		if err != nil {
			log.Fatal(err)
		}
	}

	cfg.CreateFromEnv()
	uiServer := server.NewUiServer()
	safe(uiServer.Configure())
	safe(uiServer.Start())
}