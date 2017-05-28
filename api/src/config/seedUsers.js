var winston = require('winston');

var User = require(global.root + '/model/userDAO');
var permissions = require(global.root + '/model/permissions');

var adminUsername = process.env.ADMIN_USERNAME
var adminPassword = process.env.ADMIN_PASSWORD

var hermesUsername = process.env.HERMES_USERNAME
var hermesPassword = process.env.HERMES_PASSWORD

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

        var hermes = new User();
        hermes["username"] = hermesUsername;
        hermes["password"] = hermes.generateHash(hermesPassword);
        hermes["email"] = "hermes@example.com";
        hermes["permission"] = permissions.special.JOBRUNNER;

        winston.debug("Creating hermes user ...");
        hermes.save(function(err){
            if (err) {
                winston.error("Failed to create hermes user!!!");
                winston.error(err);
            } else {
                winston.debug("Jobrunner user created!");
            }

            callback();
        });
    });
}
