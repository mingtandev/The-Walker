const History = require('../models/history')

exports.getAll = (req, res, next) => {

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: `You don't have the permission!`
        })
    }

    const page = parseInt(req.query.page) || 1
    const items_per_page = parseInt(req.query.limit) || 8

    if (page < 1) page = 1

    History.find({})
    .select('userId actions')
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async histories => {
        const request = {}
        const len = await History.find({}).count()

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
            length: histories.length,
            histories: histories.map(history => {
                return {
                    _id: history._id,
                    userId: history.userId,
                    actions: history.actions,
                    request: {
                        type: 'GET',
                        url: req.hostname + '/histories/' + history.userId
                    }
                }
            }),
            request
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

    History.find({userId})
    .select('_id userId actions')
    .then(history => {

        if(!history[0]){
            return res.status(404).json({
                msg: 'History not found!'
            })
        }

        history = history[0]

        res.status(200).json({
            msg: "success",
            history: {
                _id: history._id,
                userId: history.userId,
                actions: history.actions,
                request: {
                    type: 'GET',
                    url: req.hostname + '/histories'
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

// exports.create = (req, res, next) => {
//     const {userId} = req.body

//     if(!userId){
//         return res.status(400).json({
//             msg: 'Bad request body!'
//         })
//     }

//     const history = new History({
//         userId,
//         actions: {
//             accInfos: {
//                 personal: [],
//                 manage: []
//             },
//             items:  {
//                 personal: [],
//                 manage: []
//             },
//             rolls:  {
//                 personal: [],
//                 manage: []
//             },
//             codes:  {
//                 personal: [],
//                 manage: []
//             },
//             blogs:  {
//                 personal: [],
//                 manage: []
//             }
//         }
//     })

//     history.save()
//     .then(his => {
//         res.status(201).json({
//             msg: "success",
//             history: {
//                 _id: his._id,
//                 userId: his.userId,
//                 actions: his.actions,
//                 request: {
//                     type: 'GET',
//                     url: req.hostname + '/histories/' + his.userId
//                 }
//             }
//         })
//     })
//     .catch(error => {
//         res.status(500).json({
//             msg: 'Server error!',
//             error
//         })
//     })
// }

// // Updating
// exports.use = (req, res, next) => {
//     const {codeId} = req.params
//     const {_id} = req.body

//     let userItems = {
//         userId: '',
//         items: []
//     }

//     User.findById({_id})
//     .then(user => {
//         if(!user){
//             return res.status(400).json({
//                 msg: 'User not found!'
//             })
//         }

//         userItems.userId = user._id
//     })
//     .catch(error => {
//         res.status(500).json({
//             msg: 'Server error!',
//             error
//         })
//     })

//     Code.findById({_id: codeId})
//     .then(code => {
//         if(!code){
//             return res.status(400).json({
//                 msg: 'Code not found!'
//             })
//         }

//         if(code.isUsed){
//             return res.status(400).json({
//                 msg: 'The code has been used!'
//             })
//         }

//         // map
//         for (const _id of code.items){
//             Item.findById(_id)
//             .then(item => {
//                 // can be change
//                 if(item){
//                     userItems.items.push(item.name)

//                     // call model user-items .push item
//                 }

//             })
//             .catch(error => {
//                 return res.status(500).json({
//                     msg: 'Server error!',
//                     error
//                 })
//             })
//         }

//         code.isUsed = true

//         code.save()

//         res.status(200).json({
//             msg: 'success'
//         })
//     })
//     .catch(error => {
//         res.status(500).json({
//             msg: 'Server error!',
//             error
//         })
//     })
// }

// exports.update = (req, res, next) => {
//     const {codeId: _id} = req.params

//     if (req.userData.roles != 'admin'){
//         return res.status(403).json({
//             msg: `You don't have the permission!`
//         })
//     }

//     const code = {}

//     for (const ops of req.body) {
//         code[ops.propName] = ops.value
//     }

//     Code.updateOne({_id}, {$set: code})
//     .then(result => {
//         res.status(200).json({
//             msg: "success",
//             request: {
//                 type: 'GET',
//                 url: req.hostname + '/giffcodes/' + _id
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

// exports.delete = (req, res, next) => {
//     const {codeId: _id} = req.params

//     if (req.userData.roles != 'admin'){
//         return res.status(403).json({
//             msg: `You don't have the permission!`
//         })
//     }

//     Code.deleteOne({_id})
//     .then(result => {
//         res.status(200).json({
//             msg: 'success',
//             request: {
//                 type: 'POST',
//                 url: req.hostname + '/giffcodes',
//                 body: {
//                     code: 'String',
//                     type: 'String',
//                     items: 'Array of Item id',
//                     expiresTime: 'Number (millisecond)'
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