const express = require('express')
const cors = require('cors')

const app = express()

const whitelist = ['http://localhost:3000', 'https://localhost:3443']

const corsOptionsDelegate = (req, cb) => {
    let corsOptions

    if (whitelist.includes(req.header('Origin'))) {
        corsOptions = { origin: true } // will include Access-Control-Allow-Origin
    } else {
        corsOptions = { origin: false }
    }

    cb(null, corsOptions)
}

exports.cors = cors()
exports.corsWithOptions = cors(corsOptionsDelegate)