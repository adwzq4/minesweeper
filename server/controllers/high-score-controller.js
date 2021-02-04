const HighScore = require('../models/high-score-model')

exports.createScore = (req, res) => {
    const body = req.body
    console.log(body)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No score given',
        })
    }

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

exports.getScores = async (req, res) => {
    let allScores = {}
    await HighScore.find({scoreType: "rate"}, (err, scores) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        allScores["Rates"] = scores
    }).catch(err => console.log(err))

    await HighScore.find({scoreType: "time", difficulty: "Easy"}, (err, scores) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (scores.length) allScores["Easy"] = scores
        else allScores["Easy"] = []
    }).catch(err => console.log(err))

    await HighScore.find({scoreType: "time", difficulty: "Medium"}, (err, scores) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (scores.length) allScores["Medium"] = scores
        else allScores["Medium"] = []
    }).catch(err => console.log(err))

    await HighScore.find({scoreType: "time", difficulty: "Hard"}, (err, scores) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (scores.length) allScores["Hard"] = scores
        else allScores["Hard"] = []
    }).catch(err => console.log(err))


    return res.status(200).json({ success: true, data: allScores })
}

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
