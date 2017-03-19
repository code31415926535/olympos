'use strict';

var Status = require(global.root + '/config/status');

module.exports = function APICustomError(code, description) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    switch (code) {
        case Status.BadRequest:
            this.message = "Bad Request!";
            break;
        case Status.NotFound:
            this.message = "Not Found!";
            break;
        case Status.MethodNotAllowed:
            this.message = "Method Not Allowed";
            break;
        case Status.Conflict:
            this.message = "Conflict! Operation not applicable in current state!";
            break;
        case Status.InternalServerError:
            this.message = "Internal Server Error!";
            break;
        case Status.NotImplemented:
            this.message = "Not Implemented!";
            break;
        default:
            this.message = "Internal Server Error!";
    }

    this.code = code;
    this.description = description;
};

require('util').inherits(module.exports, Error);
