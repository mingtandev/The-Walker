const History = require('../models/history')

exports.saveHistory = async (userId, type, effect, msg) => {

    let user = await History.find({userId})
    user = user[0]

    if(!user) { 

        console.log('User not found!')
        return
    }

    await user.actions[type][effect].push(msg)
    await user.save()

    return
}

exports.loadHistory = async (userId, type, effect) => {

    let user = await History.find({userId})
    user = user[0]

    let result = []

    if(!user) {

        console.log('User not found!')
        return []
    }

    switch (type) {
        case 'accInfos': {


            break
        }
        case 'items': {


            break
        }
        case 'rolls': {

            result = await user.actions.rolls[effect].map(his => his.split(' ')[2])
            break
        }
        case 'codes': {

            result = await user.actions.codes[effect].map(his => his.split(' ')[2])
            break
        }
    }

    return result
}