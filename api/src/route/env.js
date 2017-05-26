var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var Env = require(global.root + '/model/envDAO');

var auth = require(global.root + '/route/middleware/auth');
var validateEnv = require(global.root + '/route/middleware/dataValidator').validateEnv;

const GET_ENV_PERM = 15;
const MODIFY_ENV_PERM = 25;

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

/**
 * @swagger
 * /env:
 *   get:
 *     tags:
 *       - Env
 *     description: Returns a list of all envs.
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all envs.
 *         type: array
 *         items:
 *           $ref: '#/definitions/Env'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/', auth(GET_ENV_PERM), function(req, res, next) {
    winston.info("Getting all 'env'-s...");
    Env.find({}, function(err, envs) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        for (var i = 0; i != envs.length; i++) {
            envs[i] = envs[i].toDTO();
        }

        res.status(Status.OK).json(envs);
    });
});

/**
 * @swagger
 * /env:
 *   post:
 *     tags:
 *       - Env
 *     description: Create a new env.
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: env
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Env'
 *     responses:
 *       201:
 *         description: Created.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Conflict. Object already exists.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/', validateEnv, auth(MODIFY_ENV_PERM), function(req, res, next) {
    winston.info("Creating 'env'...");
    payload = req.body;
    winston.debug(payload);

    filter = {name: payload["name"]};
    Env.findOne(filter, function(err, env) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (env != null) {
            winston.error("Env already exists!")
            next(new APICustomError(Status.Conflict));
            return;
        }

        new Env(payload).save(function(err) {
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
 * /env/{name}:
 *   get:
 *     tags:
 *       - Env
 *     description: Get env by name.
 *     parameters:
 *       - name: x-access-token
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
 *         description: Environment.
 *         schema:
 *           $ref: '#/definitions/Env'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:envName', auth(GET_ENV_PERM), function(req, res, next) {
    winston.info("Getting 'env' by name...");
    var envName = req.params["envName"];

    Env.findOne({name: envName}, function(err, env) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (env == null) {
            winston.error("Not found!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        res.status(Status.OK).json(env.toDTO());
    });
});

/**
 * @swagger
 * /env/{name}:
 *   delete:
 *     tags:
 *       - Env
 *     description: Delete env by name.
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Environment deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/:envName', auth(MODIFY_ENV_PERM), function(req, res, next) {
    winston.info("Deleteting 'env' by name...");
    var envName = req.params["envName"];

    Env.findOne({name: envName}, function(err, env) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (env == null) {
            winston.error("Does not exist!");
            next(new APICustomError(Status.NotFound));
            return;
        };

        Env.remove({name: envName}, function(err) {
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
