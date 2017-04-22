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
)

const (
	CodeTimeout 	channelUpdate = 1
	CodePoll	channelUpdate = 2
)

const (
	ExitStatusNone exitStatus = "ExitStatusNone"

	ExitStatusCheckFail 	exitStatus = "ExitStatusCheckFail"
	ExitStatusStageFail 	exitStatus = "ExitStatusStageFail"
	ExitStatusCreationFail	exitStatus = "ExitStatusCreationFail"

	ExitStatusSuccess exitStatus = "ExitStatusSuccess"
)

type channelUpdate int
type exitStatus string

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
	channel		chan channelUpdate
}

func (e *execution) String() string {
	return fmt.Sprintf(`
		job:
				uuid:		%s
				environment: 	%s
				testfiles: 	%s
				submitted file: %s
		stagingDir: 	%s
		outputDir:	%s
		id: 		%s
		exitStatus: 	%s
		timeout:	%s
		containerId:	%s
	`,
		e.job.Uuid,
		e.job.TestInfo.Environment,
		e.job.TestInfo.Files,
		e.job.Submission.SubmissionFile,
		e.stagingDir,
		e.outputDir,
		e.id,
		e.exitStatus,
		e.timeout,
		e.containerId)
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

	e.createCommunicationChannel()
	e.setTimeout()
	e.setPoll()
	e.log.Debug("kill-timeout is: %s", e.timeout)
	e.log.Debug("polling every [%s] second(s)", e.pollInterval)

	// TODO: continue with polling from here
	time.Sleep(1000*time.Second)

	e.finnish()
}

func (e *execution) config() {
	e.stagingDir = path.Join(cfg.StagingDir(), e.job.Uuid)
	e.outputDir = path.Join(cfg.OutputDir(), e.job.Uuid)
	e.id = fmt.Sprintf("exec-%d", cfg.ExecutionId())
	e.log = logging.MustGetLogger(e.id)
	e.exitStatus = ExitStatusNone
	e.timeout = cfg.Timeout()
	e.pollInterval = cfg.PollInterval()
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
	e.log.Debugf("Creating execution context...")

	sysEnv:= make(map[string]string)
	for _, config := range e.job.TestInfo.Config {
		sysEnv[config.Key] = config.Value
	}

	ctx := execution_engine.ExecutionContext {
		CoreMount: execution_engine.Volume {
			HostPath: e.stagingDir,
			DestinationPath: e.job.TestInfo.GetConfig("TEST_ROOT"),
		},
		OutputMount: execution_engine.Volume {
			HostPath: e.outputDir,
			DestinationPath: e.job.TestInfo.GetConfig("OUT_ROOT"),
		},
		SysEnv: sysEnv,
	}

	e.log.Debugf("Creating container ...")
	containerId, err := cfg.ExecutionEngine().CreateContainer(e.id, e.job.TestInfo.Environment.Image, ctx)
	if err != nil {
		e.log.Error(err.Error())
		return err
	}

	e.containerId = containerId
	return nil
}

func (e *execution) createCommunicationChannel() {
	e.channel = make(chan channelUpdate)
}

func (e *execution) setTimeout() {
	timer(e.channel, e.timeout, CodeTimeout)
}

func (e *execution) setPoll() {
	timer(e.channel, e.pollInterval, CodePoll)
}

func (e *execution) abort(status exitStatus) {
	e.exitStatus = status
	e.log.Debug(e)
	// TODO: post-execution task called from here
}

func (e *execution) finnish() {
	e.exitStatus = ExitStatusSuccess
	e.log.Debug(e)
	// TODO: post-execution task called from here
}