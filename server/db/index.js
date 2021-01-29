const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/minesweeper', {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("Connected to db")
        }).catch(e => {
            console.error('Connection error', e.message)
        })

const db = mongoose.connection

module.exports = db