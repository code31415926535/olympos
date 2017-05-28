package config

import (
	"os"
	"path"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

const (
	UUID_ENV = "UUID"
	TEST_ROOT_ENV = "TEST_ROOT"
	OUT_ROOT_ENV = "OUT_ROOT"

	TEST_CONFIG_FILE_NAME = "config.yaml"
)

type RootDefinition struct {
	Run	RunDefinition	`yaml:"run"`
}

type RunDefinition struct {
	Init	[]TaskDefinition 	`yaml:"init"`
	Test	[]TestDefinition	`yaml:"test"`
}

type TestDefinition struct {
	For	ForDefinition 	`yaml:"for"`
	Do	DoDefinition	`yaml:"do"`
}

type ForDefinition struct {
	Case	string	`yaml:"case"`
}

type DoDefinition struct {
	BeforeExecution	TaskDefinition `yaml:"beforeExecution"`
	Execute		TaskDefinition `yaml:"execute"`
	Evaluate	TaskDefinition `yaml:"evaluate"`
	AfterExecution	TaskDefinition `yaml:"afterExecution"`
}

type TaskDefinition struct {
	Name	string 			`yaml:"name"`
	Arg	map[string]string 	`yaml:"arg"`
}

func LoadConfig() {
	uuid = os.Getenv(UUID_ENV)

	testRoot = os.Getenv(TEST_ROOT_ENV)
	outRoot = os.Getenv(OUT_ROOT_ENV)
}

func LoadTestConfig() error {
	testFile := path.Join(testRoot, TEST_CONFIG_FILE_NAME)
	yamlData, err := ioutil.ReadFile(testFile)

	if err != nil {
		return err
	}

	err = yaml.Unmarshal(yamlData, &testConfig)
	if err != nil {
		return err
	}

	return nil
}

func Uuid() string {
	return uuid
}

func TestRoot() string {
	return testRoot
}

func OutRoot() string {
	return outRoot
}

func TestConfig() RootDefinition {
	return testConfig
}

var uuid 	string

var testRoot	string
var outRoot	string

var testConfig	RootDefinition