var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var permissions = require(global.root + '/model/permissions');

/**
 * @swagger
 * definition:
 *   Token:
 *     properties:
 *       value:
 *         type: string
 */

/* Outbound type, no validation required */

/**
 * @swagger
 * definition:
 *   UserPublic:
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       permission:
 *         type: string
 */

 /* Outbound type, no validation required */

/**
 * @swagger
 * definition:
 *   Credential:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 */
var validateCredential = function(req, res, next) {
    var payload = req.body;

    if (payload["username"] == undefined ||
        payload["password"] == undefined ||
        (typeof payload["username"] != "string") ||
        (typeof payload["password"]) != "string") {
            next(new APICustomError(Status.BadRequest));
            return;
        }

    next();
};

/**
 * @swagger
 * definition:
 *   UserPrivate:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       email:
 *         type: string
 */
var validateUserPrivate = function(req, res, next) {
    var payload = req.body;

    if (payload["username"] == undefined ||
        payload["password"] == undefined ||
        payload["email"] == undefined ||
        (typeof payload["username"]) != "string" ||
        (typeof payload["username"]) != "string" ||
        (typeof payload["username"]) != "string") {
            next(new APICustomError(Status.BadRequest));
            return;
        }

    next();
}

/**
 * @swagger
 * definitions:
 *   Permission:
 *     properties:
 *       permission:
 *         type: string
 */
var validatePermission = function(req, res, next) {
    var payload = req.body;

    console.log(payload);
    if (payload["permission"] == undefined ||
        (typeof payload["permission"]) != "string") {
            next(new APICustomError(Status.BadRequest));
            return;
        }

    if (payload["permission"] == permissions.REGULAR ||
        payload["permission"] == permissions.STUDENT ||
        payload["permission"] == permissions.TEACHER ||
        payload["permission"] == permissions.ADMIN) {
            next();
            return;
        }

    next(new APICustomError(Status.BadRequest));
}

module.exports = {
    validateCredential: validateCredential,
    validateUserPrivate: validateUserPrivate,
    validatePermission: validatePermission
}
