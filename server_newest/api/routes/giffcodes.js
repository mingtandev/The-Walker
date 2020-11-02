const express = require('express')

const CodeController = require('./../controllers/giffcodes')
const checkAuth = require('./../middleware/checkAuth')

const router = express.Router()

router.get('/', checkAuth, CodeController.getAll)
router.get('/:codeId', checkAuth, CodeController.getOne)
router.post('/', checkAuth, CodeController.create)
router.post('/:code', checkAuth, CodeController.useOne)
router.patch('/:codeId', checkAuth, CodeController.update)
router.delete('/:codeId', checkAuth, CodeController.delete)

module.exports = router