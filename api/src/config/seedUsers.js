var winston = require('winston');

var User = require(global.root + '/model/userDAO');
var permissions = require(global.root + '/model/permissions');

var adminUsername = process.env.ADMIN_USERNAME
var adminPassword = process.env.ADMIN_PASSWORD

var jobrunnerUsername = process.env.JOBRUNNER_USERNAME
var jobrunnerPassword = process.env.JOBRUNNER_PASSWORD

module.exports.seed = function (callback) {
    winston.info("Seeding users to database ...");

    var admin = new User();
    admin["username"] = adminUsername;
    admin["password"] = admin.generateHash(adminPassword);
    admin["email"] = "admin@example.com";
    admin["permission"] = permissions.ADMIN;

    winston.debug("Creating admin user ...");
    admin.save(function(err) {
        if (err) {
            winston.error("Failed to create admin user!!!");
            winston.error(err);
        } else {
            winston.debug("Admin user created!");
        }

        var jobrunner = new User();
        jobrunner["username"] = jobrunnerUsername;
        jobrunner["password"] = jobrunner.generateHash(jobrunnerPassword);
        jobrunner["email"] = "jobrunner@example.com";
        jobrunner["permission"] = permissions.special.JOBRUNNER;

        winston.debug("Creating jobrunner user ...");
        jobrunner.save(function(err){
            if (err) {
                winston.error("Failed to create jobrunner user!!!");
                winston.error(err);
            } else {
                winston.debug("Jobrunner user created!");
            }

            callback();
        });
    });
}
