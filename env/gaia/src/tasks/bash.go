package tasks

import (
	"os/exec"
	"log"
	"strings"
)

const (
	BASH_COMMAND_ARG = "command"
	BASH_ARGS_ARG = "args"
)

type Bash struct {
	command		string
	args		[]string
}

func (t *Bash) Configure(args map[string]string) statusCode {
	val, ok := args[BASH_COMMAND_ARG]

	if !ok {
		return StatusConfigurationError
	}
	t.command = val

	val, ok = args[BASH_ARGS_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.args = strings.Split(val, " ")

	return StatusOk
}

func (t *Bash) Execute() statusCode {
	err := exec.Command(t.command, t.args...).Run()

	if err != nil {
		log.Printf("execute error: %s\n", err.Error())
		return StatusExecutionError
	}

	return StatusOk
}

func (t *Bash) GetName() string {
	return "bash"
}