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

	HERMES_HOST_STAGING_MOUNT_ENV = "HERMES_HOST_STAGING_MOUNT"
	HERMES_HOST_OUT_MOUNT_ENV = "HERMES_HOST_OUT_MOUNT"

	ARES_HOSTNAME_ENV = "ARES_HOSTNAME"
	ARES_PORT_ENV = "ARES_PORT"

	HERMES_USERNAME_ENV = "HERMES_USERNAME"
	HERMES_PASSWORD_ENV = "HERMES_PASSWORD"
)

func CreateDefault() {
	port = 8087
	executionEngine = execution_engine.DockerExecutionEngine{}

	stagingDir, _ = filepath.Abs("./stage")
	hostStagingDir = stagingDir
	outputDir, _ = filepath.Abs("./out")
	hostOutputDir = outputDir
	logDir, _ = filepath.Abs("./log")

	executionId = 1
	timeout = 10 * time.Second
	pollInterval = 3 * time.Second

	aresHost = "localhost"
	aresPort = 8080

	hermesUsername = "jobrunner"
	hermesPassword = "jobrunner"
}

func CreateFromEnv() {
	port, _ = strconv.Atoi(os.Getenv(HERMES_PORT_ENV))
	executionEngine = execution_engine.DockerExecutionEngine{}

	stagingDir, _ = filepath.Abs(os.Getenv(HERMES_STAGING_DIR_ENV))
	hostStagingDir = os.Getenv(HERMES_HOST_STAGING_MOUNT_ENV)
	outputDir, _ = filepath.Abs(os.Getenv(HERMES_OUTPUT_DIR_ENV))
	hostOutputDir = os.Getenv(HERMES_HOST_OUT_MOUNT_ENV)
	logDir, _ = filepath.Abs(os.Getenv(HERMES_LOG_DIR_ENV))

	executionId = 1
	timeoutSecs, _ := strconv.Atoi(os.Getenv(HERMES_TIMEOUT_ENV))
	pollIntervalSecs, _ := strconv.Atoi(os.Getenv(HERMES_POLL_INTERVAL_ENV))

	timeout = time.Duration(timeoutSecs) * time.Second
	pollInterval = time.Duration(pollIntervalSecs) * time.Second

	aresHost = os.Getenv(ARES_HOSTNAME_ENV)
	aresPort, _ = strconv.Atoi(os.Getenv(ARES_PORT_ENV))

	hermesUsername = os.Getenv(HERMES_USERNAME_ENV)
	hermesPassword = os.Getenv(HERMES_PASSWORD_ENV)
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

func HostStagingDir() string {
	return hostStagingDir
}

func OutputDir() string {
	return outputDir
}

func HostOutputDir() string {
	return hostOutputDir
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

func AresAuthUrl() string {
	return fmt.Sprintf("http://%s:%d/auth", aresHost, aresPort)
}

func HermesUsername() string {
	return hermesUsername
}

func HermesPassword() string {
	return hermesPassword
}

var 	port 		int
var	executionEngine	execution_engine.ExecutionEngine

var	stagingDir	string
var	hostStagingDir	string
var	outputDir	string
var	hostOutputDir	string
var	logDir		string

var	executionId 		int
var	executionIdLock	 	sync.Mutex

var	timeout		time.Duration
var	pollInterval	time.Duration

var	aresHost	string
var	aresPort	int

var	hermesUsername	string
var	hermesPassword	string