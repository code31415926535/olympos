package types

type Test struct {
	Environment	Env	`json:"env"`
	Files		[]File	`json:"files"`
	Config		[]struct{
		Key	string	`json:"key"`
		Value	string	`json:"value"`
	} `json:"config"`
}

func (t Test) GetConfig(key string) string {
	for _, config := range t.Config {
		if config.Key == key {
			return config.Value
		}
	}

	return ""
}