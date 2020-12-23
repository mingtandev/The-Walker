// const UserItem = require('../models/userItem')

// exports.getAll = (req, res, next) => {

//     UserItem.find({})
//     .select('_id userId coin items')
//     .then(userItems => {
//         const response = {
//             msg: 'success',
//             length: userItems.length,
//             userItems: userItems.map(userItem => {
//                 return {
//                     _id: userItem._id,
//                     userId: userItem.userId,
//                     coin: userItem.coin,
//                     items: userItem.items,
//                     request: {
//                         type: 'GET',
//                         url: req.hostname + '/user-items/' + userItem.userId
//                     }
//                 }
//             })
//         }

//         // res.set("x-total-count", userItems.length);
//         res.status(200).json(response)
//     })
//     .catch(error => {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Server error!',
//             error
//         })
//     })
// }

// exports.getOne = (req, res, next) => {
//     const {userId} = req.params

//     UserItem.findOne({userId})
//     .select('_id userId coin items')
//     .then(userItem => {

//         if(!userItem){
//             return res.status(202).json({
//                 msg: 'ValidatorError',
//                 errors: {
//                     user: `User not found!`
//                 }
//             })
//         }

//         res.status(200).json({
//             msg: 'success',
//             userItem: {
//                 _id: userItem._id,
//                 userId: userItem.userId,
//                 coin: userItem.coin,
//                 items: userItem.items,
//                 request: {
//                     type: 'GET',
//                     url: req.hostname + '/user-items'
//                 }
//             }
//         })
//     })
//     .catch(error => {
//         console.log(error)
//         res.status(500).json({
//             msg: "Server error!",
//             error
//         })
//     })
// }

// exports.update = async (req, res, next) => { // Only for game client to update coins
//     const {userId} = req.params
//     const {coin} = req.body

//     if (!coin) coin = 0

//     // await UserItem.updateOne({userId}, {
//     //     $inc: {
//     //         coin: +coin
//     //     },
//     //     // $addToSet: {
//     //     //     "items.guns": items.guns,
//     //     //     "items.hats": items.hats,
//     //     //     "items.outfits": items.outfits,
//     //     // }
//     // })

//     try {
//         const userItem = await UserItem.findOne({userId})
//         userItem.coin += parseInt(coin)

//         const result = await userItem.save()

//         res.status(200).json({
//             msg: "success",
//             userItem: result,
//             request: {
//                 type: 'GET',
//                 url: req.hostname + '/user-items/' + userId
//             }
//         })
//     }
//     catch (error) {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Server error!',
//             error
//         })
//     }
// }

// exports.delete = (req, res, next) => {
//     const {userId} = req.params

//     if (req.userData.roles != 'admin'){
//         return res.status(403).json({
//             msg: 'ValidatorError',
//             errors: {
//                 user: `You don't have the permission!`
//             }
//         })
//     }

//     UserItem.deleteOne({userId})
//     .then(result => {
//         res.status(200).json({
//             msg: 'success',
//             request: {
//                 type: 'POST',
//                 url: req.hostname + '/user-items',
//                 body: {
//                     userId: 'ObjectId'
//                 }
//             }
//         })
//     })
//     .catch(error => {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Server error!',
//             error
//         })
//     })
// }

// // Ignore
