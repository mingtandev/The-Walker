const Item = require('../models/item')
const User = require('../models/user')

const {saveHistory} = require('./../utils/history')
const {saveStatistic} = require('./../utils/statistic')
const {saveUserItem} = require('./../utils/userItem')

exports.getAll = (req, res, next) => {
    const page = parseInt(req.query.page) || 1
    const items_per_page = parseInt(req.query.limit) || 100

    if (page < 1) page = 1

    Item.find({})
    .select('_id name slugName detail thumbnail type price sale saleExpiresTime')
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async items => {
        const request = {}
        const len = await Item.find({}).countDocuments()

        request.currentPage = page
        request.totalPages = Math.ceil(len / items_per_page)

        if (page > 1) {
            request.previous = {
                page: page - 1,
                limit: items_per_page
            }
        }

        if (page * items_per_page < len) {
            request.next = {
                page: page + 1,
                limit: items_per_page
            }
        }

        const response = {
            msg: 'success',
            length: items.length,
            products: items.map(item => {
                return {
                    _id: item._id,
                    name: item.name,
                    slugName: item.slugName,
                    detail: item.detail,
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
            }),
            request
        }

        // res.set('Content-Range', `items 0-4/${items.length}`)
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
    .select('_id name slugName detail thumbnail type price sale saleExpiresTime')
    .then(item => {
        if(!item){
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: `Item not found!`
                }
            })
        }

        res.status(200).json({
            msg: "success",
            item: {
                _id: item._id,
                name: item.name,
                slugName: item.slugName,
                detail: item.detail,
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

    try {
        const [user, item] = await Promise.all([
            User.findById(_id),
            Item.findById(itemId)
        ])

        const {cash} = user
        const {name, type, price, sale, saleExpiresTime} = item

        let salePrice = price

        if(saleExpiresTime >= Date.now()){
            salePrice = (price - sale/100*price).toFixed(2)

            console.log(`Sale: ${sale}%`)
            console.log(`Sale price: ${salePrice}`)
        }

        if(cash < salePrice) {
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: `Cash not enough!`
                }
            })
        }

        user.cash = cash - salePrice

        await Promise.all([
            saveHistory(_id, 'items', 'personal', `Buy a item: ${name}-${type}-${price}-${salePrice}-${sale}-${saleExpiresTime}} | ${new Date()}`),
            saveStatistic(0, 0, 1, 0, 0, salePrice),
            saveUserItem(_id, [itemId], 0),
            User.updateOne({_id: user._id}, {$set: user})
        ])

        res.status(200).json({
            msg: 'success',
            user: {
                _id: user._id,
                roles: user.roles,
                name: user.name,
                slugName: user.slugName,
                email: user.email,
                cash: user.cash
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    }
}

exports.create = async (req, res, next) => {
    const {name, type, price, detail, sale, saleExpiresTime} = req.body

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: 'ValidatorError',
            errors: {
                user: `You don't have the permission!`
            }
        })
    }

    try {
        const thumbnail = req.file ? req.hostname + '/' + req.file.path.replace(/\\/g,'/').replace('..', '') : ''

        const item = new Item({
            name,
            type,
            price,
            detail,
            thumbnail
        })

        if(+sale > 0){
            item['sale'] = +sale,
            +saleExpiresTime > 0 ? item['saleExpiresTime'] = Date.now() + +saleExpiresTime*24*60*60*1000 : item['saleExpiresTime'] = Date.now() + 259200000
        }

        await Promise.all([
            item.save(),
            saveHistory(req.userData._id, 'items', 'manage', `Create a new item: ${item._id}-${name}-${type}-${price}-${item.sale}-${item.saleExpiresTime} | ${new Date()}`)

        ])

        res.status(201).json({
            msg: "success",
            item: {
                _id: item._id,
                name: item.name,
                slugName: item.slugName,
                detail: item.detail,
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
    catch (error) {
        let respond = {}
        error.errors && Object.keys(error.errors).forEach(err => respond[err] = error.errors[err].message)
        res.status(202).json({
            msg: 'ValidatorError',
            errors: respond
        })
    }
}

exports.update = async (req, res, next) => {
    const {itemId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: 'ValidatorError',
            errors: {
                user: `You don't have the permission!`
            }
        })
    }

    const item = {}

    for (const ops of req.body) {
        item[ops.propName] = ops.value

        if(ops.propName === 'saleExpiresTime'){
            item[ops.propName] = Date.now() + +ops.value
        }
    }

    try {
        if(+item.sale > 0){
            +item.saleExpiresTime > 0 ? item['saleExpiresTime'] = Date.now() + +item.saleExpiresTime*24*60*60*1000 : item['saleExpiresTime'] = Date.now() + 259200000
        }

        await Promise.all([
            saveHistory(req.userData._id, 'items', 'manage', `Update a item: ${_id}-${Object.keys(item).join('-')} | ${new Date()}`),
            Item.updateOne({_id}, {$set: item}, {runValidators: true})
        ])

        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: req.hostname + '/items/' + _id
            }
        })
    }
    catch (error) {
        console.log(error)
        let respond = {}
        error.errors && Object.keys(error.errors).forEach(err => respond[err] = error.errors[err].message)
        res.status(202).json({
            msg: 'ValidatorError',
            errors: respond
        })
    }
}

exports.delete = async (req, res, next) => {
    const {itemId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: 'ValidatorError',
            errors: {
                user: `You don't have the permission!`
            }
        })
    }

    try {
        const item = await Item.findById(_id)
        const {name, type, price, sale, saleExpiresTime} = item

        await Promise.all([
            saveHistory(req.userData._id, 'items', 'manage', `Delete a item: ${_id}-${name}-${type}-${price}-${sale}-${saleExpiresTime} | ${new Date()}`),
            Item.deleteOne({_id})
        ])

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
                    thumbnail: 'File: .jpeg, .jpg, .png'
                }
            }
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    }
}