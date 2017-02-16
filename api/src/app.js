var express = require('express');
var app = express();
var http = require('http');
var async = require('async');
var path = require('path');
var winston = require('winston');

global.root = path.resolve(__dirname);

var db = require(global.root + '/model/db');
var master = require(global.root + '/route/master');
require(global.root + '/config/log')();

/* Setup the application */
var setup = function (callback) {
    app.use(master);

    callback();
}

/* Start the application */
var launch = function (callback) {

    var protocol = process.env.CRIMSON_PROTOCOL;
    var port = process.env.CRIMSON_PORT;

    if (protocol == 'http') {
        winston.info('Creating http server on port ' + port)
        http.createServer(app).listen(port);
    } else if (protocol == 'https') {
        /* TODO: */
    } else {
        winston.error('Invalid protocol!');
        process.exit(1);
    }

    callback();
}

/* Call the startup steps in order */
async.series([
    db.connect,
    function (callback) {
        winston.info("Connected to database.");
        callback();
    },
    setup,
    function (callback) {
        winston.info("Server setup completed.");
        callback();
    },
    launch,
    function (callback) {
        winston.info("Server started!");
    }
], function (err) {
    winston.error(err);
    process.exit(1);
});
