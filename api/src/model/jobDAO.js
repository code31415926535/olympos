var mongoose = require('mongoose');
var uuid = require('uuid/v4');

var jobSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    submission_id: Number,
    submission_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    },
    status: {
        type: String,
        enum: ["Created", "Running", "Failed", "Completed"],
        default: "Created"
    },
    result: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result"
    },
    log: {
        type: String,
        default: ""
    },

	created_at: Date,
	updated_at: Date
});

jobSchema.pre('init', function (next) {
    this.created_at = new Date();
    this.submission_date = new Date();
    this.uuid = uuid();

    next();
});

jobSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

var populateFile = function(next) {
    this.populate('submission_file');
    next();
}

jobSchema.pre('find', populateFile);
jobSchema.pre('findOne', populateFile);

// Utility functions
jobSchema.methods.toDTO = function() {
    return {
        "uuid": this["uuid"],
        "status": this["status"],
        "submission": {
            "id": this["submission_id"],
            "file": this["submission_file"].toDTO()
        },
        "log": this["log"]
    };
};

jobSchema.methods.toSubmissionDTO = function() {
    return {
        "id": this["submission_id"],
        "file": this["submission_file"].toDTO()
    }
};

module.exports = mongoose.model('Job', jobSchema);
