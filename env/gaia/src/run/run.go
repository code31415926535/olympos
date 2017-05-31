package run

import (
	"os"
	"config"
	"log"
	"tasks"
	"fmt"
)

type statusCode int

const (
	StatusOk 		statusCode = 0
	StatusBadConfig 	statusCode = 1
	StatusRuntimeError	statusCode = 2
	StatusUnknown		statusCode = 255
)

type TestRunner struct {
	initTasks	[]tasks.Task
	testCases	map[string]TestCaseRunner
	testResult	*TestResult
}

func (tr *TestRunner) GetResult() *TestResult {
	return tr.testResult
}

func (tr *TestRunner) Start() (statusCode, error) {
	log.Println("preparing execution ...")
	err := tr.prepare()
	if err != nil {
		return StatusUnknown, fmt.Errorf("failed to prepare execution: %s\n", err.Error())
	}
	log.Println("execution ready!")

	log.Println("loading init tasks ...")
	err = tr.loadInitTasks()
	if err != nil {
		return StatusBadConfig, fmt.Errorf("failed to load init tasks: %s\n", err.Error())
	}
	log.Println("init tasks loaded!")

	log.Println("loading test cases ...")
	err = tr.loadTestCases()
	if err != nil {
		return StatusBadConfig, fmt.Errorf("failed to load test cases: %s\n", err.Error())
	}
	log.Println("test cases loaded!")

	log.Println("running init tasks ...")
	err = tr.performInitTasks()
	if err != nil {
		return StatusRuntimeError, fmt.Errorf("init tasks failed: %s\n", err.Error())
	}
	log.Println("init tasks done!")

	log.Println("running test cases ...")
	err = tr.performTestCases()
	if  err != nil {
		return StatusRuntimeError, fmt.Errorf("test cases failed: %s\n", err.Error())
	}
	log.Println("test cases done!")

	return StatusOk, nil
}

func (tr *TestRunner) prepare() error {
	tr.testCases = make(map[string]TestCaseRunner)

	caseResultArray := make([]CaseResult, 0)

	tr.testResult = &TestResult{
		Total: 0,
		Passed: 0,
		Failed: 0,
		Skipped: 0,

		Cases: caseResultArray,

		Result: FinalResult{},
	}

	err := os.Chdir(config.TestRoot())

	return err
}

func (tr *TestRunner) loadInitTasks() error {
	testConfig := config.TestConfig()

	for _, initTask := range testConfig.Run.Init {
		log.Println("loading init task:", initTask.Name)
		task, err := createTask(initTask)
		if err != nil {
			return err
		}

		if task == nil {
			return fmt.Errorf("failed to configure init task: %s", initTask.Name)
		}

		tr.initTasks = append(tr.initTasks, task)
	}

	return nil
}

func (tr *TestRunner) loadTestCases() error {
	testConfig := config.TestConfig()

	for _, testCaseDefinition := range testConfig.Run.Test {
		log.Println("loading test case for:", testCaseDefinition.For.Case)

		beforeExecutionTask, err := createTask(testCaseDefinition.Do.BeforeExecution)
		if err != nil {
			return err
		}

		executeTask, err := createTask(testCaseDefinition.Do.Execute)
		if err != nil {
			return err
		}

		evaluateTask, err := createTask(testCaseDefinition.Do.Evaluate)
		if err != nil {
			return err
		}

		afterExecutionTask, err := createTask(testCaseDefinition.Do.AfterExecution)
		if err != nil {
			return err
		}

		if executeTask == nil {
			return fmt.Errorf("execute task is not optional")
		}

		if evaluateTask == nil {
			return fmt.Errorf("evaluate task is not optional")
		}

		testCase := TestCaseRunner {
			beforeExecution: beforeExecutionTask,
			execute: executeTask,
			evaluate: evaluateTask,
			afterExecution: afterExecutionTask,
		}
		tr.testCases[testCaseDefinition.For.Case] = testCase
	}

	return nil
}

func (tr *TestRunner) performInitTasks() error {
	for _, initTask := range tr.initTasks {
		statusCode := initTask.Execute()
		if statusCode != tasks.StatusOk {
			return fmt.Errorf("failed to run init task: %v, got status: %d", initTask, statusCode)
		}
	}

	return nil
}

func (tr *TestRunner) performTestCases() error {
	for key, testCase := range tr.testCases {
		log.Printf("running case: %s", key)
		result := testCase.Start()

		tr.testResult.Total ++
		switch result {
		case CASE_STATUS_PASSED:
			tr.testResult.Passed ++
		case CASE_STATUS_FAILED:
			tr.testResult.Failed ++
		case CASE_STATUS_SKIPPED:
			tr.testResult.Skipped ++
		}

		tr.testResult.Cases = append(tr.testResult.Cases, CaseResult {
			Name: key,
			Status: result,
		})
	}

	return nil
}

/* Util */
func createTask(definition config.TaskDefinition) (tasks.Task, error) {
	task := getTask(definition.Name)
	if task != nil {
		statusCode := task.Configure(definition.Arg)
		if statusCode != tasks.StatusOk {
			return nil, fmt.Errorf("failed to configure task: %s", definition.Name)
		}
	}

	return task, nil
}

func getTask(name string) tasks.Task {
	if f, ok := tasks.TaskMap[name]; ok {
		return f()
	}

	return nil
}