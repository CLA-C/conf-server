const express = require('express')
const bodyParser = require('body-parser')

const leaderRouter = express.Router()

leaderRouter.use(bodyParser.json())

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res, next) => {
    res.end('Here is the complete list of leaders')
})
.post((req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /leaders')
})
.delete((req, res, next) => {
    res.end('Deleting all leaders')
})

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    next()
})
.get((req, res, next) => {
    res.end('Here\'s the leader with Id ' + req.params.leaderId)
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST not supported on /leaders/' + req.params.leaderId)
})
.put((req, res, next) => {    
    res.write('Updating the leader with Id: ' + req.params.leaderId)
    res.end(' Will update the leader: ' + req.body.name + ' with details: ' + req.body.description)
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId)
})

module.exports = leaderRouter
