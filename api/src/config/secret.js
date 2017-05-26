var uuid = require('uuid/v4');
var winston = require('winston');

winston.info("Generated jwt secret!");
var secret = uuid();

module.exports = function() {
    return secret;
}
