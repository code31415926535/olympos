package types

type Test struct {
	Name		string	`json:"name"`
	Description	string	`json:"description"`
	Environment	Env	`json:"env"`
	Files		[]File	`json:"files"`
}