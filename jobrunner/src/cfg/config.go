package cfg

import (
	"execution_engine"
	"sync"
	"time"
	"path/filepath"
	"os"
	"strconv"
	"fmt"
)

const (
	HERMES_PORT_ENV = "HERMES_PORT"

	HERMES_TIMEOUT_ENV = "HERMES_TIMEOUT"
	HERMES_POLL_INTERVAL_ENV = "HERMES_POLL_INTERVAL"

	HERMES_STAGING_DIR_ENV = "HERMES_STAGING_DIR"
	HERMES_OUTPUT_DIR_ENV = "HERMES_OUTPUT_DIR"
	HERMES_LOG_DIR_ENV = "HERMES_LOG_DIR"

	ARES_HOST_ENV = "ARES_HOST"
	ARES_PORT_ENV = "ARES_PORT"
)

func CreateDefault() {
	port = 8087
	executionEngine = execution_engine.DockerExecutionEngine{}

	stagingDir, _ = filepath.Abs("./stage")
	outputDir, _ = filepath.Abs("./out")
	logDir, _ = filepath.Abs("./log")

	executionId = 1
	timeout = 10 * time.Second
	pollInterval = 3 * time.Second

	aresHost = "localhost"
	aresPort = 8080
}

func CreateFromEnv() {
	port, _ = strconv.Atoi(os.Getenv(HERMES_PORT_ENV))
	executionEngine = execution_engine.DockerExecutionEngine{}

	stagingDir, _ = filepath.Abs(os.Getenv(HERMES_STAGING_DIR_ENV))
	outputDir, _ = filepath.Abs(os.Getenv(HERMES_OUTPUT_DIR_ENV))
	logDir, _ = filepath.Abs(os.Getenv(HERMES_LOG_DIR_ENV))

	executionId = 1
	timeoutSecs, _ := strconv.Atoi(os.Getenv(HERMES_TIMEOUT_ENV))
	pollIntervalSecs, _ := strconv.Atoi(os.Getenv(HERMES_POLL_INTERVAL_ENV))

	timeout = time.Duration(timeoutSecs) * time.Second
	pollInterval = time.Duration(pollIntervalSecs) * time.Second

	aresHost = os.Getenv(ARES_HOST_ENV)
	aresPort, _ = strconv.Atoi(os.Getenv(ARES_PORT_ENV))
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

func LogDir() string {
	return logDir
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

func AresReturnUrl(jobUuid string) string {
	return fmt.Sprintf("http://%s:%d/job/%s/result", aresHost, aresPort, jobUuid)
}

var 	port 		int
var	executionEngine	execution_engine.ExecutionEngine

var	stagingDir	string
var	outputDir	string
var	logDir		string

var	executionId 		int
var	executionIdLock	 	sync.Mutex

var	timeout		time.Duration
var	pollInterval	time.Duration

var	aresHost	string
var	aresPort	int