var jwt = require('jsonwebtoken');

var secret = process.env.CRIMSON_SECRET;
var lifetime = process.env.CRIMSON_TOKEN_LIFETIME;

var genToken = function(req) {
    var token = jwt.sign({
        auth: 'wecode',
        exp: Math.floor(new Date().getTime()/1000) + lifetime
    }, secret);

    return token;
};

var validate = function(req) {
    var token = req.head.authorization;
    try {
        var decoded = jwt.verify(token, secret);
    } catch (e) {
        /* TODO: Return unauthorized instead */
        return null;
    }
    if (!decoded || decoded.auth !== 'night') {
        /* TODO: Return unauthorized instead */
        return null;
    } else {
        return true;
    }
}

module.exports.genToken = genToken;
module.exports.validate = validate;
