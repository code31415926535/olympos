package execution_engine

/*
	execution engine interface.

	contains the functions needed to execute a job trough a given engine.
 */
type ExecutionEngine interface {
	Setup() (error)
	CheckIfImageExists(image string) (bool, error)
	CreateContainer(name string, image string, context ExecutionContext) (string, error)
}