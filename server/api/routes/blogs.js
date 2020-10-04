const express = require('express')

const BlogController = require('./../controllers/blogs')
const checkAuth = require('./../middleware/checkAuth')
const upload = require('./../config/upload')

const router = express.Router()

router.get('/', BlogController.getAll)
router.get('/:blogId', BlogController.getOne)
router.post('/', checkAuth, upload.single('thumbnail'), BlogController.create)
router.patch('/:blogId', checkAuth, BlogController.update)
router.delete('/:blogId', checkAuth, BlogController.delete)

module.exports = router