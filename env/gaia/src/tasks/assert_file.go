package tasks

import (
	"io/ioutil"
	"bytes"
)

const (
	ASSERT_FILE_ACTUAL_ARG = "actual"
	ASSERT_FILE_EXPECTED_ARG = "expected"
)

type AssertFile struct {
	actual		string
	expected	string
}

func (t *AssertFile) Configure(args map[string]string) statusCode {
	val, ok := args[ASSERT_FILE_ACTUAL_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.actual = val

	val, ok = args[ASSERT_FILE_EXPECTED_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.expected = val

	return StatusOk
}

func (t *AssertFile) Execute() statusCode {
	fileActual, err := ioutil.ReadFile(t.actual)
	if err != nil {
		return StatusExecutionError
	}

	fileExpected, err := ioutil.ReadFile(t.expected)
	if err != nil {
		return StatusExecutionError
	}

	if !bytes.Equal(fileActual, fileExpected) {
		return StatusAssertFail
	}

	return StatusAssertOk
}

func (t *AssertFile) GetName() string {
	return "assert_file"
}