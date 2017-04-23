package execution_engine

/*
	execution engine interface.

	contains the functions needed to execute a job trough a given engine.
 */
type ExecutionEngine interface {
	Setup() (error)
	CheckIfImageExists(image string) (bool, error)
	CreateContainer(name string, image string, context ExecutionContext) (string, error)
	ContainerFinished(containerId string) (bool, error)
	GetContainerLogs(containerId string) (string, error)
	RemoveContainer(containerId string) (error)
}