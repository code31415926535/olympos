var mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

var envSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },

    uuid: String,
	created_at: Date,
	updated_at: Date
});

envSchema.pre('init', function (next) {
    this.created_at = new Date();
    this.uuid = uuidV4();

    next();
});

envSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

module.exports = mongoose.model('Env', envSchema);
