const {saveHistory, loadHistory} = require('../utils/history')

const Code = require('../models/giffcode')
const User = require('../models/user')
const Item = require('../models/item')
const UserItem = require('../models/userItem')


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
        items: items.split(' '),
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
                isUsed: newCode.isUsed,
                expiresTime: Date.now() +  +newCode.expiresTime,
                request: {
                    type: 'GET',
                    url: req.hostname + '/giffcodes/' + newCode._id
                }
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}

exports.useOne = async (req, res, next) => {
    const {code} = req.params
    const {_id: userId} = req.userData

    let validCode = await Code.find({code})
    validCode = validCode[0]

    if(!validCode){

        return res.status(200).json({
            msg: 'Code does not exist!'
        })
    }

    let userItem = await UserItem.find({userId})
    userItem = userItem[0]

    if(!userItem){

        return res.status(200).json({
            msg: 'UserItem does not exist!'
        })
    }

    const {type, items, isUsed, expiresTime} = validCode
    const historyCodes = await loadHistory(userId, 'codes', 'personal')

    if (expiresTime < Date.now()) {

        return res.status(200).json({
            msg: 'The code has been expired!'
        })
    }

    if(type === 'Normal' && historyCodes.includes(code)) {

        return res.status(200).json({
            msg: 'You has been used this code!'
        })
    }

    if(isUsed) {

        return res.status(200).json({
            msg: 'The code has been used!'
        })
    }
    else {

        for(let i = 0; i < items.length; i++) {
            const result  = await Item.findById(items[i])
            await userItem.items[`${result.type}s`].push(result.name)
        }
    }

    if (type === 'Vip') {

        validCode.isUsed = true
    }

    console.log(userItem.items)

    const result_1 = await userItem.save()
    const result_2 = await validCode.save()

    if(result_1 && result_2) {

        saveHistory(userId, 'codes', 'personal', `${code} ${new Date()}`)

        res.status(200).json({
            msg: 'success'
        })
    } else {

        res.status(500).json({
            msg: 'Server error!',
            error
        })
    }
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
        res.status(500).json({
            msg: 'Server error!',
            error
        })
    })
}