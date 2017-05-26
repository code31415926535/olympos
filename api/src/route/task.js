var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');
var uuid = require('uuid/v4');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var jc = require(global.root + '/clients/jobrunner_client');

var Test = require(global.root + '/model/testDAO');
var Job = require(global.root + '/model/jobDAO');
var File = require(global.root + '/model/fileDAO');
var Task = require(global.root + '/model/taskDAO');

var auth = require(global.root + '/route/middleware/auth');

var dataValidator = require(global.root + '/route/middleware/dataValidator');
var validateTask = dataValidator.validateTask;
var validateFile = dataValidator.validateFile;

const GET_TASK_PERM = 0;
const MODIFY_TASK_PERM = 11;
const SUBMIT_PERM = 9;

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

/**
 * @swagger
 * /task:
 *   get:
 *     tags:
 *       - Task
 *     description: Returns a list of all tasks.
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array with all tasks.
 *         type: array
 *         items:
 *           $ref: '#/definitions/Task'
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/', auth(GET_TASK_PERM), function(req, res, next) {
    winston.info("Getting all 'task'-s...");
    Task.find({}, function(err, tasks) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        for  (var i = 0; i != tasks.length; i++) {
            tasks[i] = tasks[i].toDTO();
        }

        res.status(Status.OK).json(tasks);
    });
});

/**
 * @swagger
 * /task:
 *   post:
 *     tags:
 *       - Task
 *     description: Create a new task.
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         required: true
 *         type: string
 *       - name: task
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Task'
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
router.post('/', validateTask, auth(MODIFY_TASK_PERM), function(req, res, next) {
    winston.info("Creating 'task'...");
    payload = req.body;

    filter = {name: payload["name"]};
    Task.findOne(filter, function(err, task) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        }

        if (task != null) {
            winston.error("Task already exists!");
            next(new APICustomError(Status.Conflict));
            return;
        }

        var task = payload;
        Test.fromDTO(payload["test"], function(err, test) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.BadRequest));
                return;
            };

            task["test"] = test;
            new Task(task).save(function(err) {
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
 * /task/{name}:
 *   get:
 *     tags:
 *       - Task
 *     description: Get task by name.
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
 *         description: Task.
 *         schema:
 *           $ref: '#/definitions/Task'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:taskName', auth(GET_TASK_PERM), function(req, res, next) {
    winston.info("Getting 'task' by name...");
    var taskName = req.params["taskName"];

    Task.findOne({name: taskName}).populate("test").exec(function(err, task){
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (task == null) {
            winston.error("Not Found");
            next(new APICustomError(Status.NotFound));
            return;
        }

        res.status(Status.OK).json(task.toDTO());
    });
});

/**
 * @swagger
 * /task/{name}:
 *   delete:
 *     tags:
 *       - Task
 *     description: Delete task by name.
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
 *         description: Task deleted.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.delete('/:taskName', auth(MODIFY_TASK_PERM), function(req, res, next) {
    winston.info("Deleteting 'task' by name...");
    var taskName = req.params["taskName"];

    Task.findOne({name: taskName}, function(err, task) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (task == null) {
            winston.error("Not Found");
            next(new APICustomError(Status.NotFound));
            return;
        }

        Task.remove({name: taskName}, function(err) {
            if (err) {
                winston.error(err);
                next(Status.InternalServerError);
                return;
            }

            res.status(Status.OK).send();
        });
    });
});

/**
 * @swagger
 * /task/{name}/submission:
 *   get:
 *     tags:
 *       - Task
 *     description: Delete task by name.
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
 *         description: An array with all the submissions for this task.
 *         type: array
 *         items:
 *           $ref: '#/definitions/Submission'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/:taskName/submission', auth(SUBMIT_PERM), function(req, res, next) {
    winston.info("Getting 'task submissions' by task name...");
    var taskName = req.params["taskName"];

    Task.find({name: taskName}).populate("jobs").exec(function(err, task){
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (task == null) {
            winston.error("Not Found");
            next(new APICustomError(Status.NotFound));
            return;
        }

        for (var i = 0; i != task.jobs.length; i++) {
            task.jobs[i] = task.jobs[i].toSubmissionDTO();
        }

        res.status(Status.OK).json(task.jobs);
    });
});

/**
 * @swagger
 * /task/{name}/submission:
 *   post:
 *     tags:
 *       - Task
 *     description: Submit a solution.
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
 *     responses:
 *       201:
 *         description: Submission successfull.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Not Found.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/:taskName/submission', validateFile, auth(SUBMIT_PERM), function(req, res, next) {
    winston.info("Creating 'task submission' by task name...");
    var taskName = req.params["taskName"];
    var payload = req.body;
    var usr = req.user;

    Task.findOne({name: taskName}, function(err, task) {
        if (err) {
            winston.error(err);
            next(new APICustomError(Status.InternalServerError));
            return;
        };

        if (task == null) {
            winston.error("Does not exist!");
            next(new APICustomError(Status.NotFound));
            return;
        }

        Task.populate(task, {path: 'test.files', model: 'File'}, function (err, task) {
            User.fromDTO(usr, function (err, user) {
                File.create(payload, function(err, file) {
                    if (err) {
                        winston.error(err);
                        next(new APICustomError(Status.InternalServerError));
                        return;
                    }

                    var jb = {
                        "submission_file": file,
                        "submission_id": task.jobs.length,
                        "submission_user": user
                    };
                    var job = new Job();
                    job["submission_file"] = file;
                    job["submission_id"] = task.jobs.length;
                    job["test"] = task.test;
                    job["uuid"] = uuid();
                    job.save(function (err) {
                        if (err) {
                            winston.error(err);
                            next(new APICustomError(Status.InternalServerError));
                            return;
                        }

                        task.jobs.push(job);
                        task.save(function(err) {
                            if (err) {
                                winston.error(err);
                                next(new APICustomError(Status.InternalServerError));
                                return;
                            }
                            jc.runJob(job.toJobrunnerDTO(), function(err) {
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
            });
        });
    });
});

module.exports = router;
