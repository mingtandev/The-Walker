const Statistic = require('../models/statistic')

exports.saveStatistic = async (newUser, activeUser, soldItem, usedCode, blog, cash) => {

    let start = new Date()
    start.setHours(0,0,0,0)

    let end = new Date()
    end.setHours(23,59,59,999)

    const todaySta = await Statistic.findOne({
        createdAt: {
            '$gte': start,
            '$lt': end
        }
    })

    if (todaySta) {
        todaySta['newUsers'] += newUser
        todaySta['activeUsers'] += activeUser
        todaySta['soldItems'] += soldItem
        todaySta['usedCodes'] += usedCode
        todaySta['blogs'] += blog
        todaySta['cash'] += cash

        await todaySta.save()

    }else{
        const newSta = new Statistic({
            newUsers: newUser,
            activeUsers: activeUser,
            soldItems: soldItem,
            usedCodes: usedCode,
            blogs: blog,
            cash
        })

        await newSta.save()
    }

    return
}

// exports.loadStatistic = async (userId, type, effect) => {

//     let user = await Statistic.find({userId})
//     user = user[0]

//     let result = []

//     if(!user) {

//         console.log('User not found!')
//         return []
//     }

//     switch (type) {
//         case 'accInfos': {


//             break
//         }
//         case 'items': {


//             break
//         }
//         case 'rolls': {


//             break
//         }
//         case 'codes': {

//             result = await user.actions.codes[effect].map(his => his.split(' ')[2])
//             break
//         }
//     }

//     return result
// }