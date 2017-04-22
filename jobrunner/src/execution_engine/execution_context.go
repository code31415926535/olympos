package execution_engine

type Volume struct {
	HostPath	string
	DestinationPath string
}

type ExecutionContext struct {
	SysEnv		map[string]string
	CoreMount	Volume
	OutputMount	Volume
}
