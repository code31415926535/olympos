package types

type TestResult struct {
	Total	int	`json:"total"`
	Passed	int	`json:"passed"`
	Failed	int	`json:"failed"`
	Skipped int	`json:"skipped"`

	Cases	[]struct {
		Name	string 	`json:"name"`
		Status	string	`json:"status"`
	} `json:"cases"`

	Result 	struct {
		StatusCode	int	`json:"status_code"`
		Message		string	`json:"message"`
	} `json:"result"`
}