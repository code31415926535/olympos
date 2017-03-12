var mongoose = require('mongoose');
var uuid = require('uuid/v4');

var fileSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },

	created_at: Date,
	updated_at: Date
});

fileSchema.pre('init', function (next) {
    this.created_at = new Date();
    this.uuid = uuid();

    next();
});

fileSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

// Utility functions
fileSchema.methods.toDTO = function() {
    return {
        "uuid": this["uuid"],
        "name": this["name"],
        "content": this["content"]
    };
};

fileSchema.statics.fromUUID = function(uid, callback) {
    var File = this.model('File');
    File.findOne({uuid: uid}, function(err, file) {
        callback(err, file);
    });
}

module.exports = mongoose.model('File', fileSchema);
