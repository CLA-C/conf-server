const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('./cors')
const authenticate = require('../authenticate')
const User = require('../models/user')
const userRouter = express.Router()

userRouter.use(bodyParser.json())

/* GET users listing. */
userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
    User.find({})
        .then((users) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(users)
        }, (err) => next(err))
        .catch((err) => next(err))
})

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
    const newUser = new User({ username: req.body.username })
    if (req.body.firstname) {
        newUser.firstname = req.body.firstname
    }
    if (req.body.lastname) {
        newUser.lastname = req.body.lastname
    }

    // register method provided by passport-local-mongoose
    User.register(newUser, req.body.password, (err, user) =>{
        if (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({ err: err })
        } else {
            // immediately authenticate newly created user
            passport.authenticate('local')(req, res, () => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({ success: true, status: 'Registration successful' })
            })
        }
    })
})

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    let token = authenticate.getToken({ _id: req.user._id }) // id is enough to create web token, user added through passport auth middleware
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({ success: true, token: token, status: 'You are logged in!' })    
})

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
        req.session.destroy()
        res.clearCookie('session-id')
        res.redirect('/')
    } else {
        var err = new Error('You are not logged in')
        err.status = 403
        return next(err)
    }
})

userRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) { // user will be in req if successful auth
        let token = authenticate.getToken({ _id: req.user._id }) // create token as in normal login
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({ success: true, token: token, status: 'You are logged in!' }) 
    }
})

module.exports = userRouter
