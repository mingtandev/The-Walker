const {saveHistory, loadHistory} = require('../utils/history')
const {saveStatistic} = require('../utils/statistic')

const Code = require('../models/giffcode')
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

exports.create = async (req, res, next) => {
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

    await codeObj.save()
    .then(async newCode => {

        await saveHistory(req.userData._id, 'codes', 'manage', `Create a gift code: ${newCode._id}-${code}-${codeObj.type.toLowerCase()}-${items.split(' ').join('-')}-${codeObj.expiresTime} | ${new Date()}`)

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

        await saveHistory(userId, 'codes', 'personal', `Used code: ${code} | ${new Date()}`)
        await saveStatistic(0, 0, 0, 1, 0, 0)

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

exports.update = async (req, res, next) => {
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

    await saveHistory(req.userData._id, 'codes', 'manage', `Update a gift code: ${_id}-${Object.keys(code).join('-')} | ${new Date()}`)

    await Code.updateOne({_id}, {$set: code})
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

exports.delete = async (req, res, next) => {
    const {code: _code} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const objCode = await Code.find({code: _code})

    if(!objCode[0]) {

        return res.status(404).json({
            msg: 'Code not found!'
        })
    }

    const {_id, code, type, items, isUsed, expiresTime} = objCode[0]

    await saveHistory(req.userData._id, 'codes', 'manage', `Delete a gift code: ${_id}-${code}-${type.toLowerCase()}-${items.join('-')}-${isUsed}-${expiresTime} | ${new Date()}`)

    await Code.deleteOne({_id})
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