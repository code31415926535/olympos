package tasks

type NewTask func() Task

func newBash() Task {
	return &Bash{}
}

func newAssertFile() Task {
	return &AssertFile{}
}

var TaskMap map[string]NewTask = map[string]NewTask {
	newBash().GetName(): 		newBash,
	newAssertFile().GetName(): 	newAssertFile,
}