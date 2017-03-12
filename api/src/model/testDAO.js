var mongoose = require('mongoose');
var uuid = require('uuid/v4');

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
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
    }],
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

var populateEnv = function(next) {
    this.populate('env');
    next();
}

testSchema.pre('find', populateEnv);
testSchema.pre('findOne', populateEnv);

testSchema.methods.toDTO = function() {
    return {
        "name": this["name"],
        "env": this["env"].toDTO(),
        "description": this["description"]
    }
}

testSchema.statics.fromDTO = function(dto, callback) {
    var Test = this.model('Test');
    Test.findOne({name: dto["name"]}, function(err, test) {
        if (err) {
            callback(err, null);
            return;
        };

        if (test == null) {
            callback("Error", null);
            return;
        }

        callback(null, test);
    })
}

module.exports = mongoose.model('Test', testSchema);
