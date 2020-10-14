const express = require('express')

const GiffcodeController = require('./../controllers/giffcodes')
const checkAuth = require('./../middleware/checkAuth')

const router = express.Router()

router.get('/', checkAuth, GiffcodeController.getAll)
router.get('/:codeId', checkAuth, GiffcodeController.getOne)
router.post('/', checkAuth, GiffcodeController.create)
router.post('/:codeId/use', checkAuth, GiffcodeController.use)
router.patch('/:codeId', checkAuth, GiffcodeController.update)
router.delete('/:codeId', checkAuth, GiffcodeController.delete)

module.exports = router