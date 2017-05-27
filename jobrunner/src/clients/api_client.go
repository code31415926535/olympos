package clients

import (
	"types"
	"sync"
	"net/http"
	"cfg"
	"bytes"
	"encoding/json"
	"logger"
	"fmt"
	"io/ioutil"
	"time"
)

type APIClient interface {
	SendResult(uuid string, result *types.TestResult) error
}

var apiClientInstance *apiClient
var once sync.Once = sync.Once{}

func GetAPIClient() APIClient {
	once.Do(func () {
		apiClientInstance = &apiClient{
			authLock: sync.Mutex{},
		}
	})

	return apiClientInstance
}

type apiClient struct {
	Token		string
	authLock	sync.Mutex
	lastAuthAt	time.Time
}

type credentialsStructure struct {
	Username	string `json:"username"`
	Password	string `json:"password"`
}

type tokenStructure struct {
	Token		string `json:"value"`
}


func (c *apiClient) SendResult(uuid string, result *types.TestResult) error {
	status, err := c.performSendResult(uuid, result)
	if err != nil {
		return err
	}

	if status == http.StatusUnauthorized {
		err = c.authenticate()
		if err != nil {
			return err
		}

		status, err = c.performSendResult(uuid, result)
		if err != nil {
			return err
		}
	}

	if status != http.StatusCreated {
		return fmt.Errorf("non-ok status code: %d", status)
	}

	return nil
}

func (c *apiClient) performSendResult(uuid string, result *types.TestResult) (int, error) {
	if result == nil {
		logger.Log.Warning("sending empty result ...")
		result = &types.TestResult{}
	}

	jsonData, err := json.Marshal(result)
	if err != nil {
		logger.Log.Error(err.Error())
		return 0, err
	}

	req, err := http.NewRequest(http.MethodPost, cfg.AresReturnUrl(uuid), bytes.NewBuffer(jsonData))
	if err != nil {
		logger.Log.Error(err.Error())
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")
	c.authLock.Lock()
	req.Header.Set("x-access-token", c.Token)
	c.authLock.Unlock()

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		logger.Log.Error(err.Error())
		return 0, err
	}
	defer res.Body.Close()

	return res.StatusCode, nil
}

func (c *apiClient) canAuth() bool {
	return time.Now().Sub(c.lastAuthAt) > time.Minute
}

func (c *apiClient) authenticate() error {
	c.authLock.Lock()
	defer c.authLock.Unlock()
	if c.canAuth() == false {
		logger.Log.Debug("already authenticated ...")
		return nil
	}

	logger.Log.Debug("authenticating ...")
	credentials := &credentialsStructure {
		Username: cfg.JobrunnerUsername(),
		Password: cfg.JobrunnerPassword(),
	}

	jsonData, err := json.Marshal(credentials)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	req, err := http.NewRequest(http.MethodPost, cfg.AresAuthUrl(), bytes.NewBuffer(jsonData))
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("non-ok status code: %d", res.StatusCode)
	}

	responseBytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	var token *tokenStructure = &tokenStructure{}
	err = json.Unmarshal(responseBytes, token)
	if err != nil {
		logger.Log.Error(err.Error())
		return err
	}

	logger.Log.Debug("authentication successful!")
	c.lastAuthAt = time.Now()
	c.Token = token.Token
	return nil
}