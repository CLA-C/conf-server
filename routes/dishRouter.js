const express = require('express')
const bodyParser = require('body-parser')

const Dishes = require('../models/dishes')
const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

/**
 *  All dishes methods
 */
dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
        .then((dishes) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(dishes)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post((req, res, next) => {
    Dishes.create(req.body)
        .then((dish) => {
            console.log('dish created ', dish)
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /dishes')
})
.delete((req, res, next) => {
    Dishes.remove({})
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

/**
 *  Single dish methods
 */
dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST not supported on /dishes/' + req.params.dishId)
})
.put((req, res, next) => {    
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
        .then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

/**
 *  All comments methods
 */
dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (!dish) {
                let err = new Error('Dish ' + req.params.dishId + ' not found')
                err.status = 404
                return next(err)
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(dish.comments)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (!dish) {
                let err = new Error('Dish ' + req.params.dishId + ' not found')
                err.status = 404
                return next(err)
            }

            dish.comments.push(req.body)
            dish.save()
                .then((dish) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(dish)
                }, (err) => next(err))
 
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /dishes/' + req.params.dishId + '/comments')
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (!dish) {
                let err = new Error('Dish ' + req.params.dishId + ' not found')
                err.status = 404
                return next(err)
            }

            for (let i = dish.comments.length - 1; i >= 0; --i) {
                dish.comments.id(dish.comments[i]._id).remove()
            }
            dish.save()
                .then((dish) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(dish)
                }, (err) => next(err))
        }, (err) => next(err))
        .catch((err) => next(err))
})

/**
 *  Single comment methods
 */
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            if (!dish || !dish.comments.id(req.params.commentId)) {
                let msg = !dish
                    ? 'Dish ' + req.params.dishId + ' not found'
                    : 'Comment ' + req.params.commentId + ' not found'
                let err = new Error(msg)
                err.status = 404
                return next(err)
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(dish.comments.id(req.params.commentId))
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId)
})
.put((req, res, next) => {    
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            let comment = dish.comments.id(req.params.commentId)
            if (!dish || !comment) {
                let msg = !dish
                    ? 'Dish ' + req.params.dishId + ' not found'
                    : 'Comment ' + req.params.commentId + ' not found'
                let err = new Error(msg)
                err.status = 404
                return next(err)
            }
            
            // allow only rating or comment desc modification
            if (req.body.rating != null) {
                comment.rating = req.body.rating
            }
            if (req.body.comment != null) {
                comment.comment = req.body.comment
            }
            dish.save()
                .then((dish) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(dish)
                }, (err) => next(err))
            
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            let comment = dish.comments.id(req.params.commentId)
            if (!dish || !comment) {
                let msg = !dish
                    ? 'Dish ' + req.params.dishId + ' not found'
                    : 'Comment ' + req.params.commentId + ' not found'
                let err = new Error(msg)
                err.status = 404
                return next(err)
            }
            
            comment.remove()
            dish.save()
                .then((dish) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(dish)
                }, (err) => next(err))
            
        }, (err) => next(err))
        .catch((err) => next(err))
})

module.exports = dishRouter
