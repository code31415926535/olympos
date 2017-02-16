var mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

var taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    created_by: {
        type: String,
        required: true
    },
    description: String,
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },

    uuid: String,
	created_at: Date,
	updated_at: Date
});

taskSchema.pre('init', function (next) {
    this.created_at = new Date();
    this.uuid = uuidV4();

    next();
});

taskSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

module.exports = mongoose.model('Task', taskSchema);
