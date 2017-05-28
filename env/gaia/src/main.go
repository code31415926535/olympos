package main

import (
	"log"
	"config"
	"run"
	"encoding/json"
	"io/ioutil"
	"path"
	"os"
)

const RESULT_FILE_NAME = "result.json"

func main() {
	log.SetOutput(os.Stdout)
	log.Println("Loading configuration ...")
	config.LoadConfig()
	log.Printf("Run uuid is: %s", config.Uuid())
	log.Printf("Run output root is: %s", config.OutRoot())
	log.Printf("Run test root is: %s", config.TestRoot())

	log.Println("Loading test configuration ...")
	err := config.LoadTestConfig()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Test configuration loaded!")
	log.Println(config.TestConfig())

	log.Println("Running test case ...")
	testRunner := &run.TestRunner{}
	statusCode, err := testRunner.Start()
	log.Println("Run finished with status code", statusCode)

	result := testRunner.GetResult()
	if err != nil {
		result.Result = run.FinalResult {
			StatusCode: int(statusCode),
			Message: err.Error(),
		}
	} else {
		result.Result = run.FinalResult {
			StatusCode: int(statusCode),
			Message: "",
		}
	}

	log.Println("Creating results file ...")
	resultJson, err := json.Marshal(result)
	if err != nil {
		log.Fatal("Failed to create result json ...")
	}

	outFileName := path.Join(config.OutRoot(), RESULT_FILE_NAME)
	ioutil.WriteFile(outFileName, resultJson, 0644)

	log.Println("Results written ... exiting ...")
}