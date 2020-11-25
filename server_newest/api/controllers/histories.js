const History = require('../models/history')

exports.getAll = (req, res, next) => {

    if (req.userData.roles != 'admin'){
        return res.status(403).json({
            msg: 'ValidatorError',
            errors: {
                user: `You don't have the permission!`
            }
        })
    }

    const page = parseInt(req.query.page) || 1
    const items_per_page = parseInt(req.query.limit) || 100

    if (page < 1) page = 1

    History.find({})
    .select('userId actions')
    .skip((page - 1) * items_per_page)
    .limit(items_per_page)
    .then(async histories => {
        const request = {}
        const len = await History.find({}).countDocuments()

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

    History.findOne({userId})
    .select('_id userId actions')
    .then(history => {
        if(!history){
            return res.status(202).json({
                msg: 'ValidatorError',
                errors: {
                    user: `History not found!`
                }
            })
        }

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
        console.log(error)
        res.status(500).json({
            msg: "Server error!",
            error
        })
    })
}
