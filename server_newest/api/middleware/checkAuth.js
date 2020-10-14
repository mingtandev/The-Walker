const jwt = require('jsonwebtoken')

const jwtKey = process.env.JWT_KEY

module.exports = (req, res, next) => {
    const bearer = req.headers.authorization

    if(!bearer) {
        return res.status(401).json({
            msg: 'Auth failed!'
        })
    }

    try {
        const token = bearer.split(' ')[1]
        const decoded = jwt.verify(token, jwtKey)

        req.userData = decoded
        next()

    } catch (error) {
        res.status(401).json({
            msg: 'Auth failed!'
        })
    }
}