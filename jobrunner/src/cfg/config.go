package cfg

import (
	"execution_engine"
	"sync"
	"time"
)

func CreateDefault() {
	port = 8087
	executionEngine = execution_engine.DockerExecutionEngine{}
	stagingDir = "./hermes_stage"
	outputDir = "./hermes_out"
	executionId = 1
	timeout = 60 * time.Second
	pollInterval = 3 * time.Second
}

func Port() int {
	return port
}

func ExecutionEngine() execution_engine.ExecutionEngine {
	return executionEngine
}

func StagingDir() string {
	return stagingDir
}

func OutputDir() string {
	return outputDir
}

func ExecutionId() int {
	executionIdLock.Lock()
	var id = executionId
	executionId ++
	executionIdLock.Unlock()
	return id
}

func Timeout() time.Duration {
	return timeout
}

func PollInterval() time.Duration {
	return pollInterval
}

var 	port 		int
var	executionEngine	execution_engine.ExecutionEngine

var	stagingDir	string
var	outputDir	string

var	executionId 		int
var	executionIdLock	 	sync.Mutex

var	timeout		time.Duration
var	pollInterval	time.Duration