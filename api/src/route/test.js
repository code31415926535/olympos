var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var Env = require(global.root + '/model/envDAO');
var Test = require(global.root + '/model/testDAO');

// TODO: Permission handling.

router.use(bodyParser.json());

// Index
router.get('/', function(req, res, next) {
    winston.info("Getting all 'test'-s...");
    Test.find({}).populate("env").exec(function(err, tests) {
        if (err) {
            next(new APICustomError(Status.InternalServerError));
        }

        for  (var i = 0; i != tests.length; i++) {
            tests[i] = tests[i].toDTO();
        }

        res.status(Status.OK).json(tests);
    });
});

router.post('/', function(req, res, next) {
    winston.info("Creating 'test'...");
    payload = req.body;

    filter = {name: payload["name"]};
    Test.findOne(filter, function(err, test) {
        if (err) {
            next(new APICustomError(Status.InternalServerError));
        }

        if (test != null) {
            next(new APICustomError(Status.Conflict));
        }

        var test = payload;
        Env.fromDTO(payload["env"], function(err, env) {
            if (err) {
                next(new APICustomError(Status.InternalServerError));
            };

            test["env"] = env;

            new Test(test).save(function(err) {
                if (err) {
                    next(err);
                }

                res.status(Status.Created).send();
            });
        });
    })
});

router.put('/', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.delete('/', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.get('/:testName', function(req, res, next) {
    winston.info("Getting 'text' by name...");
    var testName = req.params["testName"];

    Test.findOne({name: testName}).populate("env").exec(function(err, test){
        if (err) {
            next(new APICustomError(Status.InternalServerError));
        };

        res.status(Status.OK).json(test.toDTO());
    });
});

router.put('/:testName', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.post('/:testName', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.delete('/:testName', function(req, res, next) {
    winston.info("Deleteting 'test' by name...");
    var testName = req.params["testName"];

    Test.remove({name: testName}, function(err) {
        if (err) {
            next(Status.InternalServerError);
        }

        res.status(Status.OK).send();
    })
});

module.exports = router;
