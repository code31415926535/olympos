package tasks

import (
	"strings"
	"os/exec"
	"log"
)


const (
	PYTHON_COMMAND_ARG = "command"
	PYTHON_ARGS_ARG = "args"
)

type Python struct {
	args		[]string
}

func (t *Python) Configure(args map[string]string) statusCode {
	val, ok := args[PYTHON_COMMAND_ARG]

	if !ok {
		return StatusConfigurationError
	}
	t.args = make([]string, 0)
	t.args = append(t.args, val)

	val, ok = args[PYTHON_ARGS_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.args = append(t.args, strings.Split(val, " ")...)

	return StatusOk
}

func (t *Python) Execute() statusCode {
	err := exec.Command("python2.7", t.args...).Run()

	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	return StatusOk
}

func (t *Python) GetName() string {
	return "python"
}
