package tasks

import (
	"os/exec"
	"log"
)

const (
	GCC_FILE_ARG = "file"
	GCC_OUTPUT_ARG = "output"
)

type Gcc struct {
	file	string
	output	string
}

func (t *Gcc) Configure(args map[string]string) statusCode {
	val, ok := args[GCC_FILE_ARG]

	if !ok {
		return StatusConfigurationError
	}
	t.file = val

	val, ok = args[GCC_OUTPUT_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.output = val

	return StatusOk
}

func (t *Gcc) Execute() statusCode {
	err := exec.Command("gcc", t.file, "-o", t.output).Run()

	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	return StatusOk
}

func (t *Gcc) GetName() string {
	return "gcc"
}