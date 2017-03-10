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
        "image": this["image"]
    };
}

envSchema.statics.fromDTO = function(dto, callback) {
    var Env = this.model('Env');
    Env.findOne(dto, function(err, env) {
        if (err) {
            callback(err, null);
            return;
        }

        if (env == null) {
            var env = new Env(dto).save(function(err) {
                if (err) {
                    callback(err, null);
                    return;
                }

                callback(null, env);
                return;
            });
        };

        callback(null, env);
    });
}

module.exports = mongoose.model('Env', envSchema);
