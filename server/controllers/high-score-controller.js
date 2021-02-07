const HighScore = require('../models/high-score-model')

exports.createScore = (req, res) => {
    const body = req.body
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

exports.getStats = async (req, res) => {
    let stats = {}
    let statTypes = ["mines", "wins", "deaths"]
    let diffs = ["Easy", "Medium", "Hard"]

    for (let i = 0; i < statTypes.length; i++) {
        stats[statTypes[i]] = {}
        for (let j = 0; j < diffs.length; j++) {
            await HighScore.exists({scoreType: statTypes[i], difficulty: diffs[j]}, (err, result) => {
                if (!result) {
                    HighScore.create({
                        "scoreType": statTypes[i],
                        "difficulty": diffs[j],
                        "value": 0
                    }).then(r => {}).catch(err => console.log(err))
                }
            })

            await HighScore.find({scoreType: statTypes[i], difficulty: diffs[j]},  (err, stat) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }

                if (stat) {
                    stats[statTypes[i]][diffs[j]] = stat
                }
            }).catch(err => console.log(err))
        }
    }

    return res.status(200).json({ success: true, data: stats })
}

exports.updateStats = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "Can't update undefined",
        })
    }

    await HighScore.updateOne(
        {scoreType: "mines", difficulty: body.difficulty},
        { $inc: {value: parseInt(body.mines)} },
        {upsert: true},
        (err => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
        })).catch(err => console.log(err))

    await HighScore.updateOne(
        {scoreType: body.result, difficulty: body.difficulty},
        {$inc: {value: 1}},
        {upsert: true},
        (err => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
        })).catch(err => console.log(err))

    return res.status(200).json({ success: true})
}

exports.getScores = async (req, res) => {
    let allScores = {}
    let diffs = ["Easy", "Medium", "Hard"]

    for (let i = 0; i < diffs.length; i++) {
        await HighScore.find({scoreType: "time", difficulty: diffs[i]}, (err, scores) => {
            //console.log(scores)
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }

            allScores[diffs[i]] = scores
        }).catch(err => console.log(err))
    }

    await HighScore.find({scoreType: "rate"}, (err, scores) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        allScores["Rates"] = scores
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
    await HighScore.deleteMany({ $or: [{scoreType: "time"}, {scoreType: "rate"}]}, (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true })
    }).catch(err => console.log(err))
}
