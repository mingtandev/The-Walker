const Code = require('../models/giffcode')
const User = require('../models/user')
const Item = require('../models/item')


exports.getAll = (req, res, next) => {

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    Code.find({})
    .select('_id code type items isUsed expiresTime')
    .then(codes => {
        const response = {
            msg: 'success',
            length: codes.length,
            giffcodes: codes.map(code => {
                return {
                    _id: code._id,
                    code: code.code,
                    type: code.type,
                    items: code.items,
                    isUsed: code.isUsed,
                    expiresTime: code.expiresTime,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/giffcodes/' + code._id
                    }
                }
            })
        }

        res.set("x-total-count", codes.length);
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
    const {codeId} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    Code.findById(codeId)
    .select('_id code type items isUsed expiresTime')
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
                code: item.code,
                type: item.type,
                items: item.items,
                isUsed: item.isUsed,
                expiresTime: item.expiresTime,
                request: {
                    type: 'GET',
                    url: req.hostname + '/giffcodes'
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
    const {code, type, items, expiresTime} = req.body

    if(!code || !items){
        return res.status(400).json({
            msg: 'Bad request body!'
        })
    }

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const codeObj = new Code({
        code,
        type,
        items: items.split(','),
        expiresTime
    })

    codeObj.save()
    .then(newCode => {
        res.status(201).json({
            msg: "success",
            code: {
                _id: newCode._id,
                code: newCode.code,
                type: newCode.type,
                items: newCode.items,
                expiresTime: Date.now() +  +newCode.expiresTime,
                request: {
                    type: 'GET',
                    url: req.hostname + '/giffcodes/' + newCode._id
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

// Updating
exports.use = (req, res, next) => {
    const {codeId} = req.params
    const {_id} = req.body

    let userItems = {
        userId: '',
        items: []
    }

    User.findById({_id})
    .then(user => {
        if(!user){
            return res.status(400).json({
                msg: 'User not found!'
            })
        }

        userItems.userId = user._id
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })

    Code.findById({_id: codeId})
    .then(code => {
        if(!code){
            return res.status(400).json({
                msg: 'Code not found!'
            })
        }

        if(code.isUsed){
            return res.status(400).json({
                msg: 'The code has been used!'
            })
        }

        // map
        for (const _id of code.items){
            Item.findById(_id)
            .then(item => {
                // can be change
                if(item){
                    userItems.items.push(item.name)

                    // call model user-items .push item
                }

            })
            .catch(error => {
                return res.status(500).json({
                    msg: 'Server error!',
                    error
                })
            })
        }

        code.isUsed = true

        code.save()

        res.status(200).json({
            msg: 'success'
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.update = (req, res, next) => {
    const {codeId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const code = {}

    for (const ops of req.body) {
        code[ops.propName] = ops.value
    }

    Code.updateOne({_id}, {$set: code})
    .then(result => {
        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: req.hostname + '/giffcodes/' + _id
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
    const {codeId: _id} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    Code.deleteOne({_id})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'POST',
                url: req.hostname + '/giffcodes',
                body: {
                    code: 'String',
                    type: 'String',
                    items: 'Array of Item id',
                    expiresTime: 'Number (millisecond)'
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