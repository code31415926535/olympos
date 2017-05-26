var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

var secret = require(global.root + '/config/secret')();

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var User = require(global.root + '/model/userDAO');

var validateCredential = require(global.root + '/route/middleware/dataValidator').validateCredential;

router.use(bodyParser.json());

/**
 * @swagger
 * /auth:
 *   post:
 *     tags:
 *       - Auth
 *     description: Authenticate to the server.
 *     parameters:
 *       - name: auth
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Credential'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Authentication token. This token needs to be set as 'x-access-token' for further requests.
 *         schema:
 *           $ref: '#/definitions/Token'
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Username or password is invalid.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/', validateCredential, function(req, res, next) {
    winston.debug("Authenticating ...");
    payload = req.body;

    filter = {username: payload["username"]};
    User.findOne(filter, function(err, user) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (user == null) {
            winston.error("Not found!");
            next(new APICustomError(Status.Unauthorized));
            return;
        }

        if (user.validPassword(payload["password"]) == false) {
            winston.error("Bad credentials!");
            next(new APICustomError(Status.Unauthorized));
            return;
        }

        // https://www.npmjs.com/package/jsonwebtoken
        var token = {
            value: jwt.sign({data: user.toDTO()}, secret, { expiresIn: 1800 })
        };

        res.status(Status.OK).send(token);
    });
});

module.exports = router;
