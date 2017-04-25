package cfg

type protocol string

const (
	ProtocolHttp	protocol = "http"
	ProtocolHttps	protocol = "https"
)

func CreateDefault() {
	athenaHostname = "localhost"
	athenaPort = 21017
	athenaDbName = "go_test"

	aresProtocol = ProtocolHttp
	aresPort = 8080

	swaggerPort = 10080
}

func AthenaHostname() string {
	return athenaHostname
}

func AthenaPort() int {
	return athenaPort
}

func AthenaDbName() string {
	return athenaDbName
}

func AresProtocol() protocol {
	return aresProtocol
}

func AresPort() int {
	return aresPort
}

func SwaggerPort() int {
	return swaggerPort
}


var athenaHostname 	string
var athenaPort		int
var athenaDbName	string

var aresProtocol	protocol
var aresPort		int

var swaggerPort		int