const express = require('express')

const CodeController = require('./../controllers/giffcodes')
const checkAuth = require('./../middleware/checkAuth')

const router = express.Router()

router.get('/', checkAuth, CodeController.getAll)
router.post('/', checkAuth, CodeController.create)
router.get('/:codeId', checkAuth, CodeController.getOne)
router.patch('/:codeId', checkAuth, CodeController.update)
router.post('/:code', checkAuth, CodeController.useOne)
router.delete('/:code', checkAuth, CodeController.delete)

module.exports = router