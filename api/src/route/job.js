var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');
var Job = require(global.root + '/model/jobDAO');
var Result = require(global.root + '/model/resultDAO');

var auth = require(global.root + '/route/middleware/auth');
var permissions = require(global.root + '/model/permissions');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const GET_JOBS_PERM = 19;
const GET_RESULT_PERM = 0;

/**
 * @swagger
 * /job:
 *   get:
 *     tags:
 *       - Job
 *     description: Returns a list of all jobs.
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all the jobs.
 *         type: array
 *         items:
 *           $ref: '#/definitions/Job'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/', auth(GET_JOBS_PERM), function(req, res, next) {
    winston.info("Getting all 'job'-s...");
    Job.find({}, function(err, jobs) {
        console.log(jobs);
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

/**
 * @swagger
 * /job/{uuid}:
 *   get:
 *     tags:
 *       - Job
 *     description: Returns a job based on uuid.
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         type: string
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: All information regarding a job.
 *         schema:
 *           $ref: '#/definitions/Job'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:jobUuid', auth(GET_JOBS_PERM), function(req, res, next) {
    winston.info("Getting 'job' by uuid...");
    var jobUuid = req.params["jobUuid"];

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

        res.status(Status.OK).json(job.toDTO());
    });
});

/**
 * @swagger
 * /job/{uuid}/result:
 *   get:
 *     tags:
 *       - Job
 *     description: Returns a the result of the given job.
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         type: string
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: The job result.
 *         schema:
 *           $ref: '#/definitions/Result'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:jobUuid/result', auth(GET_RESULT_PERM), function(req, res, next) {
    winston.info("Getting 'job' result by uuid...");
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

        if (job.result == undefined) {
            res.status(Status.OK).json({});
            return;
        }

        res.status(Status.OK).json(job.result.toDTO());
    });
});

/**
 * @swagger
 * /job/{uuid}/result:
 *   post:
 *     tags:
 *       - Job
 *     description: Post job result. Can only be used by jobrunner.
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         type: string
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Job result submitted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/:jobUuid/result', auth(permissions.special.JOBRUNNER), function(req, res, next) {
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
