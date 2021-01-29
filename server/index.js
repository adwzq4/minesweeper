const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')
const highScoreRouter = require('./routes/high-score-router')
const app = express()
const apiPort = 3000
// const corsOptions = {
//     origin: "http://localhost:8000"
// };

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(/*corsOptions*/))
app.use(bodyParser.json())
db.on('error', console.error.bind(console, 'MongoDB conn error:'))

app.get('/', ((req, res) => {
    res.send('Hello Worlds')
}))

app.use('/api', highScoreRouter)

app.listen(apiPort, () => console.log(`server running on port ${apiPort}`))