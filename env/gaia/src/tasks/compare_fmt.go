package tasks

import (
	"io/ioutil"
	"strings"
	"tasks/util"
)

const (
	COMPARE_FMT_ACTUAL_ARG = "actual"
	COMPARE_FMT_EXPECTED_ARG = "expected"
)

var removeEmpty = func (item string) bool {
	if item == "" {
		return false
	}

	return true
}

type CompareFmt struct {
	actual		string
	expected	string
}

func (t *CompareFmt) Configure(args map[string]string) statusCode {
	val, ok := args[COMPARE_FMT_ACTUAL_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.actual = val

	val,ok = args[COMPARE_FMT_EXPECTED_ARG]
	if !ok {
		return StatusConfigurationError
	}
	t.expected = val

	return StatusOk
}

func (t *CompareFmt) compareLines(lineActual, lineExpected string) statusCode {
	runesActual := strings.Split(lineActual, " ")
	runesExpected := strings.Split(lineExpected, " ")

	runesActual = util.Filter(runesActual, removeEmpty)
	runesExpected = util.Filter(runesExpected, removeEmpty)

	if len(runesActual) != len(runesExpected) {
		return StatusAssertFail
	}

	for id := range runesActual {
		if runesActual[id] != runesExpected[id] {
			return StatusAssertFail
		}
	}

	return StatusAssertOk
}

func (t *CompareFmt) Execute() statusCode {
	fileActual, err := ioutil.ReadFile(t.actual)
	if err != nil {
		return StatusExecutionError
	}

	fileExpected, err := ioutil.ReadFile(t.expected)
	if err != nil {
		return StatusExecutionError
	}

	actualLines := strings.Split(string(fileActual), "\n")
	expectedLines := strings.Split(string(fileExpected), "\n")

	actualLines = util.Filter(actualLines, removeEmpty)
	expectedLines = util.Filter(expectedLines, removeEmpty)

	if len(actualLines) != len(expectedLines) {
		return StatusAssertFail
	}

	for id := range actualLines {
		ok := t.compareLines(actualLines[id], expectedLines[id])
		if ok != StatusAssertOk {
			return StatusAssertFail
		}
	}

	return StatusAssertOk
}

func (t *CompareFmt) GetName() string {
	return "compare_fmt"
}