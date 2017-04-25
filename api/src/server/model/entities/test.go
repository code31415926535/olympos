package entities

type Test struct {
	Name		string	`json:"name"`
	Description	string	`json:"description"`
	Env		Env	`json:"env"`
	Files		[]File	`json:"files"`
}