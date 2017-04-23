package types

const (
	STATUS_CREATED 		= "Created"
	STATUS_RUNNING 		= "Running"
	STATUS_FAILED 		= "Failed"
	STATUS_COMPLETED	= "Completed"
)

type Job struct {
	Uuid 		string 	`json:"uuid"`
	Status 		string 	`json:"status"`
	TestInfo 	Test 	`json:"test"`
	Submission 	struct {
		SubmissionFile 	File 	`json:"file"`
	} `json:"submission"`
	Log		string	`json:"log"`
}
