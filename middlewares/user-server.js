const jsonwebtoken = require("jsonwebtoken")
const models = require("../models")
const env = require("../env")

module.exports = async (req, res, next) => {
    try {
        const token = req?.session?.token

        if (!token) {
            return next()
        }

        const decoded = jsonwebtoken.verify(token, env.secret)

        if (decoded.role === 2) {
            res.locals.header = {
                user: decoded,
            }
        }

        return next()
    } catch (error) {
        res.locals.message = {
            error: "Error! Please try again.",
        }
        return res.redirect("/user/login")
    }
}
