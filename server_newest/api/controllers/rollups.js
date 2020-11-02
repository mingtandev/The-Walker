const Rollup = require('../models/rollup')
const Item = require('../models/item')

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
    .then(newRoll => {
        res.status(201).json({
            msg: "success",
            roll: {
                _id: newRoll._id,
                day: newRoll.day,
                coin: newRoll.coin,
                item: newRoll.item,
                thumbnail: newRoll.thumbnail,
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

exports.update = (req, res, next) => {
    const {rollupDay} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const roll = {}

    for (const ops of req.body) {
        roll[ops.propName] = ops.value
    }

    Rollup.updateOne({day: rollupDay}, {$set: roll})
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

exports.delete = (req, res, next) => {
    const {rollupDay} = req.params

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    Rollup.deleteOne({day: rollupDay})
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