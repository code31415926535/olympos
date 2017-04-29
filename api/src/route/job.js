var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var Job = require(global.root + '/model/jobDAO');

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

// Get and Delete by name
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

    Job.findOne({uuid: jobName}).populate("result").exec(function(err, job) {
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

        res.status(Status.OK).json(job.result.toDTO());
    });
});

router.post('/:jobUuid/result', function(req, res, next) {
    winston.info("Getting 'job' result by uuid...");
    var jobUuid = req.params["jobUuid"];

    Job.findOne({uuid: jobName}).populate("result").exec(function(err, job) {
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

        winston.debug(job);

        res.status(Status.Created).json(job.result.toDTO());
    });
});

module.exports = router;
