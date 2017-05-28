package tasks

type statusCode int

const (
	StatusOk 			statusCode = 0

	StatusAssertOk			statusCode = 0
	StatusAssertFail		statusCode = 1

	StatusConfigurationError 	statusCode = 10
	StatusExecutionError		statusCode = 11
)

type Task interface {
	Configure(args map[string]string) statusCode
	Execute() statusCode
	GetName() string
}
