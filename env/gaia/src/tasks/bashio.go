package tasks

import (
	"strings"
	"os/exec"
	"log"
	"os"
)

const (
	BASHIO_COMMAND_ARG = "command"
	BASHIO_ARGS_ARG = "args"
	BASHIO_INPUT_FILE = "input"
	BASHIO_OUTPUT_FILE = "output"
)

type BashIO struct {
	command		string
	args		[]string
	input		string
	output		string
}

func (t *BashIO) Configure(args map[string]string) statusCode {
	val, ok := args[BASHIO_COMMAND_ARG]

	if !ok {
		return StatusConfigurationError
	}
	t.command = val

	val, ok = args[BASHIO_ARGS_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.args = strings.Split(val, " ")

	val, ok = args[BASHIO_INPUT_FILE]
	if !ok {
		return StatusConfigurationError
	}
	t.input = val

	val, ok = args[BASHIO_OUTPUT_FILE]
	if !ok {
		return StatusConfigurationError
	}
	t.output = val

	return StatusOk
}

func (t *BashIO) Execute() statusCode {
	inputFile, err := os.Open(t.input)
	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	outputFile, err := os.Create(t.output)
	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	cmd := exec.Command(t.command, t.args...)
	cmd.Stdin = inputFile
	cmd.Stdout = outputFile

	err = cmd.Run()
	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	return StatusOk
}

func (t *BashIO) GetName() string {
	return "bash_io"
}
