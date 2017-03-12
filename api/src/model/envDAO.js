var mongoose = require('mongoose');

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
    description: String,

	created_at: Date,
	updated_at: Date
});

envSchema.pre('init', function (next) {
    this.created_at = new Date();

    next();
});

envSchema.pre('save', function(next) {
    this.updated_at = new Date();

	next();
});

// Utility functions
envSchema.methods.toDTO = function() {
    return {
        "name": this["name"],
        "image": this["image"],
        "description": this["description"]
    };
}

envSchema.statics.fromDTO = function(dto, callback) {
    var Env = this.model('Env');
    Env.findOne({name: dto["name"]}, function(err, env) {
        if (err) {
            callback(err, null);
            return;
        }

        if (env == null) {
            callback("Error", null);
            return;
        };

        callback(null, env);
    });
}

module.exports = mongoose.model('Env', envSchema);
