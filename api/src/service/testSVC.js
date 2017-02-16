var testDAO = require(global.root + '/model/testDAO');
var winston = require('winston');
var APICustomError = require(global.root + '/error/APICustomError');

// Get all
// var getAll(callback) {
//     testDAO.find({}, function (err, tests) {
//         if (err) {
//             winston.debug("Failed to get all tests");
//             throw new APICustomError(500);
//         }
//
//         result = [];
//
//         tests.forEach(function(test) {
//             result.push({
//
//             });
//         });
//     });
// }
