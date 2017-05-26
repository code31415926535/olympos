var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
    uuid: {
        type: String
    },
    submission_id: Number,
    submission_file: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    },
    submission_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Running", "Failed", "Completed"],
        default: "Running"
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
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
        "test": this["test"].toDTO(),
        "submission": {
            "id": this["submission_id"],
            "file": this["submission_file"].toDTO(),
            "user": this["submission_user"].toDTO()
        },
        "result": this["result"].toDTO(),
        "log": this["log"]
    };
};

jobSchema.methods.toSubmissionDTO = function() {
    return {
        "id": this["submission_id"],
        "file": this["submission_file"].toDTO(),
        "by": this["submission_user"]["username"]
    }
};

jobSchema.methods.toJobrunnerDTO = function () {
    return {
        "uuid": this["uuid"],
        "test": this["test"].toJobrunnerDTO(),
        "submission": {
            "file": this["submission_file"].toDTO()
        },
        "status": this["status"],
        "log": this["log"]
    }
}

module.exports = mongoose.model('Job', jobSchema);
