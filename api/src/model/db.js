var mongoose = require('mongoose');
var nconf = require('nconf');

/* TODO: Use username and password */

var dbHost = process.env.DB_HOSTNAME
var dbPort = process.env.DB_PORT
var dbName = process.env.DB_NAME

module.exports.connect = function (callback) {
		var db_url = 'mongodb://'
			+ dbHost
			+ ":"
			+ dbPort
			+ "/"
			+ dbName;

		var connection = {
			'url' : db_url
		};

        mongoose.connect(connection.url, function(err) {
            if (err) {
                callback(new Error("Failed to connect to database"));
            };

            callback();
        });
    };
