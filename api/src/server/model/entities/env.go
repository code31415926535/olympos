package entities

type Env struct {
	Name		string `json:"name" bson:"name"`
	Image		string `json:"image" bson:"image"`
	Description 	string `json:"description" bson:"description"`
	TestMount	string `json:"test_mount" bson:"test_mount"`
	OutMount	string `json:"out_mount" bson:"out_mount"`
}