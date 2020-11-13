const { startSession } = require('mongoose')
const Statistic = require('./../models/statistic')

exports.get = async (req, res, next) => {

    const start_day = req.query.start_day
    const end_day = req.query.end_day
    const day = req.query.day

    let result = null

    if(day) {
        let start = new Date(day)
        start.setHours(0,0,0,0)

        let end = new Date(day)
        end.setHours(23,59,59,999)

        result = await Statistic.find({
            createdAt: {
                "$gte": start,
                "$lt": end
            }
        })
    }
    else if(!start_day || !end_day) {
        result = await Statistic.find({})

    }else if (start_day && end_day){
        let start = new Date(start_day)
        start.setHours(0,0,0,0)

        let end = new Date(end_day)
        end.setHours(23,59,59,999)

        result = await Statistic.find({
            createdAt: {
                "$gte": start,
                "$lt": end
            }
        })
    }

    if (!result) {
        return res.status(500).json({
            msg: 'Server error!',
            error
        })
    }

    console.log(result)

    const statistics = result.reduce((accumulator, currentValue) =>
        {
            accumulator['newUsers'] += currentValue['newUsers']
            accumulator['activeUsers'] += currentValue['activeUsers']
            accumulator['soldItems'] += currentValue['soldItems']
            accumulator['usedCodes'] += currentValue['usedCodes']
            accumulator['blogs'] += currentValue['blogs']
            accumulator['cash'] += currentValue['cash']

            return accumulator

        },{
                newUsers: 0,
                newUsers: 0,
                soldItems: 0,
                usedCodes: 0,
                blogs: 0,
                cash: 0,
        })

    const response = {
        msg: 'success',
        statistics
    }

    res.status(200).json(response)
}