package tasks

type NewTask func() Task

func newBash() Task {
	return &Bash{}
}

func newBashIO() Task {
	return &BashIO{}
}

func newGcc() Task {
	return &Gcc{}
}

func newGPlusPlus() Task {
	return &GPlusPlus{}
}

func newAssertFile() Task {
	return &AssertFile{}
}

func newPython() Task {
	return &Python{}
}

var TaskMap map[string]NewTask = map[string]NewTask {
	newBash().GetName(): 		newBash,
	newBashIO().GetName():		newBashIO,
	newGcc().GetName():		newGcc,
	newAssertFile().GetName(): 	newAssertFile,
	newPython().GetName():		newPython,
	newGPlusPlus().GetName():	newGPlusPlus,
}