const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const cors = require('./cors')
const Favorites = require('../models/favorites')
const favoriteRouter = express.Router()

favoriteRouter.use(bodyParser.json())

/**
 *  All favorites methods
 */
favoriteRouter.route('/')
.get(cors.cors, authenticate.verifyUser, (req, res, next) => { 
    Favorites.findOne({ user: req.user._id }) // find favorite by user id
        .populate('user') // use mongoose population to get user and dishes
        .populate('dishes')
        .then((favorites) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(favorites)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
        .then((favorites) => {
            if (!favorites) { // if no fav list create it
                Favorites.create({
                    user: req.user._id,
                    dishes: req.body
                }).then((favorites) => {
                    console.log('favorites list created ', favorites)
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(favorites)
                }, (err) => next(err))
                
                return 
            }

            // update the list
            req.body.forEach((dishId) => {
                if (!favorites.dishes.includes(dishId._id)) {
                    favorites.dishes.push(dishId._id)
                }
            })

            favorites.save()
                .then((favorites) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(favorites)                  
                }, (err) => next(err))
    
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /favorites')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({ user: req.user._id })
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

/**
 *  Single favorite dish methods
 */
favoriteRouter.route('/:dishId')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('GET not supported on /favorites/:dishId')
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({ user: req.user._id })
        .then((favorites) => {
            if (!favorites) { // if no fav list create it
                Favorites.create({
                    user: req.user._id,
                    dishes: [ req.params.dishId ]
                }).then((favorites) => {
                    console.log('favorites list created ', favorites)
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(favorites)
                }, (err) => next(err))
                
                return 
            }

            if (!favorites.dishes.includes(req.params.dishId)) {
                favorites.dishes.push(req.params.dishId)

                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(favorites)                  
                }, (err) => next(err))
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /favorites/:dishId')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
        .then((favorites) => {
            favorites.dishes.pull(req.params.dishId)
            
            favorites.save()
                .then((favorites) => {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.json(favorites)                  
                }, (err) => next(err))
            
        }, (err) => next(err))
        .catch((err) => next(err))
})

module.exports = favoriteRouter