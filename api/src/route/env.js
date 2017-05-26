var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var Env = require(global.root + '/model/envDAO');

// TODO: Permission handling.

router.use(bodyParser.json());

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

/**
 * @swagger
 * /env:
 *   get:
 *     tags:
 *       - Env
 *     description: Returns a list of all envs.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all envs.
 *         type: array
 *         items:
 *           $ref: '#/definitions/Env'
 *       500:
 *         description: Internal Server Error.
 */
router.get('/', function(req, res, next) {
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
 *       - name: env
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Env'
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Conflict. Object already exists.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/', function(req, res, next) {
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
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:envName', function(req, res, next) {
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
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Environment deleted.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/:envName', function(req, res, next) {
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
