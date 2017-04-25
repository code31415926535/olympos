package status

import "fmt"

type ResponseStatus int

const (
	Ok      ResponseStatus = 200
	Created ResponseStatus = 201

	BadRequest ResponseStatus = 400
	NotFound   ResponseStatus = 404
	Conflict   ResponseStatus = 409

	InternalServerError ResponseStatus = 500
)

func (rs ResponseStatus) Code() int {
	return int(rs)
}

func (rs ResponseStatus) Message() string {
	switch rs {
	case Ok:
		return "OK"
	case Created:
		return "Created"
	case BadRequest:
		return "Bad Request"
	case NotFound:
		return "Not Found"
	case Conflict:
		return "Conflict"
	case InternalServerError:
		return "Internal Server Error"
	default:
		return "Internal Server Error"
	}
}

func (rs ResponseStatus) Error() string {
	return fmt.Sprintf(rs.Message())
}