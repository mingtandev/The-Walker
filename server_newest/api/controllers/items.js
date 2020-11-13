const mongoose = require('mongoose')

const Item = require('../models/item')
const User = require('../models/user')
const UserItem = require('../models/userItem')

const {saveHistory} = require('./../utils/history')
const {saveStatistic} = require('./../utils/statistic')

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
    user.cash = cash - salePrice

    const result_1 = await userItem[0].save()
    const result_2 = await user.save()

    if(result_1 && result_2) {

        await saveHistory(_id, 'items', 'personal', `Buy a item: ${name}-${type}-${price}-${salePrice}-${sale}-${saleExpiresTime}} | ${new Date()}`)
        await saveStatistic(0, 0, 1, 0, 0, salePrice)

        res.status(200).json({
            msg: 'success',
            userItem
        })
    } else {

        res.status(500).json({
            msg: 'Server error!',
            error
        })
    }

    // await userItem[0].save()
    // .then(async userItem => {
    //     await user.save()

    //     res.status(200).json({
    //         msg: 'success',
    //         userItem
    //     })
    // })
    // .catch(error => {
    //     res.status(500).json({
    //         msg: 'Server error!',
    //         error
    //     })
    // })
}

exports.create = async (req, res, next) => {
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
        item['saleExpiresTime'] = Date.now() + +saleExpiresTime || Date.now() + 259200000 // 3 days
    }

    await item.save()
    .then(async newItem => {

        await saveHistory(req.userData._id, 'items', 'manage', `Create a new item: ${newItem._id}-${name}-${type}-${price}-${newItem.sale}-${newItem.saleExpiresTime} | ${new Date()}`)

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

exports.update = async (req, res, next) => {
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

    await saveHistory(req.userData._id, 'items', 'manage', `Update a item: ${_id}-${Object.keys(item).join('-')} | ${new Date()}`)

    await Item.updateOne({_id}, {$set: item})
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

exports.delete = async (req, res, next) => {
    const {itemId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const item = await Item.findById(_id)

    if(!item) {

        return res.status(404).json({
            msg: 'Item not found!'
        })
    }

    const {name, type, price, sale, saleExpiresTime} = item

    await saveHistory(req.userData._id, 'items', 'manage', `Delete a item: ${_id}-${name}-${type}-${price}-${sale}-${saleExpiresTime} | ${new Date()}`)

    await Item.deleteOne({_id})
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