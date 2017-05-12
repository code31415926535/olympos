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
 *   File:
 *     properties:
 *       name:
 *         type: string
 *       content:
 *         type: string
 */

/**
 * @swagger
 * /test:
 *   get:
 *     tags:
 *       - Test
 *     description: Returns a list of all tests.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all tests.
 *         type: array
 *         items:
 *           $ref: '#/definitions/Test'
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /test:
 *   post:
 *     tags:
 *       - Test
 *     description: Create a new test.
 *     parameters:
 *       - name: test
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Test'
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Conflict. Object already exists.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /test/{name}:
 *   get:
 *     tags:
 *       - Test
 *     description: Get test by name.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Test.
 *         schema:
 *           $ref: '#/definitions/Test'
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /test/{name}:
 *   delete:
 *     tags:
 *       - Test
 *     description: Delete test by name.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Test deleted.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /test/{name}/files:
 *   get:
 *     tags:
 *       - Test
 *     description: Returns a list of all files attached to a test.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all files attached to the test.
 *         type: array
 *         items:
 *           $ref: '#/definitions/File'
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
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

/**
 * @swagger
 * /test/{name}/files:
 *   post:
 *     tags:
 *       - Test
 *     description: Attach a file to the test.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         type: string
 *       - name: file
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/File'
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Created.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/:testName/files', function(req, res, next) {
    winston.info("Creating 'test file' by test name...");
    var testName = req.params["testName"];
    winston.debug("Test name is:");
    winston.debug(testName);
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

module.exports = router;
