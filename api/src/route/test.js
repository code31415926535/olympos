var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var Env = require(global.root + '/model/envDAO');
var File = require(global.root + '/model/fileDAO');
var Test = require(global.root + '/model/testDAO');

var auth = require(global.root + '/route/middleware/auth');

var dataValidator = require(global.root + '/route/middleware/dataValidator');
var validateTest = dataValidator.validateTest;
var validateFile = dataValidator.validateFile;

const TEST_PERM = 11;

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

/**
 * @swagger
 * /test:
 *   get:
 *     tags:
 *       - Test
 *     description: Returns a list of all tests.
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all tests.
 *         type: array
 *         items:
 *           $ref: '#/definitions/Test'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/', auth(TEST_PERM), function(req, res, next) {
    winston.info("Getting all 'test'-s...");
    Test.find({}, function(err, tests) {
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
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: test
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Test'
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
router.post('/', validateTest, auth(TEST_PERM), function(req, res, next) {
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
 *         description: Test.
 *         schema:
 *           $ref: '#/definitions/Test'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:testName', auth(TEST_PERM), function(req, res, next) {
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
 *         description: Test deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/:testName', auth(TEST_PERM), function(req, res, next) {
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
 *         description: An array with all files attached to the test.
 *         type: array
 *         items:
 *           $ref: '#/definitions/File'
 *       401:
 *         description: Uauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:testName/files', auth(TEST_PERM), function(req, res, next) {
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
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
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
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/:testName/files', validateFile, auth(TEST_PERM), function(req, res, next) {
    winston.info("Creating 'test file' by test name...");
    var testName = req.params["testName"];
    var payload = req.body;

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
