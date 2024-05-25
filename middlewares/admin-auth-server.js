const jsonwebtoken = require("jsonwebtoken")
const models = require("../models")
const env = require("../env")

module.exports = async (req, res, next) => {
    try {
        const token = req?.session?.token

        if (!token) {
            return res.redirect("/admin/login")
        }

        const decoded = jsonwebtoken.verify(token, env.secret)
        const user = await models.admins.findOne({ _id: decoded.id })

        if (!user) {
            return res.redirect("/admin/login")
        }

        res.locals.header = {
            user: user,
        }
        req.user = user

        return next()
    } catch (error) {
        res.locals.message = {
            error: "Error! Please try again.",
        }
        return res.redirect("/admin/login")
    }
}
