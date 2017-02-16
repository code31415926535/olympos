var winston = require('winston');

module.exports = function() {
    winston.configure({
        transports: [
            new winston.transports.Console({
                colorize: true,
                timestamp: true,
                level: process.env.LOG_LEVEL
            })
        ], exitOnError: false
    });

    winston.info("Logger configured!");
};
