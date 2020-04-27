const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')

const config = require('./config') 

const User = require('./models/user')

// User.authenticate method is provided by passport-local-mongoose
exports.local = passport.use(new LocalStrategy(User.authenticate()))

// needed when using sessions
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600 // 1 h expiration
    })
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('JWT payload ', jwt_payload)
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
            return done(err, false)
        }
        if (user) {
            return done(null, user)
        }
        return done(null, false)            
    })
}))

exports.verifyUser = passport.authenticate('jwt', {session: false})