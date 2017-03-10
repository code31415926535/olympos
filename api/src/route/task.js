var express = require('express');
var router = express.Router();
var winston = require('winston');
var bodyParser = require('body-parser');

var Status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var Test = require(global.root + '/model/testDAO');
var Task = require(global.root + '/model/taskDAO');

router.use(bodyParser.json());

router.get('/', function(req, res, next) {
    winston.info("Getting all 'task'-s...");
    Task.find({}).populate("test").exec(function(err, tasks) {
        if (err) {
            next(new APICustomError(Status.InternalServerError));
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
            next(new APICustomError(Status.InternalServerError));
        }

        if (task != null) {
            next(new APICustomError(Status.Conflict));
        }

        var task = payload;
        Test.fromDTO(payload["test"], function(err, task) {
            if (err) {
                next(new APICustomError(Status.InternalServerError));
            };

            task["task"] = task;

            new Task(task).save(function(err) {
                if (err) {
                    next(new APICustomError(Status.InternalServerError));
                }

                res.status(Status.Created).send();
            });
        });
    })
});

router.put('/', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.delete('/', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.get('/:taskName', function(req, res, next) {
    winston.info("Getting 'text' by name...");
    var taskName = req.params["taskName"];

    Task.findOne({name: taskName}).populate("test").exec(function(err, task){
        if (err) {
            next(new APICustomError(Status.InternalServerError));
        };

        res.status(Status.OK).json(task.toDTO());
    });
});

router.put('/:taskName', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});

router.post('/:taskName', function(req, res, next) {
    next(new APICustomError(Status.NotImplemented));
});
env
router.delete('/:taskName', function(req, res, next) {
    winston.info("Deleteting 'task' by name...");
    var taskName = req.params["taskName"];

    Task.remove({name: taskName}, function(err) {
        if (err) {
            next(Status.InternalServerError);
        }

        res.status(Status.OK).send();
    })
});

module.exports = router;
