package system

import "types"

func CreateExecution(job *types.Job) {
	var exec *execution
	exec = &execution{job: job}

	go exec.main()
}