var mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');

var testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    env: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Env",
        required: true
    },
    config: {
        type: String,
        required: true
    },

    description: String,

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

testSchema.methods.toDTO = function() {
    return {
        "name": this["name"],
        "env": this["env"].toDTO(),
        "config": this["config"],
        "description": this["description"]
    }
}

testSchema.static.fromDTO = function(dto, callback) {
    this.model('Test').findOne(dto, function(err, test) {
        if (err) {
            callback(err, null);
        };

        callback(null, test);
    })
}

module.exports = mongoose.model('Test', testSchema);
