var mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

var jobSchema = new mongoose.Schema({
    submitterBy: {
        type: String,
        required: true
    },

    status: String,
    uuid: String,
	created_at: Date,
	updated_at: Date
});

jobSchema.pre('init', function (next) {
    this.created_at = new Date();
    this.uuid = uuidV4();

    next();
});

jobSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

module.exports = mongoose.model('Job', jobSchema);
