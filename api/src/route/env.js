var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var Env = require(global.root + '/model/envDAO');

// TODO: Permission handling.

router.use(bodyParser.json());

// Index
router.get('/', function(req, res, next) {
    winston.info("Getting all 'env'-s...");
    Env.find({}, function(err, envs) {
        if (err) {
            next(new APICustomError(Status.InternalServerError));
        }

        for (var i = 0; i != envs.length; i++) {
            envs[i] = envs[i].toDTO();
        }

        res.status(Status.OK).json(envs);
    });
});

// TODO: Validate
router.post('/', function(req, res, next) {
    winston.info("Creating 'env'...");
    payload = req.body;

    filter = {name: payload["name"]};
    Env.findOne(filter, function(err, env) {
        if (err) {
            next(new ApiCustomError(Status.InternalServerError));
        }

        if (env != null) {
            next(new APICustomError(Status.Conflict));
        }

        new Env(payload).save(function(err) {
            if (err) {
                next(err);
            }

            res.status(Status.Created).send();
        });
    });
});

router.put('/', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.delete('/', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

// Get and Delete by name
router.get('/:envName', function(req, res, next) {
    winston.info("Getting 'env' by name...");
    var envName = req.params["envName"];

    Env.findOne({name: envName}, function(err, env) {
        if (err) {
            next(new APICustomError(Status.InternalServerError));
        }

        res.status(Status.OK).json(env.toDTO());
    });
});

router.post('/:envName', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.put('/envName', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.delete('/:envName', function(req, res, next) {
    winston.info("Deleteting 'env' by name...");
    var envName = req.params["envName"];

    Env.remove({name: envName}, function(err) {
        if (err) {
            next(Status.InternalServerError);
        }

        res.status(Status.OK).send();
    })
});

module.exports = router;
