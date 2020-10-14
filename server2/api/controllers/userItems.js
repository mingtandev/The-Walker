const UserItem = require('../models/userItem')

exports.getAll = (req, res, next) => {

    UserItem.find({})
    .select('_id userId coin items')
    .then(userItems => {
        const response = {
            msg: 'success',
            length: userItems.length,
            userItems: userItems.map(userItem => {
                return {
                    _id: userItem._id,
                    userId: userItem.userId,
                    coin: userItem.coin,
                    items: userItem.items,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/user-items/' + userItem.userId
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
    const {userId} = req.params

    UserItem.find({userId})
    .select('_id userId coin items')
    .then(userItems => {

        const userItem = userItems[0]

        if(!userItem){
            return res.status(404).json({
                msg: 'User not found!'
            })
        }

        res.status(200).json({
            msg: 'success',
            userItem: {
                _id: userItem._id,
                userId: userItem.userId,
                coin: userItem.coin,
                items: userItem.items,
                request: {
                    type: 'GET',
                    url: req.hostname + '/user-items'
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

    const {userId} = req.body

    // if (req.userData.roles != 'admin'){
    //     return res.status(403).json({
    //         msg: `You don't have the permission!`
    //     })
    // }

    const userItem = new UserItem({
        userId
    })

    userItem.save()
    .then(userItem => {
        res.status(201).json({
            msg: "success",
            userItem: {
                _id: userItem._id,
                userId: userItem.userId,
                coin: userItem.coin,
                items: userItem.items,
                request: {
                    type: 'GET',
                    url: req.hostname + '/user-items/' + userItem.userId
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
    const {userId} = req.params

    // if (req.userData.roles != 'admin'){
    //     return res.status(403).json({
    //         msg: `You don't have the permission!`
    //     })
    // }

    const {coin, items} = req.body

    if(!coin){
        return res.status(401).json({
            msg: 'Coin is required!'
        })
    }

    UserItem.updateOne({userId}, {
        $inc: {
            coin: +coin
        },
        $addToSet: {
            "items.guns": items.guns,
            "items.hats": items.hats,
            "items.outfits": items.outfits,
        }
    })
    .then(result => {
        res.status(200).json({
            msg: "success",
            request: {
                type: 'GET',
                url: req.hostname + '/user-items/' + userId
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
    const {userId} = req.params

    // if (req.userData.roles != 'admin'){
    //     return res.status(403).json({
    //         msg: `You don't have the permission!`
    //     })
    // }

    UserItem.deleteOne({userId})
    .then(result => {
        res.status(200).json({
            msg: 'success',
            request: {
                type: 'POST',
                url: req.hostname + '/user-items',
                body: {
                    userId: 'ObjectId'
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