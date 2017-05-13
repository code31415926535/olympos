package system

import (
	"types"
	"path"
	"cfg"
	"fmt"
	"github.com/op/go-logging"
	"os"
	"time"
	"execution_engine"
	"io/ioutil"
	"encoding/json"
	"net/http"
	"bytes"
)

type exitStatus string

const (
	ExitStatusNone exitStatus = "ExitStatusNone"

	ExitStatusCheckFail 	exitStatus = "ExitStatusCheckFail"
	ExitStatusStageFail 	exitStatus = "ExitStatusStageFail"
	ExitStatusCreationFail	exitStatus = "ExitStatusCreationFail"
	ExitStatusPollFail	exitStatus = "ExitStatusPollFail"
	ExitStatusTimeout	exitStatus = "ExitStatusTimeout"
	ExitStatusGetResultFail exitStatus = "ExitStatusGetResultFail"

	ExitStatusSuccess exitStatus = "ExitStatusSuccess"
)

type pollResult	string

const (
	PollResultTimeout 	pollResult = "PollResultTimeout"
	PollResultError		pollResult = "PollResultError"
	PollResultDone		pollResult = "PollResultDone"
)

type execution struct {
	job        	*types.Job
	stagingDir 	string
	outputDir	string
	id         	string
	log        	*logging.Logger
	exitStatus	exitStatus
	timeout		time.Duration
	pollInterval 	time.Duration
	containerId	string
	testResult	*types.TestResult
}

func (e *execution) String() string {
	return fmt.Sprintf(`
		job:
				uuid:		%s
				environment: 	%s
				test:		%s
				submitted file: %s
		stagingDir: 	%s
		outputDir:	%s
		id: 		%s
		exitStatus: 	%s
		timeout:	%s
		containerId:	%s
		testResult:	%s
	`,
		e.job.Uuid,
		e.job.TestInfo.Environment.Image,
		e.job.TestInfo.Name,
		e.job.Submission.SubmissionFile,
		e.stagingDir,
		e.outputDir,
		e.id,
		e.exitStatus,
		e.timeout,
		e.containerId,
		e.testResult)
}

func (e *execution) main() {
	e.config()
	e.log.Debugf("Starting execution id: %d", e.id)

	if e.check() == false {
		e.log.Errorf("failed execution check!")
		e.abort(ExitStatusCheckFail)
		return
	}
	e.log.Debug("check passed!")

	err := e.stage()
	if err != nil {
		e.log.Errorf("failed to stage job!")
		e.abort(ExitStatusStageFail)
		return
	}
	e.log.Debug("staging completed!")

	err = e.create()
	if err != nil {
		e.log.Errorf("falied to create container for job!")
		e.abort(ExitStatusCreationFail)
		return
	}
	e.log.Debug("Started execution container!")

	e.log.Debugf("kill-timeout is: %s", e.timeout)
	e.log.Debugf("polling every [%s] second(s)", e.pollInterval)
	result := e.poll()

	switch result {
	case PollResultError:
		e.log.Error("failed to poll execution container!")
		e.abort(ExitStatusPollFail)
		return
	case PollResultTimeout:
		e.log.Error("execution timed out!")
		e.abort(ExitStatusTimeout)
		return
	}

	e.log.Debug("Execution container finished!")

	err = e.getResult()
	if err != nil {
		e.log.Errorf("failed to get result")
		e.abort(ExitStatusGetResultFail)
		return
	}

	e.succeed()
}

func (e *execution) config() {
	e.stagingDir = path.Join(cfg.StagingDir(), e.job.Uuid)
	e.outputDir = path.Join(cfg.OutputDir(), e.job.Uuid)
	e.id = fmt.Sprintf("exec-%d", cfg.ExecutionId())
	e.log = logging.MustGetLogger(e.id)
	e.exitStatus = ExitStatusNone
	e.timeout = cfg.Timeout()
	e.pollInterval = cfg.PollInterval()
	e.testResult = nil
}

func (e *execution) check() bool {
	env := e.job.TestInfo.Environment
	if env.CheckImage() != true {
		return false
	}
	return true
}

func (e *execution) stage() error {
	e.log.Debugf("Creating staging dir...")
	err := os.MkdirAll(e.stagingDir, 0666)
	if err != nil {
		e.log.Error(err.Error())
		return err
	}

	e.log.Debugf("Creating output dir...")
	err = os.MkdirAll(e.outputDir, 0666)
	if err != nil {
		e.log.Error(err.Error())
		return err
	}

	testFiles := e.job.TestInfo.Files

	for _, file := range testFiles {
		e.log.Debugf("Creating file: %s...", file.Name)
		err = file.Create(e.stagingDir)
		if err != nil {
			e.log.Error(err.Error())
			return err
		}
	}

	submittedFile := e.job.Submission.SubmissionFile
	e.log.Debugf("Creating submitted file: %s...", submittedFile.Name)
	err = submittedFile.Create(e.stagingDir)
	if err != nil {
		e.log.Error(err.Error())
		return err
	}

	e.log.Debug("Staging done!")
	return nil
}

func (e *execution) create() error {
	e.log.Debug("Creating execution context...")

	// TODO: make a way to add environment variables to the container
	sysEnv := make(map[string]string)

	ctx := execution_engine.ExecutionContext {
		CoreMount: execution_engine.Volume {
			HostPath: e.stagingDir,
			DestinationPath: e.job.TestInfo.Environment.TestMount,
		},
		OutputMount: execution_engine.Volume {
			HostPath: e.outputDir,
			DestinationPath: e.job.TestInfo.Environment.OutMount,
		},
		SysEnv: sysEnv,
	}

	e.log.Debugf("Creating container ...")
	e.log.Debugf("Container name: %s", e.id)
	e.log.Debugf("Container image: %s", e.job.TestInfo.Environment.Image)
	e.log.Debugf("Container context: %s", ctx)
	containerId, err := cfg.ExecutionEngine().CreateContainer(e.id, e.job.TestInfo.Environment.Image, ctx)
	if err != nil {
		e.log.Error(err.Error())
		return err
	}

	e.containerId = containerId
	return nil
}

func (e *execution) poll() pollResult {
	killTimeout := time.After(e.timeout)
	pollTimeout := time.Tick(e.pollInterval)

	for {
		select {
		case <- pollTimeout:
			e.log.Debug("polling ...")
			finished, err := cfg.ExecutionEngine().ContainerFinished(e.containerId)
			if err != nil {
				e.log.Error(err.Error())
				return PollResultError
			}

			if finished {
				return PollResultDone
			}

		case <- killTimeout:
			return PollResultTimeout
		}
	}
}

func (e *execution) getResult() error {
	e.log.Debug("Getting results ...")

	resultDateFile := path.Join(e.outputDir, "result.json")
	data, err := ioutil.ReadFile(resultDateFile)
	if err != nil {
		e.log.Error(err.Error())
		return err
	}

	var testResult *types.TestResult
	testResult = &types.TestResult{}

	err = json.Unmarshal(data, testResult)
	if err != nil {
		e.log.Error(err.Error())
		return err
	}

	e.testResult = testResult
	return nil
}

func (e *execution) abort(status exitStatus) {
	e.exitStatus = status
	e.log.Debug("Execution aborted ...")
	e.log.Debug(e)
	e.finnish()
}

func (e *execution) succeed() {
	e.exitStatus = ExitStatusSuccess
	e.log.Debug(e)
	e.finnish()
}

func (e *execution) finnish() {
	e.cleanup()
	e.respond()
}

func (e *execution) cleanup() bool {
	ok := true

	e.log.Debug("Getting logs ...")
	logs, err := cfg.ExecutionEngine().GetContainerLogs(e.containerId)
	if err != nil {
		e.log.Error(err.Error())
		ok = false
	}
	e.job.Log = logs

	e.log.Debug("Creating file for logs ...")
	logFilePath := path.Join(cfg.LogDir(), fmt.Sprintf("%s.log", e.id))
	osLogFile, err := os.Create(logFilePath)
	if err != nil {
		e.log.Error(err.Error())
		ok = false
	}
	defer osLogFile.Close()

	e.log.Debug("Writing logs to file ...")
	_, err = osLogFile.WriteString(logs)
	if err != nil {
		e.log.Error(err.Error())
		ok = false
	}

	e.log.Debug("Removing container ...")
	err = cfg.ExecutionEngine().RemoveContainer(e.containerId)
	if err != nil {
		e.log.Error(err.Error())
		ok = false
	}

	if ok {
		e.log.Debug("Cleanup complete!")
	}

	return ok
}

func (e *execution) respond() {
	if e.testResult == nil {
		e.log.Warning("No result ... creating empty result ...")
		e.testResult = &types.TestResult{}
	}

	e.log.Debug("Sending response ...")

	jsonData, err := json.Marshal(e.testResult)
	if err != nil {
		e.log.Error(err)
		return
	}

	e.log.Debug(cfg.AresReturnUrl(e.job.Uuid))
	e.log.Debug(string(jsonData))
	req, err := http.NewRequest(http.MethodPost, cfg.AresReturnUrl(e.job.Uuid), bytes.NewBuffer(jsonData))
	if err != nil {
		e.log.Error(err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		e.log.Error(err)
		return
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		e.log.Error(res.StatusCode)
	}
}
