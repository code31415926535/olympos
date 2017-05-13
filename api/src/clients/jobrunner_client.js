var request = require('request');
var status = require(global.root + '/config/status');
var APICustomError = require(global.root + '/error/APICustomError');

var hermesHost = process.env.HERMES_HOSTNAME
var hermesPort = process.env.HERMES_PORT
var hermesUri = "http://" + hermesHost + ":" + hermesPort;

module.exports.runJob = function(job, callback) {
    var options = {
        uri: hermesUri,
        method: "POST",
        json: job
    }

    console.log("____________________");
    console.log(job);
    console.log("____________________");
    request(options, function (err, res, body) {
        if (err) {
            callback(err);
            return;
        }

        if (res.statusCode != status.OK) {
            callback("Jobrunner returned: " + res.statusCode);
            return;
        }

        callback(null);
    });
}
