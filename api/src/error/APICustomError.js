'use strict';

module.exports = function APICustomError(code) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    switch (code) {
        case 404:
            this.message = "Not Found!";
            break;
        case 409:
            this.message = "Conflict! Operation not applicable in current state!";
            break;
        case 500:
            this.message = "Internal Server Error!";
            break;
        case 501:
            this.message = "Not Implemented!";
            break;
        default:
            this.message = "Internal Server Error!";
    }

    this.code = code;
};

require('util').inherits(module.exports, Error);
