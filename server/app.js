const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const connectDB = require('./api/config/db')

// models
const User = require('./api/models/user')

const app = express()

connectDB()

app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

// test route
app.post('/users', (req, res, next) => {
    const {name, email, password} = req.body

    const user = new User({
        name,
        email,
        password,
    })

    user.save()
    .then(user => {
        res.status(200).json({
            status: 'success',
            user
        })
    })
    .catch(error => {
        next(error)
    })
})

// Handling errors
app.use((req, res, next) => {
    const error = new Error('Not found!')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        msg: error.message
    })
})

module.exports = app