const {saveHistory, loadHistory} = require('../utils/history')
const {saveStatistic} = require('../utils/statistic')
const {saveUserItem} = require('./../utils/userItem')

const Code = require('../models/giffcode')

exports.getAll = (req, res, next) => {

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const page = parseInt(req.query.page) || 1
    const items_per_page = parseInt(req.query.limit) || 8

    if (page < 1) page = 1

    Code.find({})
    .select('_id code type items isUsed expiresTime')
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async codes => {
        const request = {}
        const len = await Code.find({}).count()

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
            }),
            request
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
    const {code, type, items} = req.body
    let {expiresTime} = req.body

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

    if (expiresTime) expiresTime = Date.now() + +expiresTime*24*60*60*1000

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

    let validCode = await Code.findOne({code})

    if(!validCode){
        return res.status(200).json({
            msg: 'Code does not exist!'
        })
    }

    const {type, items, isUsed, expiresTime} = validCode

    if (expiresTime < Date.now()) {
        return res.status(200).json({
            msg: 'The code has been expired!'
        })
    }

    let historyCodes = await loadHistory(userId, 'codes', 'personal')
    historyCodes = historyCodes.map(his => his.split(' ')[2])

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
        await saveUserItem(userId, items)
    }

    if (type === 'Vip') {
        validCode.isUsed = true
    }

    const result = await validCode.save()

    if(result) {
        await saveHistory(userId, 'codes', 'personal', `Used code: ${code} | ${new Date()}`)
        await saveStatistic(0, 0, 0, 1, 0, 0)

        res.status(200).json({
            msg: 'success'
        })
    }
    else {
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