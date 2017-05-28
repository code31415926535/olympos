package execution_engine

import (
	docker "github.com/fsouza/go-dockerclient"
	"logger"
	"fmt"
	"bytes"
)

var client *docker.Client = nil

type DockerExecutionEngine struct {}

func (DockerExecutionEngine) Setup() (error) {
	if client == nil {
		cl, err := docker.NewClientFromEnv()
		if err != nil {
			return err
		}

		client = cl
		return nil
	}

	return nil
}

func (DockerExecutionEngine) CheckIfImageExists(image string) (bool, error) {
	images, err := client.ListImages(docker.ListImagesOptions{All: false})
	if err != nil {
		return false, err
	}

	for _, img := range images {
		for _, tag := range img.RepoTags {
			if tag == image {
				return true, nil
			}
		}
	}

	return false, nil
}

func (DockerExecutionEngine) CreateContainer(name string, image string, context ExecutionContext) (string, error) {

	environments := make([]string, 0)
	for key, val := range context.SysEnv {
		environments = append(environments, fmt.Sprintf("%s:%s", key, val))
	}

	volumes := make([]string, 0)
	volumes = append(volumes, fmt.Sprintf("%s:%s",
		context.CoreMount.HostPath,
		context.CoreMount.DestinationPath))
	volumes = append(volumes, fmt.Sprintf("%s:%s",
		context.OutputMount.HostPath,
		context.OutputMount.DestinationPath))

	var config = &docker.Config {
		Image:           image,
		Env:             environments,
		NetworkDisabled: true,
	}

	var hostConfig = &docker.HostConfig {
		Binds: volumes,
	}

	var createContainerOptions = docker.CreateContainerOptions{
		Name: name,
		Config: config,
		HostConfig: hostConfig,
	}

	container, err := client.CreateContainer(createContainerOptions)
	if err != nil {
		logger.Log.Error(err.Error())
		return "", err
	}

	containerId := container.ID

	err = client.StartContainer(containerId, hostConfig)
	if err != nil {
		logger.Log.Error(err.Error())
		return "", err
	}

	return containerId, nil
}

func (DockerExecutionEngine) ContainerFinished(containerId string) (bool, error) {
	container, err := client.InspectContainer(containerId)
	if err != nil {
		logger.Log.Error(err.Error())
		return false, err
	}

	return !container.State.Running, nil
}

func (DockerExecutionEngine) GetContainerLogs(containerId string) (string, error) {

	var logsBytes = new(bytes.Buffer)
	var logOptions = docker.LogsOptions{
		Container: containerId,
		OutputStream: logsBytes,

		Stdout: true,
		Stderr: true,

		RawTerminal: true,
	}

	err := client.Logs(logOptions)
	if err != nil {
		logger.Log.Error(err.Error())
		return "", err
	}

	return logsBytes.String(), nil
}

func (DockerExecutionEngine) RemoveContainer(containerId string) (error) {

	var removeContainerOptions = docker.RemoveContainerOptions{
		ID: containerId,
		RemoveVolumes: true,
	}

	err := client.RemoveContainer(removeContainerOptions)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	return nil
}
