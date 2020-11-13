const express = require('express')

const UserItemController = require('./../controllers/userItems')
const checkAuth = require('./../middleware/checkAuth')

const router = express.Router()

router.get('/', UserItemController.getAll)
router.get('/:userId', UserItemController.getOne)
router.patch('/:userId', UserItemController.update)
router.delete('/:userId', UserItemController.delete)
// router.post('/', UserItemController.create)

module.exports = router