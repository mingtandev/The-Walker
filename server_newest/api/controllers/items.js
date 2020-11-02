const mongoose = require('mongoose')

const Item = require('../models/item')
const User = require('../models/user')
const UserItem = require('../models/userItem')

exports.getAll = (req, res, next) => {

    Item.find({})
    .select('_id name slugName thumbnail type price sale saleExpiresTime')
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
                    sale: item.sale,
                    saleExpiresTime: item.saleExpiresTime,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/items/' + item._id
                    }
                }
            })
        }

        res.set('Content-Range', `items 0-4/${items.length}`)
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
    .select('_id name slugName thumbnail type price sale saleExpiresTime')
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
                sale: item.sale,
                saleExpiresTime: item.saleExpiresTime,
                request: {
                    type: 'GET',
                    url: req.hostname + '/items'
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

exports.buyOne = async (req, res, next) => {
    const {itemId} = req.params

    const {_id} = req.userData

    const user = await User.findById(_id)
    const userItem = await UserItem.find({userId: _id})
    const item = await Item.findById(itemId)

    {
        if(!user) {
            return res.status(404).json({
                msg: 'User not found!',
            })
        }
        if(!userItem[0]) {
            return res.status(404).json({
                msg: 'UserItem not found!',
            })
        }
        if(!item) {
            return res.status(404).json({
                msg: 'Item not found!',
            })
        }
    }


    const {cash} = user
    const {name, type, price, sale, saleExpiresTime} = item

    let salePrice = price

    if(saleExpiresTime >= Date.now()){
        salePrice = (price - sale/100*price).toFixed(2)

        console.log(`Sale: ${sale}%`)
        console.log(`Sale price: ${salePrice}`)
    }

    if(cash < salePrice) {
        return res.status(404).json({
            msg: 'Cash not enough!'
        })
    }

    userItem[0].items[`${type}s`].push(name)
    user.cash = cash - price

    await userItem[0].save()
    .then(async userItem => {
        await user.save()

        res.status(200).json({
            msg: 'success',
            userItem
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.create = (req, res, next) => {
    const {name, type, price, sale, saleExpiresTime} = req.body

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
        thumbnail: req.hostname + '/' + req.file.path.replace(/\\/g,'/').replace('..', '')
    })

    if(+sale > 0){
        item['sale'] = +sale,
        item['saleExpiresTime'] = Date.now() + +saleExpiresTime ||  Date.now() + 259200000 // 3 days
    }

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
                sale: item.sale,
                saleExpiresTime: item.saleExpiresTime,
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

        if(ops.propName === 'saleExpiresTime'){
            item[ops.propName] = Date.now() + +ops.value
        }
    }

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