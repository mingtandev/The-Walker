const Item = require('../models/item');
const User = require('../models/user');

const { saveStatistic } = require('./../utils/statistic');

exports.getAll = (req, res, next) => {
	const page = parseInt(req.query.page) || 1;
	const items_per_page = parseInt(req.query.limit) || 100;

	if (page < 1) page = 1;

	Item.find({})
		.skip((page - 1) * items_per_page)
		.limit(items_per_page)
		.then(async (items) => {
			const request = {};
			const len = await Item.find({}).countDocuments();

			request.currentPage = page;
			request.totalPages = Math.ceil(len / items_per_page);

			if (page > 1) {
				request.previous = {
					page: page - 1,
					limit: items_per_page,
				};
			}

			if (page * items_per_page < len) {
				request.next = {
					page: page + 1,
					limit: items_per_page,
				};
			}

			const response = {
				msg: 'success',
				length: items.length,
				products: items.map((item) => {
					return {
						...item['_doc'],
						request: {
							type: 'GET',
							url: req.hostname + '/items/' + item._id,
						},
					};
				}),
				request,
			};

			res.status(200).json(response);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				msg: 'Server error!',
				error,
			});
		});
};

exports.getOne = (req, res, next) => {
	const { itemId } = req.params;

	Item.findById(itemId)
		.then((item) => {
			if (!item) {
				return res.status(202).json({
					msg: 'ValidatorError',
					errors: {
						user: `Item not found!`,
					},
				});
			}

			res.status(200).json({
				msg: 'success',
				item: {
					...item['_doc'],
					request: {
						type: 'GET',
						url: req.hostname + '/items',
					},
				},
			});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				msg: 'Server error!',
				error,
			});
		});
};

exports.buyOne = async (req, res, next) => {
	const { itemId } = req.params;
	const { _id } = req.userData;

	try {
		const [user, item] = await Promise.all([
			User.findById(_id),
			Item.findById(itemId),
		]);

		// Destructuring
		const { cash } = user;
		const {
			name,
			type,
			price,
			sale,
			thumbnail,
			saleExpiresTime,
			details,
			description,
		} = item;

		let salePrice = price;

		// Check sale
		if (saleExpiresTime >= Date.now()) {
			salePrice = (price - (sale / 100) * price).toFixed(2);
		}

		if (cash < salePrice) {
			return res.status(202).json({
				msg: 'ValidatorError',
				errors: {
					user: `Cash not enough!`,
				},
			});
		}

		// Update cash
		user.cash = +cash - +salePrice;

		// Add to user items
		const record = {
			id: item._id,
			name,
			details,
			thumbnail,
			description,
			boughtAt: new Date(),
		};

		const history = {
			type: 'buy',
			collection: 'item',
			task: `Buy a new item: ${item.name}`,
			date: new Date(),
			others: {
				id: item._id,
			},
		};

		user.history.personal.push(history);
		user.items[`${type}s`].push(record);

		await Promise.all([
			saveStatistic(0, 0, 1, 0, 0, salePrice),
			User.updateOne({ _id: user._id }, { $set: user }),
		]);

		res.status(200).json({
			msg: 'success',
			user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Server error!',
			error,
		});
	}
};

exports.create = async (req, res, next) => {
	const {
		name,
		type,
		price,
		description,
		details,
		sale,
		saleExpiresTime,
	} = req.body;

	if (req.userData.roles != 'admin') {
		return res.status(403).json({
			msg: 'ValidatorError',
			errors: {
				user: `You don't have the permission!`,
			},
		});
	}

	try {
		const thumbnail = req.file
			? req.hostname + '/' + req.file.path.replace(/\\/g, '/').replace('..', '')
			: '';

		// if(req.file) {
		//   const ret = await cloudinary.uploadSingleAvatar(req.file.path);
		//   if (ret) {
		//     await cloudinary.destroySingle(user.cloudinary_id);
		//     user.avatar = ret.url;
		//     user.cloudinary_id = ret.id;
		//   }

		//   console.log(ret);
		// }

		const item = new Item({
			name,
			type,
			price,
			description,
			details,
			thumbnail,
		});

		// Check sale
		if (+sale > 0) {
			(item['sale'] = +sale),
				+saleExpiresTime > 0
					? (item['saleExpiresTime'] =
							Date.now() + +saleExpiresTime * 24 * 60 * 60 * 1000)
					: (item['saleExpiresTime'] = Date.now() + 259200000);
		}

		const history = {
			type: 'create',
			collection: 'item',
			task: `Create a new item: ${item.name}`,
			date: new Date(),
			others: {
				id: item._id,
			},
		};

		await Promise.all([
			item.save(),
			User.updateOne(
				{ _id: req.userData._id },
				{
					$push: {
						'history.manage': history,
					},
				}
			),
		]);

		res.status(201).json({
			msg: 'success',
			item: {
				...item['_doc'],
				request: {
					type: 'GET',
					url: req.hostname + '/items/' + item._id,
				},
			},
		});
	} catch (error) {
		let respond = {};
		error.errors &&
			Object.keys(error.errors).forEach(
				(err) => (respond[err] = error.errors[err].message)
			);
		res.status(202).json({
			msg: 'ValidatorError',
			errors: respond,
		});
	}
};

exports.update = async (req, res, next) => {
	const { itemId: _id } = req.params;

	if (req.userData.roles != 'admin') {
		return res.status(403).json({
			msg: 'ValidatorError',
			errors: {
				user: `You don't have the permission!`,
			},
		});
	}

	try {
		const item = await Item.findById(_id);
		const oldName = item.name;

		for (const ops of req.body) {
			item[ops.propName] = ops.value;

			if (ops.propName === 'saleExpiresTime') {
				item[ops.propName] = Date.now() + +ops.value;
			}
		}

		// Check sale
		if (+req.body.sale > 0) {
			+item.saleExpiresTime > 0
				? (item['saleExpiresTime'] =
						Date.now() + +item.saleExpiresTime * 24 * 60 * 60 * 1000)
				: (item['saleExpiresTime'] = Date.now() + 259200000);
		}

		const history = {
			type: 'update',
			collection: 'item',
			task: `Update a item: ${oldName}`,
			date: new Date(),
			others: {
				id: item._id,
				fields: req.body.map((ele) => `${ele.propName}: ${ele.value}`),
			},
		};

		await Promise.all([
			Item.updateOne({ _id: item._id }, { $set: item }),
			User.updateOne(
				{ _id: req.userData._id },
				{
					$push: {
						'history.manage': history,
					},
				}
			),
		]);

		res.status(200).json({
			msg: 'success',
			item,
			request: {
				type: 'GET',
				url: req.hostname + '/items/' + _id,
			},
		});
	} catch (error) {
		console.log(error);
		let respond = {};
		error.errors &&
			Object.keys(error.errors).forEach(
				(err) => (respond[err] = error.errors[err].message)
			);
		res.status(202).json({
			msg: 'ValidatorError',
			errors: respond,
		});
	}
};

exports.delete = async (req, res, next) => {
	const { itemId: _id } = req.params;

	if (req.userData.roles != 'admin') {
		return res.status(403).json({
			msg: 'ValidatorError',
			errors: {
				user: `You don't have the permission!`,
			},
		});
	}

	try {
		const item = await Item.findById(_id);

		const history = {
			type: 'delete',
			collection: 'item',
			task: `Delete a item: ${item.name}`,
			date: new Date(),
			others: {
				id: item._id,
			},
		};

		await Promise.all([
			Item.deleteOne({ _id: item._id }),
			User.updateOne(
				{ _id: req.userData._id },
				{
					$push: {
						'history.manage': history,
					},
				}
			),
		]);

		res.status(200).json({
			msg: 'success',
			request: {
				type: 'POST',
				url: req.hostname + '/items',
				body: {
					name: 'String',
					type: 'String',
					price: 'Number',
					detail: 'String',
					thumbnail: 'File: .jpeg, .jpg, .png',
				},
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Server error!',
			error,
		});
	}
};
