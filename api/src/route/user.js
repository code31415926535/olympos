var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var User = require(global.root + '/model/userDAO');

var permissions = require(global.root + '/model/permissions');
var auth = require(global.root + '/route/middleware/auth');

var dataValidator = require(global.root + '/route/middleware/dataValidator');
var validateUserPrivate = dataValidator.validateUserPrivate;
var validatePermission = dataValidator.validatePermission;

const GET_USER_PERM = 9;
const MODIFY_USER_PERM = 30;

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     description: Returns a list of all users.
 *     parameters:
 *       - name: "x-access-token"
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all users.
 *         type: array
 *         items:
 *           $ref: '#/definitions/UserPublic'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/', auth(GET_USER_PERM), function(req, res, next) {
    winston.info("Getting all 'user'-s ...");
    User.find({}, function(err, users) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        for (var i = 0; i != users.length; i++) {
            users[i] = users[i].toDTO();
        }

        res.status(Status.OK).json(users);
    });
});

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     description: Register a new user with regular permissions.
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserPrivate'
 *     responses:
 *       201:
 *         description: Created.
 *       400:
 *         description: Bad Request.
 *       409:
 *         description: Conflict. User already exists.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/', validateUserPrivate, function(req, res, next) {
    winston.info("Creating 'user' ...");
    payload = req.body;

    filter = {username: payload["username"]};
    User.findOne(filter, function(err, user) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (user != null) {
            winston.error("A user with that name already exists!");
            next(new APICustomError(Status.Conflict));
            return;
        }

        var u = new User();
        u["username"] = payload["username"];
        u["email"] = payload["email"];
        u["password"] = u.generateHash(payload["password"]);
        u["permission"] = permissions.REGULAR;

        u.save(function(err) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.InternalServerError));
                return;
            }

            res.status(Status.Created).send();
        });
    });
});

/**
 * @swagger
 * /user/{name}:
 *   get:
 *     tags:
 *       - User
 *     description: Get user by name.
 *     parameters:
 *       - name: "x-access-token"
 *         in: header
 *         required: true
 *         type: string
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: User.
 *         schema:
 *           $ref: '#/definitions/UserPublic'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:userName', auth(GET_USER_PERM), function(req, res, next) {
    winston.info("Getting 'user' by name...");
    var userName = req.params["userName"];

    User.findOne({username: userName}, function(err, user) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (user == null) {
            winston.error("Not found!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        res.status(Status.OK).json(user.toDTO());
    });
});

/**
 * @swagger
 * /user/{name}/permission:
 *   put:
 *     tags:
 *       - User
 *     description: Modify a user.
 *     parameters:
 *       - name: "x-access-token"
 *         in: header
 *         required: true
 *         type: string
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User permissions updated.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.put('/:userName/permission', validatePermission, auth(MODIFY_USER_PERM), function(req, res, next) {
    winston.info("Modifying 'user' permission...");
    var userName = req.params["userName"];
    var payload = req.body;

    User.findOne({username: userName}, function(err, user) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (user == null) {
            winston.error("Not found!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        var newPermission = payload["permission"];
        user["permission"] = newPermission;
        user.save(function (err) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.InternalServerError));
                return;
            }

            res.status(Status.OK).send();
        });
    });
});

/**
 * @swagger
 * /user/{name}:
 *   delete:
 *     tags:
 *       - User
 *     description: Delete a user.
 *     parameters:
 *       - name: "x-access-token"
 *         in: header
 *         required: true
 *         type: string
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/:userName', auth(MODIFY_USER_PERM), function(req, res, next) {
    winston.info("Deleteting 'user' by name...");
    var userName = req.params["userName"];

    User.findOne({username: userName}, function(err, user) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (user == null) {
            winston.error("Does not exist!");
            next(new APICustomError(Status.NotFound));
            return;
        };

        User.remove({name: userName}, function(err) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.InternalServerError));
                return;
            };

            res.status(Status.OK).send();
        });
    });
});

 module.exports = router;
