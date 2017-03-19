var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var Env = require(global.root + '/model/envDAO');
var File = require(global.root + '/model/fileDAO');
var Test = require(global.root + '/model/testDAO');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
    winston.info("Getting all 'test'-s...");
    Test.find({}, function(err, tests) {
        winston.info("GETTING");
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
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
    winston.debug(payload);

    filter = {name: payload["name"]};
    Test.findOne(filter, function(err, test) {
        if (err) {
            winston.error(err);
            next(new ApiCustomError(Status.InternalServerError));
            return;
        }

        if (test != null) {
            winston.error("Test already exists!")
            next(new APICustomError(Status.Conflict));
            return;
        }

        var test = payload;
        Env.fromDTO(payload["env"], function(err, env) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.BadRequest));
                return;
            };

            test["env"] = env;
            new Test(test).save(function(err) {
                if (err) {
                    winston.error(err);
                    next(new APICustomError(Status.InternalServerError));
                    return;
                }

                res.status(Status.Created).send();
            });
        });
    })
});

router.put('/', function(req, res, next) {
    next(new APICustomError(Status.MethodNotAllowed));
});

router.delete('/', function(req, res, next) {
    next(new APICustomError(Status.MethodNotAllowed));
});

router.get('/:testName', function(req, res, next) {
    winston.info("Getting 'test' by name...");
    var testName = req.params["testName"];

    Test.findOne({name: testName}, function(err, test){
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (test == null) {
            winston.error("Not Found");
            next(new APICustomError(Status.NotFound));
            return;
        }

        res.status(Status.OK).json(test.toDTO());
    });
});

router.put('/:testName', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.post('/:testName', function(req, res, next) {
    next(new APICustomError(Status.MethodNotAllowed));
});

router.delete('/:testName', function(req, res, next) {
    winston.info("Deleteting 'test' by name...");
    var testName = req.params["testName"];

    Test.findOne({name: testName}, function(err, test) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (test == null) {
            winston.error("Does not exist!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        Test.remove({name: testName}, function(err) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.InternalServerError));
                return;
            }

            res.status(Status.OK).send();
        });
    });

});

router.get('/:testName/files', function(req, res, next) {
    winston.info("Getting 'all test files' by test name...");
    var testName = req.params["testName"];

    Test.findOne({name: testName}).populate("files").exec(function(err, test) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (test == null) {
            winston.error("Does not exist!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        for (var i = 0; i != test.files.length; ++i) {
            test.files[i] = test.files[i].toDTO();
        };

        res.status(Status.OK).send(test.files);
    });
});

router.put('/:testName/files', function(req, res, next) {
    next(new APICustomError(Status.MethodNotAllowed));
});

router.post('/:testName/files', function(req, res, next) {
    winston.info("Creating 'test file' by test name...");
    var testName = req.params["testName"];
    var payload = req.body;
    winston.debug(payload);

    Test.findOne({name: testName}, function(err, test) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (test == null) {
            winston.error("Does not exist!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        File.create(payload, function (err, file) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.InternalServerError));
                return;
            }

            test.files.push(file);
            test.save(function(err) {
                if (err) {
                    winston.error(err);
                    next(new APICustomError(Status.InternalServerError));
                    return;
                }
                res.status(Status.Created).send();
            });
        });

    });
});

router.delete('/:testName/files', function(req, res, next) {
    next(new APICustomError(Status.MethodNotAllowed));
});

module.exports = router;
