const jsonwebtoken = require("jsonwebtoken")
const models = require("../models")
const env = require("../env")
const { Response } = require("./response")
const messages = require("../shared/messages")

module.exports = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization

        if (!token) {
            return Response.Error(res)(
                Response.Unauthorized({ message: "Unauthorized access denied" })
            )
        }

        const decoded = jsonwebtoken.verify(token, env.secret)
        const user = await models.users.findOne({ _id: decoded.id })

        if (!user) {
            return Response.Error(res)(Response.NotFound({ message: "User not found" }))
        }

        if (user && !user.active) {
            return Response.Error(res)(
                Response.Unauthorized({ message: "Your account disabled. Please contact support." })
            )
        }

        req.user = user

        return next()
    } catch (error) {
        return Response.Error(res)(Response.BadRequest(messages.ERROR))
    }
}
