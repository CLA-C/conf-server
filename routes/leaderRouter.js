const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const Leaders = require('../models/leaders')
const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

/**
 *  All leaders methods
 */
leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
        .then((leaders) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(leaders)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
        .then((leader) => {
            console.log('Leader created ', leader)
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(leader)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /leaders')
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

/**
 *  Single leader methods
 */
leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(leader)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('POST not supported on /leaders/' + req.params.leaderId)
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {    
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
        .then((leader) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(leader)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err))
})

module.exports = leaderRouter
