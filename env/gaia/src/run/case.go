package run

import (
	"tasks"
	"log"
)

type TestCaseRunner struct {
	beforeExecution	tasks.Task
	execute		tasks.Task
	evaluate	tasks.Task
	afterExecution	tasks.Task
}

func (tc TestCaseRunner) Start() caseStatus {
	if tc.beforeExecution != nil {
		log.Printf("- running before task: %v\n", tc.beforeExecution)

		statusCode := tc.beforeExecution.Execute()
		if statusCode != tasks.StatusOk {
			log.Println("- failed before task ...")
			return CASE_STATUS_SKIPPED
		}
	}

	log.Printf("- running execute task: %v\n", tc.execute)
	statusCode := tc.execute.Execute()
	if statusCode != tasks.StatusOk {
		log.Println("- failed execute task ...")
		return CASE_STATUS_FAILED
	}

	log.Printf("- running evaluate task: %v\n", tc.evaluate)
	statusCode = tc.evaluate.Execute()
	if statusCode != tasks.StatusAssertOk {
		log.Println("- assertion failed ...")
		return CASE_STATUS_FAILED
	}

	if tc.afterExecution != nil {
		log.Printf("- running after task: %v\n", tc.afterExecution)

		statusCode := tc.afterExecution.Execute()
		if statusCode != tasks.StatusOk {
			log.Println("- failed after task ...")
			return CASE_STATUS_SKIPPED
		}
	}

	return CASE_STATUS_PASSED
}