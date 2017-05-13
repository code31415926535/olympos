var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var Job = require(global.root + '/model/jobDAO');
var Result = require(global.root + '/model/resultDAO');

// TODO: Permission handling.

router.use(bodyParser.json());

// Index
router.get('/', function(req, res, next) {
    winston.info("Getting all 'job'-s...");
    Job.find({}, function(err, jobs) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        for (var i = 0; i != jobs.length; i++) {
            jobs[i] = jobs[i].toDTO();
        }

        res.status(Status.OK).json(jobs);
    });
});

// Get by name
router.get('/:jobUuid', function(req, res, next) {
    winston.info("Getting 'job' by uuid...");
    var jobUuid = req.params["jobUuid"];

    Job.findOne({uuid: jobName}, function(err, job) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (job == null) {
            winston.error("Not found!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        res.status(Status.OK).json(job.toDTO());
    });
});

router.get('/:jobUuid/result', function(req, res, next) {
    winston.info("Getting 'job' result by uuid...");
    var jobUuid = req.params["jobUuid"];
    var payload = req.body;

    Job.findOne({uuid: jobUuid}).populate("result").exec(function(err, job) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (job == null) {
            winston.error("Not found!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        console.log(payload);

        res.status(Status.OK).json(job.result.toDTO());
    });
});

// TODO: Only job runner should have permission here
router.post('/:jobUuid/result', function(req, res, next) {
    winston.info("Creating 'job' result by uuid...");
    var jobUuid = req.params["jobUuid"];
    var payload = req.body;

    Job.findOne({uuid: jobUuid}, function(err, job) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (job == null) {
            winston.error("Not found!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        winston.debug("Creating result ....");
        var result = new Result(payload);
        result.save(function (err) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.InternalServerError));
                return;
            }

            winston.debug("Updating job ...");
            job.result = result;
            job.save(function (err) {
                winston.debug("Job saved!");
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
