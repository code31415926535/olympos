var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test"
    },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        default: []
    }],
    description: String,

	created_at: Date,
	updated_at: Date
});

taskSchema.pre('init', function (next) {
    this.created_at = new Date();

    next();
});

taskSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

var populateTest = function(next) {
    this.populate('test');

    next();
}

taskSchema.pre('find', populateTest);
taskSchema.pre('findOne', populateTest);

taskSchema.methods.toDTO = function() {
    return {
        "name": this["name"],
        "test": this["test"].toDTO(),
        "description": this["description"]
    }
}

module.exports = mongoose.model('Task', taskSchema);
