const express = require('express')

const HistoryController = require('./../controllers/histories')
const checkAuth = require('./../middleware/checkAuth')

const router = express.Router()

router.get('/', checkAuth, HistoryController.getAll)
router.get('/:userId', checkAuth, HistoryController.getOne)

module.exports = router