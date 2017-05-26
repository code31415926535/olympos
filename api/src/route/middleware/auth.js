var jwt = require('jsonwebtoken');
var winston = require('winston');

var secret = require(global.root + '/config/secret')();
var permissions = require(global.root + '/model/permissions');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var getPermissionLevel = function(permission) {
    switch (permission) {
        case permissions.REGULAR:
            return 0
        case permissions.STUDENT:
            return 10
        case permissions.TEACHER:
            return 20
        case permissions.ADMIN:
            return 99
        default:
            return -1
    }
}

module.exports = function(permissionLevel) {
    return function(req, res, next) {
        var token = req.headers["x-access-token"];

        if (token) {
            winston.debug("Token exists!");
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    winston.debug("Token is not valid ...");
                    next(new APICustomError(Status.Unauthorized));
                    return;
                }

                if (getPermissionLevel(decoded.data.permission) < permissionLevel) {
                    winston.debug("Enpoint requires higher permission level ...");
                    next(new APICustomError(Status.Unauthorized));
                    return;
                }

                next();
                return;
            });
        } else {
            next(new APICustomError(Status.Unauthorized));
            return;
        }
    }
}
