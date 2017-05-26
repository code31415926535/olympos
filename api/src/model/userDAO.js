var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var permissions = require(global.root + '/model/permissions');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        requried: true
    },
    email: {
        type: String,
        required: true
    },

    permission: {
        type: String,
        enum: [permissions.REGULAR, permissions.STUDENT, permissions.TEACHER, permissions.ADMIN, permissions.special.JOBRUNNER],
        required: true
    },

    created_at: Date,
    updated_at: Date
});

userSchema.pre('init', function(next) {
    this.created_at = new Date();

    next();
});

userSchema.pre('save', function(next) {
    this.updated_at = new Date();

    next();
});

userSchema.methods.generateHash = function(password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.toDTO = function () {
    return {
        "username": this["username"],
        "email": this["email"],
        "permission": this["permission"]
    }
}

module.exports = mongoose.model('User', userSchema);
