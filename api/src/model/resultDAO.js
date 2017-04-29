var mongoose = require('mongoose');

var resultSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: true
    },
    passed: {
        type: Number,
        required: true
    },
    failed: {
        type: Number,
        required: true
    },
    skipped: {
        type: Number,
        required: true
    },

    cases: [{
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    }],

    result: {
        status_code: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },

	created_at: Date,
	updated_at: Date
});

resultSchema.pre('init', function (next) {
    this.created_at = new Date();

    next();
});

resultSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

resultSchema.methods.toDTO = function() {
    return {
        "total": this["total"],
        "passed": this["passed"],
        "failed": this["failed"],
        "skipped": this["skipped"],

        "cases": this["cases"],
        "result": this["result"]
    }
}

module.exports = mongoose.model('Result', resultSchema);
