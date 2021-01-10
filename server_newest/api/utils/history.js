// const History = require('../models/history')

// exports.saveHistory = async (userId, type, effect, msg) => {
//     try {
//         let user = await History.findOne({userId})

//         if (!user) {
//             user = new History({userId})
//         }

//         await user.actions[type][effect].push(msg)
//         await user.save()

//         return user
//     }
//     catch (error) {
//         console.log(error)
//         return error.message
//     }

// }

// exports.loadHistory = async (userId, type, effect) => {
//     try {
//         let user = await History.findOne({userId})
//         let result = []

//         if (!user) {
//             return result
//         }

//         result = await user.actions[type][effect]

//         return result
//     }
//     catch (error) {
//         console.log(error)
//         return error.message
//     }
// }
