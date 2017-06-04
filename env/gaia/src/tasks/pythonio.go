package tasks

import (
	"strings"
	"os/exec"
	"log"
	"os"
)

const (
	PYTHONIO_COMMAND_ARG = "command"
	PYTHONIO_ARGS_ARG = "args"
	PYTHONIO_INPUT_FILE = "input"
	PYTHONIO_OUTPUT_FILE = "output"
)

type PythonIO struct {
	args		[]string
	input		string
	output		string
}

func (t *PythonIO) Configure(args map[string]string) statusCode {
	val, ok := args[PYTHONIO_COMMAND_ARG]

	if !ok {
		return StatusConfigurationError
	}
	t.args = make([]string, 0)
	t.args = append(t.args, val)

	val, ok = args[PYTHONIO_ARGS_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.args = append(t.args, strings.Split(val, " ")...)

	val, ok = args[PYTHONIO_INPUT_FILE]
	if !ok {
		return StatusConfigurationError
	}
	t.input = val

	val, ok = args[PYTHONIO_OUTPUT_FILE]
	if !ok {
		return StatusConfigurationError
	}
	t.output = val

	return StatusOk
}

func (t *PythonIO) Execute() statusCode {
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

	cmd := exec.Command("python", t.args...)
	cmd.Stdin = inputFile
	cmd.Stdout = outputFile

	err = cmd.Run()
	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	return StatusOk
}

func (t *PythonIO) GetName() string {
	return "python_io"
}
