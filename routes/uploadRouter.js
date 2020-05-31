const express = require('express')
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const cors = require('./cors')
const multer = require('multer')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can only upload images'), false)
    }
    cb(null, true)
}

// multer configuration
const upload = multer({ storage: storage, fileFilter: imageFileFilter })

const uploadRouter = express.Router()

uploadRouter.use(bodyParser.json())

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) }) 
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(req.file)
})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('GET not supported on /imageUpload')
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT not supported on /imageUpload')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('DELETE not supported on /imageUpload')
})

module.exports = uploadRouter
