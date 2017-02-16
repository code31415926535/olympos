var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var APICustomError = require(global.root + '/error/APICustomError');
var envSVC = require(global.root + '/service/envSVC');

// TODO: Permission handling.

router.use(bodyParser.json());

// Index
router.get('/', function(req, res, next) {
    winston.info("Getting all 'env'-s...");
    envSVC.getFilter({}, function(err, envs) {
        if (err) {
            next(err);
        }

        res.status(200).json(envs);
    });
});

// TODO: Validate
router.post('/', function(req, res, next) {
    winston.info("Creating 'env'...");
    payload = req.body;

    filter = {name: payload["name"]};
    envSVC.getFilter(filter, function(err, envs) {
        if (err) {
            next(err);
        }

        if (envs.length != 0) {
            next(new APICustomError(409));
        }

        envSVC.create(payload, function(err) {
            if (err) {
                next(err);
            }

            res.status(200).json({"message": "OK"});
        });
    });
});

router.put('/', function(req, res, next) {
    next(new APICustomError(501));
});

router.delete('/', function(req, res, next) {
    next(new APICustomError(501));
});

// Add Routes
module.exports = router;
