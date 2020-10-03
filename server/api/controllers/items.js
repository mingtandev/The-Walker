

const Item = require('../models/item')

exports.getAll = (req, res, next) => {

    Item.find({})
    .select('_id name slugName thumbnail type price')
    .then(items => {
        const response = {
            msg: 'success',
            length: items.length,
            products: items.map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    slugName: item.slugName,
                    thumbnail: item.thumbnail,
                    type: item.type,
                    price: item.price,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/' + item._id
                    }
                }
            })
        }

        res.status(200).json(response)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.getOne = (req, res, next) => {
    const {itemId} = req.params

    Item.findById(itemId)
    .select('_id name slugName thumbnail type price')
    .then(item => {

        if(!item){
            return res.status(404).json({
                msg: 'Item not found!'
            })
        }

        res.status(200).json({
            msg: "success",
            item: {
                _id: item._id,
                name: item.name,
                slugName: item.slugName,
                thumbnail: item.thumbnail,
                type: item.type,
                price: item.price,
                request: {
                    type: 'GET',
                    url: req.hostname
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
}

exports.create = (req, res, next) => {
    const {name, type, price} = req.body

    if(!name || !type || !price){
        return res.status(400).json({
            msg: 'Name, type, price are required!'
        })
    }

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const item = new Item({
        name,
        type,
        price,
        thumbnail: req.hostname + req.file.path.replace(/\\/g,'/').replace('..', '')
    })

    item.save()
    .then(newItem => {
        res.status(201).json({
            msg: "success",
            item: {
                _id: newItem._id,
                name: newItem.name,
                slugName: newItem.slugName,
                thumbnail: newItem.thumbnail,
                type: newItem.type,
                price: newItem.price,
                request: {
                    type: 'GET',
                    url: req.hostname + '/items/' + newItem._id
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.update = (req, res, next) => {
    const {itemId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const item = {}

    for (const ops of req.body) {
        item[ops.propName] = ops.value
    }

    console.log(item)

    Item.updateOne({_id}, {$set: item})
    .then(result => {
        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: req.hostname + '/items/' + _id
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.delete = (req, res, next) => {
    const {productID: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    Item.deleteOne({_id})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'POST',
                url: req.hostname + '/items',
                body: {
                    name: 'String',
                    type: 'String',
                    price: 'Number',
                    thumbnail: 'File: .jpeg, .jpg, .png'
                }
            }
        })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}