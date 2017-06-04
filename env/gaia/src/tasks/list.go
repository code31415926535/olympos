package tasks

type NewTask func() Task

/* Bash */
func newBash() Task {
	return &Bash{}
}

func newBashIO() Task {
	return &BashIO{}
}

/* Compile */
func newGcc() Task {
	return &Gcc{}
}

func newGPlusPlus() Task {
	return &GPlusPlus{}
}

/* Assert */
func newAssertFile() Task {
	return &AssertFile{}
}

func newCompareFmt() Task {
	return &CompareFmt{}
}

/* Python */
func newPython() Task {
	return &Python{}
}

func newPythonIO() Task {
	return &PythonIO{}
}

var TaskMap map[string]NewTask = map[string]NewTask {
	newBash().GetName(): 		newBash,
	newBashIO().GetName():		newBashIO,
	newGcc().GetName():		newGcc,
	newAssertFile().GetName(): 	newAssertFile,
	newPython().GetName():		newPython,
	newGPlusPlus().GetName():	newGPlusPlus,
	newPythonIO().GetName():	newPythonIO,
	newCompareFmt().GetName():	newCompareFmt,
}