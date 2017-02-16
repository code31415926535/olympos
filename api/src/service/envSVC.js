var envDAO = require(global.root + '/model/envDAO');
var winston = require('winston');
var APICustomError = require(global.root + '/error/APICustomError');

// Get All
var getFilter = function(filter, callback) {
    winston.debug("Getting envs by filter: (%s)", filter);
    envDAO.find(filter, function (err, envs) {
        if (err) {
            winston.error("Failed to get envs.");
            winston.debug(err);
            callback(null, new APICustomError(500));
        }

        winston.debug("Got envs from database!");
        result = [];
        envs.forEach(function(env) {
            result.push({
                "name": env.name,
                "image": env.image
            });
        });

        callback(null, result);
    });
}

// Create
var create = function(env, callback) {
    var e = new envDAO(env);
    e.save(function (err) {
        if (err) {
            winston.error("Failed to create env");
            winston.debug(err);
            callback(new APICustomError(500));
        }

        callback(null);
    });
}

module.exports = {
    getFilter: getFilter,
    create: create,
}
