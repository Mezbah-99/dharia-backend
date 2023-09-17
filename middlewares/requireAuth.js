const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    // verify authorization
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required!' })
    }
    const token = authorization.split(' ')[1]
    try {
        jwt.verify(token, process.env.SECRET, function (err) {
            if (err) {
                console.log("Your Login token is not valid, , , Please Login again")
                return error
            } else {
                next()
            }
        })


    } catch (error) {
        res.status(401).json({ error: "Your Login token is not valid, , , Please Login again" })
    }
}

module.exports = requireAuth;