var mongoose = require('mongoose');

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

	created_at: Date,
	updated_at: Date
});

testSchema.pre('init', function (next) {
    this.created_at = new Date();

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
    var Test = this.model('Test');
    Test.findOne(dto, function(err, test) {
        if (err) {
            callback(err, null);
            return;
        };

        if (test == null) {
            Env.fromDTO(dto["env"], function(err, env) {
                if (err) {
                    callback(err, null);
                    return;
                };

                dto["env"] = env;
                var test = new Test(dto).save(function(err) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    callback(null, test);
                    return;
                });

                callback(null, test);
            });
        }

        callback(null, test);
    })
}

module.exports = mongoose.model('Test', testSchema);
