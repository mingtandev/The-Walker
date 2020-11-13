const Rollup = require('../models/rollup')
const Item = require('../models/item')
const UserItem = require('../models/userItem')

const {saveHistory, loadHistory} = require('./../utils/history')
const {saveStatistic} = require('./../utils/statistic')
const {saveUserItem} = require('./../utils/userItem')

exports.getAll = (req, res, next) => {

    Rollup.find({})
    .select('_id day thumbnail coin item')
    .then(rolls => {
        const response = {
            msg: 'success',
            length: rolls.length,
            rolls: rolls.map(roll => {
                return {
                    _id: roll._id,
                    day: roll.day,
                    coin: roll.coin,
                    thumbnail: roll.thumbnail,
                    item: roll.item,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/rolls/' + roll.day
                    }
                }
            })
        }

        // res.set('Content-Range', ``);
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

exports.use = async (req, res, next) => {
    const {rollupDay} = req.params
    const userId = req.userData._id

    if(rollupDay < 1 || rollupDay > 31) {
        return res.status(500).json({
            msg: 'Rollup day invalid!'
        })
    }

    if(rollupDay != new Date().getDate()) {
        return res.status(400).json({
            msg: `Today is not ${rollupDay}!`
        })
    }

    let his = await loadHistory(userId, 'rolls', 'personal')
    his = his.map(his => his.split(' ')[2])

    if (his.includes(rollupDay)) {
        return res.status(400).json({
            msg: 'You has been registered today!'
        })
    }

    const roll = await Rollup.findOne({ day: rollupDay })

    await saveHistory(userId, 'rolls', 'personal', `Roll up: ${rollupDay} | ${new Date()}`)
    await saveStatistic(0, 1, 0, 0, 0, 0)

    const result = await saveUserItem(userId, [roll.item])

    if (result) {
        res.status(200).json({
            msg: 'success',
            userItem: result
        })
    }
    else {
        msg: 'Server error!',
        error
    }
}

exports.getOne = (req, res, next) => {
    const {rollupDay} = req.params

    Rollup.find({day: rollupDay})
    .select('_id day thumbnail coin item')
    .then(rolls => {
        const roll = rolls[0]

        if(!roll){
            return res.status(404).json({
                msg: 'Roll not found!'
            })
        }
        res.status(200).json({
            msg: 'success',
            roll: {
                _id: roll._id,
                day: roll.day,
                thumbnail: roll.thumbnail,
                coin: roll.coin,
                item: roll.item,
                request: {
                    type: 'GET',
                    url: req.hostname + '/rolls'
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

exports.create = async (req, res, next) => {
    const {day, coin, item} = req.body

    if(!day){
        return res.status(400).json({
            msg: 'Day is required!'
        })
    }

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    let roll = {
        day
    }

    if(item){
        roll['item'] = item

        await Item.findById(item)
        .then(item => {
            if(!item) {
                return res.status(404).json({
                    msg: 'Item not found!'
                })
            }

            roll['thumbnail'] = item.thumbnail
        })
        .catch(error => {
            res.status(500).json({
                msg: 'Server error!',
                error
            })
        })
    }

    if(coin){
        roll['coin'] = coin
    }

    console.log(roll)

    const rollObj = new Rollup(roll)

    await rollObj.save()
    .then(async newRoll => {
        const {_id, day, coin, item, thumbnail} = newRoll

        await saveHistory(req.userData._id, 'rolls', 'manage', `Create a roll: ${_id}-${day}-${coin}-${item}} | ${new Date()}`)

        res.status(201).json({
            msg: "success",
            roll: {
                _id,
                day,
                coin,
                item,
                thumbnail,
                request: {
                    type: 'GET',
                    url: req.hostname + '/rolls/' + newRoll.day
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

exports.update = async (req, res, next) => {
    const {rollupDay} = req.params

    const objRoll = await Rollup.find({day: rollupDay})

    if(!objRoll[0]) {
        return res.status(404).json({
            msg: 'Roll day not found!'
        })
    }

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const roll = {}

    for (const ops of req.body) {
        roll[ops.propName] = ops.value
    }

    await saveHistory(req.userData._id, 'rolls', 'manage', `Update a roll: ${objRoll[0]._id}-${rollupDay}-${Object.keys(roll).join('-')} | ${new Date()}`)

    await Rollup.updateOne({day: rollupDay}, {$set: roll})
    .then(result => {
        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: req.hostname + '/rolls/' + rollupDay
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
    const {rollupDay} = req.params

    const objRoll = await Rollup.find({day: rollupDay})

    if(!objRoll[0]) {
        return res.status(404).json({
            msg: 'Roll day not found!'
        })
    }

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    await saveHistory(req.userData._id, 'rolls', 'manage', `Delete a roll: ${objRoll[0]._id}-${rollupDay}-${objRoll[0].coin}-${objRoll[0].item} | ${new Date()}`)

    await Rollup.deleteOne({day: rollupDay})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'POST',
                url: req.hostname + '/rolls',
                body: {
                    day: 'Number',
                    coin: 'Number',
                    item: 'ObjectId'
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