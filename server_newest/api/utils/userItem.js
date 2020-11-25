const UserItem = require('../models/userItem')
const Item = require('../models/item')

exports.saveUserItem = async (userId, items, coin) => {
    try {
        let userItem = await UserItem.findOne({userId})

        if (!userItem) {
            userItem = new UserItem({userId})
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
    catch (error) {
        console.log(error)
        return error.message
    }
}