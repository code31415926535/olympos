var mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

var testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    lab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Env",
        required: true
    },
    config: {
        type: String,
        required: true
    }

    uuid: String,
	created_at: Date,
	updated_at: Date
});

testSchema.pre('init', function (next) {
    this.created_at = new Date();
    this.uuid = uuidV4();

    next();
});

testSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

module.exports = mongoose.model('Test', testSchema);
