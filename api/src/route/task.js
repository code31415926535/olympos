var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var Test = require(global.root + '/model/testDAO');
var Job = require(global.root + '/model/jobDAO');
var File = require(global.root + '/model/fileDAO');
var Task = require(global.root + '/model/taskDAO');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
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

router.post('/', function(req, res, next) {
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

router.get('/:taskName', function(req, res, next) {
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

router.delete('/:taskName', function(req, res, next) {
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

/* Submission endpoint */
router.get('/:taskName/submission', function(req, res, next) {
    winston.info("Getting 'task submissions' by task name...");
    var taskName = req.params["taskName"];

    Task.findOne({name: taskName}).populate("jobs").exec(function(err, task){
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

router.post('/:taskName/submission', function(req, res, next) {
    winston.info("Creating 'task submission' by task name...");
    var taskName = req.params["taskName"];
    var payload = req.body;
    winston.debug(payload);

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

        var fl = payload["file"];
        File.create(fl, function(err, file) {
            if (err) {
                winston.error(err);
                next(new APICustomError(Status.InternalServerError));
                return;
            }

            var jb = {
                "submission_file": file,
                "submission_id": task.jobs.length
            };
            Job.create(jb, function (err, job) {
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
                    // TODO: Start the job here
                    res.status(Status.Created).send();
                });
            });
        });
    });
});

module.exports = router;
