var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel')

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

var opts = {}
opts.secretOrKey = process.env.JWT_SECRET_KEY;
opts.jwtFromRequest = cookieExtractor;

const passportAuth = (passport) => {
    passport.use(
        new JwtStrategy(opts, function (jwt_payload, cb) {

            User.findOne({_id: jwt_payload.id}, function(err, user) {
                if (err) {
                    return cb(err, false);
                }
                if (user) {
                    return cb(null, user);
                } else {
                    return cb(null, false);
                }
            })
        })
    )
}

module.exports = { passportAuth }