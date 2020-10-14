const express = require('express')

const RollupController = require('../controllers/rollups')
const checkAuth = require('../middleware/checkAuth')

const router = express.Router()

router.get('/', RollupController.getAll)
router.get('/:rollupDay', RollupController.getOne)
router.post('/', checkAuth, RollupController.create)
router.patch('/:rollupDay', checkAuth, RollupController.update)
router.delete('/:rollupDay', checkAuth,  RollupController.delete)

module.exports = router