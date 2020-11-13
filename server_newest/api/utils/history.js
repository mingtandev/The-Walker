const History = require('../models/history')

exports.saveHistory = async (userId, type, effect, msg) => {
    let user = await History.findOne({userId})

    if (!user) {
        user = new History({
            userId,
            actions: {
                accInfos: {
                    personal: [],
                    manage: []
                },
                items:  {
                    personal: [],
                    manage: []
                },
                rolls:  {
                    personal: [],
                    manage: []
                },
                codes:  {
                    personal: [],
                    manage: []
                },
                blogs:  {
                    personal: [],
                    manage: []
                }
            }
        })
    }

    await user.actions[type][effect].push(msg)
    await user.save()

    return []
}

exports.loadHistory = async (userId, type, effect) => {
    let user = await History.findOne({userId})
    let result = []

    if (!user) {
        return result
    }

    result = await user.actions[type][effect]

    return result
}