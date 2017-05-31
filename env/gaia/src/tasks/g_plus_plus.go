package tasks

import (
	"os/exec"
	"log"
)

const (
	G_PLUS_PLUS_FILE_ARG = "file"
	G_PLUS_PLUS_OUTPUT_ARG = "output"
)

type GPlusPlus struct {
	file	string
	output	string
}

func (t *GPlusPlus) Configure(args map[string]string) statusCode {
	val, ok := args[G_PLUS_PLUS_FILE_ARG]

	if !ok {
		return StatusConfigurationError
	}
	t.file = val

	val, ok = args[G_PLUS_PLUS_OUTPUT_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.output = val

	return StatusOk
}

func (t *GPlusPlus) Execute() statusCode {
	err := exec.Command("g++", t.file, "-o", t.output).Run()

	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	return StatusOk
}

func (t *GPlusPlus) GetName() string {
	return "g++"
}
