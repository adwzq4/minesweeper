const HighScore = require('../models/high-score-model')

exports.createScore = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No score given',
        })
    }
    // if (!score) {
    //     return res.status(400).json({success: false, error: err})
    // }

    HighScore.create(body).then(() => {
            return res.status(201).json({
                success: true,
                message: 'score created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'score not created!',
            })
        })
}
// updateRates = async (req, res) => {
//     const body = req.body
//     if (!body) {
//         return res.status(400).json({success: false, error: 'No score given',})
//     }
//     const query = { type: "rate" , difficulty: body.difficulty}
//     const cursor = HighScore.find( query)
//     if ((await cursor.count()) === 0) {await HighScore.insertOne(body)}
// }
exports.deleteScore = async (req, res) => {
    await HighScore.findOneAndDelete({ _id: req.params.id }, (err, score) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!score) {
            return res
                .status(404)
                .json({ success: false, error: `score not found` })
        }

        return res.status(200).json({ success: true, data: score })
    }).catch(err => console.log(err))
}

exports.deleteAllScores = async (req, res) => {
    await HighScore.deleteMany({}, (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true })
    }).catch(err => console.log(err))
}

exports.getScores = async (req, res) => {
    await HighScore.find({}, (err, scores) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!scores.length) {
            return res
                .status(404)
                .json({ success: false, error: `score not found` })
        }
        return res.status(200).json({ success: true, data: scores })
    }).catch(err => console.log(err))
}
