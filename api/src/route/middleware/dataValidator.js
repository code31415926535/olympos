var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var permissions = require(global.root + '/model/permissions');

/* Utility functions */
var validateStringAndNotNull = function(value) {
    if (value == undefined ||
        value == null ||
        (typeof value) != "string") {
            return false;
        }

    return true;
}

var validateObjectAndNotNull = function(value) {
    if (value == undefined ||
        value == null ||
        (typeof value) != "object") {
            return false;
        }

    return true;
}

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

    if (validateStringAndNotNull(payload["username"]) &&
        validateStringAndNotNull(payload["password"])) {
            next();
            return;
        }

    next(new APICustomError(Status.BadRequest));
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

    if (validateStringAndNotNull(payload["username"]) &&
        validateStringAndNotNull(payload["password"]) &&
        validateStringAndNotNull(payload["email"])) {
            next();
            return;
        }

    next(new APICustomError(Status.BadRequest));
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
    if (validateStringAndNotNull(payload["permission"])) {
        if (payload["permission"] == permissions.REGULAR ||
            payload["permission"] == permissions.STUDENT ||
            payload["permission"] == permissions.TEACHER ||
            payload["permission"] == permissions.ADMIN) {
                next();
                return;
            }
        }

    next(new APICustomError(Status.BadRequest));
}

/**
 * @swagger
 * definition:
 *   Env:
 *     properties:
 *       name:
 *         type: string
 *       image:
 *         type: string
 *       out_mount:
 *         type: string
 *       test_mount:
 *         type: string
 *       description:
 *         type: string
 */
var validateEnv = function(req, res, next) {
    var payload = req.body;

    if (validateStringAndNotNull(payload["name"]) &&
        validateStringAndNotNull(payload["image"]) &&
        validateStringAndNotNull(payload["out_mount"]) &&
        validateStringAndNotNull(payload["test_mount"]) &&
        validateStringAndNotNull(payload["description"])) {
            next();
            return;
        }

    next(new APICustomError(Status.BadRequest));
}

/**
 * @swagger
 * definition:
 *   Test:
 *     properties:
 *       name:
 *         type: string
 *       env:
 *         $ref: '#/definitions/Env'
 *       description:
 *         type: string
 */
var validateTest = function(req, res, next) {
    var payload = req.body;

    if (validateStringAndNotNull(payload["name"]) &&
        validateStringAndNotNull(payload["description"]) &&
        validateObjectAndNotNull(payload["env"])) {
            next();
            return;
        };

    next(new APICustomError(Status.BadRequest));
};

/**
 * @swagger
 * definition:
 *   File:
 *     properties:
 *       name:
 *         type: string
 *       content:
 *         type: string
 */
var validateFile = function(req, res, next) {
    var payload = req.body;

    if (validateStringAndNotNull(payload["name"]) &&
        validateStringAndNotNull(payload["content"])) {
            next();
            return;
        };

    next(new APICustomError(Status.BadRequest));
}

/**
 * @swagger
 * definition:
 *   Task:
 *     properties:
 *       name:
 *         type: string
 *       test:
 *         $ref: '#/definitions/Test'
 *       description:
 *         type: string
 */
var validateTask = function(req, res, next) {
    var payload = req.body;

    next();
}

/**
 * @swagger
 * definition:
 *   Submission:
 *     properties:
 *       id:
 *         type: number
 *       file:
 *         $ref: '#/definitions/File'
 *       by:
 *         $ref: '#/definitions/UserPublic'
 */

/* Outbound type, no validation required */

/**
 * @swagger
 * definition:
 *   Job:
 *     properties:
 *       uuid:
 *         type: string
 *       status:
 *         type: string
 *       test:
 *         $ref: '#/definitions/Test'
 *       submission:
 *         $ref: '#/definitions/Submission'
 *       log:
 *         type: string
 */

/* Outbound type, no validation required */

/**
 * @swagger
 * definition:
 *   Result:
 *     properties:
 *       total:
 *         type: number
 *       passed:
 *         type: number
 *       failed:
 *         type: number
 *       skipped:
 *         type: number
 *       cases:
 *         type: array
 *         items:
 *           name:
 *             type: String
 *           status:
 *             type: String
 *       result:
 *         status_code:
 *           type: number
 *         message:
 *           type: String
 */

/* Outbound type, no validation required */

module.exports = {
    validateCredential: validateCredential,
    validateUserPrivate: validateUserPrivate,
    validatePermission: validatePermission,
    validateEnv: validateEnv,
    validateTest: validateTest,
    validateFile: validateFile,
    validateTask: validateTask
}
