var express = require('express');
var router = express.Router();
var winston = require('winston');

/* Load local routes */
var APICustomError = require(global.root + '/error/APICustomError');
var env = require(global.root + '/route/env');

/* Map routes */
router.use('/env', env);

/* Map errors */
router.all('*', function(req, res, next) {
    next(new APICustomError(404));
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
            code: 500,
            message: "Internal Server Error!"
        };
    };

    res.status(response.code).json(response);
});

module.exports = router;
