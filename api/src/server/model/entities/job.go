package entities

type Job struct {
	Uuid 		string 	`json:"uuid"`
	Status 		string 	`json:"status"`
	Test	 	Test 	`json:"test"`
	Submission 	struct {
		SubmissionFile 	File 	`json:"file"`
	} `json:"submission"`
	Log		string	`json:"log"`
}
