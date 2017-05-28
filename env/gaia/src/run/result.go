package run

type FinalResult struct {
	StatusCode int        `json:"status_code"`
	Message    string     `json:"message"`
}

type caseStatus string

const (
	CASE_STATUS_PASSED caseStatus = "passed"
	CASE_STATUS_FAILED caseStatus = "failed"
	CASE_STATUS_SKIPPED caseStatus = "skipped"
)

type CaseResult struct {
	Name	string		`json:"name"`
	Status	caseStatus 	`json:"status"`
}

type TestResult struct {
	Total   int        `json:"total"`
	Passed  int        `json:"passed"`
	Failed  int        `json:"failed"`
	Skipped int        `json:"skipped"`

	Cases []CaseResult `json:"cases"`

	Result FinalResult `json:"result"`
}
