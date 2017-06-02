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

var populateData = function(next) {
    this.populate('submission_file');
    this.populate('submission_user');
    this.populate('test');
    this.populate('result');
    next();
}

var populateFile = function(next) {
    this.populate('submission_file');
    next();
}

var populateUser = function(next) {
    this.populate('submission_user');
    next();
}

var populateTest = function(next) {
    this.populate('test');
    next();
}

var populateResult = function(next) {
    this.populate('result');
    next();
}

jobSchema.pre('find', populateData);
jobSchema.pre('findOne', populateData);

// Utility functions
jobSchema.methods.toDTO = function() {
    var result;
    if (this["result"] == undefined) {
        result = {};
    } else {
        result = this["result"].toDTO();
    }
    return {
        "uuid": this["uuid"],
        "status": this["status"],
        "test": this["test"].toDTO(),
        "submission": {
            "id": this["submission_id"],
            "file": this["submission_file"].toDTO(),
            "user": this["submission_user"].toDTO()
        },
        "result": result,
        "log": this["log"]
    };
};

jobSchema.methods.toSubmissionDTO = function() {
    return {
        "jobUuid": this["uuid"],
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
