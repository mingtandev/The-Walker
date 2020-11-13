const express = require('express')

const StatisticController = require('../controllers/statistics')
const checkAuth = require('../middleware/checkAuth')

const router = express.Router()

router.get('/', StatisticController.get)

module.exports = router