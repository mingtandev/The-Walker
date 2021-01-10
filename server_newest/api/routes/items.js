const express = require('express');

const ItemsController = require('./../controllers/items');
const checkAuth = require('./../middleware/checkAuth');
const upload = require('./../config/upload');

const router = express.Router();

router.get('/', ItemsController.getAll);
router.get('/:itemId', ItemsController.getOne);
router.post('/:itemId', checkAuth, ItemsController.buyOne);
router.post('/', checkAuth, upload.single('thumbnail'), ItemsController.create);
router.patch(
	'/:itemId',
	checkAuth,
	upload.single('thumbnail'),
	ItemsController.update
);
router.delete('/:itemId', checkAuth, ItemsController.delete);

module.exports = router;
