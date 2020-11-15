const UserItem = require('../models/userItem')
const Item = require('../models/item')

exports.saveUserItem = async (userId, items, coin) => {
    let userItem = await UserItem.findOne({userId})

    if (!userItem) {
        userItem = new UserItem({ userId })
    }

    for(let i = 0; i < items.length; i++) {
        const result  = await Item.findById(items[i])
        if (!result) break
        await userItem.items[`${result.type}s`].push(result.name)
    }

    userItem.coin += +coin

    await userItem.save()

    return userItem
}