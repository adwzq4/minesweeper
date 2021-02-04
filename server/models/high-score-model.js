const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HighScore = new Schema(
    {
        scoreType: { type: String, required: true },
        difficulty: { type: String, required: true },
        value: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('high-scores', HighScore)