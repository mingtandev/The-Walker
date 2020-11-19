const UserItem = require('../models/userItem')
const Item = require('../models/item')

const defaultItem = {
    gun: [{
        id: '',
        name: 'AWM',
        detail: 'Item detail',
        boughtAt: new Date()
    }],
    hat: [{
        id: '',
        name: 'Cowboy',
        detail: 'Item detail',
        boughtAt: new Date()
    }],
    outfit: [{
        id: '',
        name: 'Bikini',
        detail: 'Item detail',
        boughtAt: new Date()
    }]
}

exports.saveUserItem = async (userId, items, coin) => {
    let userItem = await UserItem.findOne({userId})

    if (!userItem) {
        userItem = new UserItem({ userId, items: defaultItem })
    }

    for(let i = 0; i < items.length; i++) {
        const result  = await Item.findById(items[i])
        if (!result) continue

        const record = {
            id: result._id,
            name: result.name,
            detail: result.detail,
            boughtAt: new Date()
        }

        await userItem.items[`${result.type}s`].push(record)
    }

    userItem.coin += +coin

    await userItem.save()

    return userItem
}