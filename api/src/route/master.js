var express = require('express');
var router = express.Router();
var winston = require('winston');

/* Load local routes */
var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var env = require(global.root + '/route/env');
var test = require(global.root + '/route/test');
var task = require(global.root + '/route/task');

/* Map routes */
router.use('/test', test);
router.use('/env', env);
router.use('/task', task);
router.use('/*', function(req, res) {
    res.status(Status.OK).json({"code":"OK","message":"Wellcome to crimson rest-api server!"});
});

/* Map errors */
router.all('*', function(req, res, next) {
    next(new APICustomError(Status.NotFound));
});

router.use(function (err, req, res, next) {

    var response = {};
    winston.info("Error occured!");

    winston.debug(err.code);
    winston.debug(err.message);

    if ( err instanceof APICustomError ) {
        response = {
            code: err.code,
            message: err.message,
        };
    } else {
        response = {
            code: Status.InternalServerError,
            message: "Internal Server Error!"
        };
    };

    res.status(response.code).json(response);
});

module.exports = router;
