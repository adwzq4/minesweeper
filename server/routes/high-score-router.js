const express = require('express')

const HighScoreController = require('../controllers/high-score-controller')

const router = express.Router()

router.post('/score', HighScoreController.createScore)
router.delete('/score/:id', HighScoreController.deleteScore)
router.delete('/scores', HighScoreController.deleteAllScores)
router.get('/scores', HighScoreController.getScores)
router.get('/stats', HighScoreController.getStats)
router.put('/stats', HighScoreController.updateStats)

module.exports = router
