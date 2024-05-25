const jsonwebtoken = require("jsonwebtoken");
const models = require("../models");
const env = require("../env");

module.exports = async (req, res, next) => {
    try {
        const token = req?.session?.token;

        if (!token) {
            return res.redirect("/user/login");
        }

        const decoded = jsonwebtoken.verify(token, env.secret);
        const user = await models.users.findOne({ _id: decoded.id });

        if (!user) {
            return res.redirect("/user/login");
        }

        if (user && !user.active) {
            res.locals.message = {
                error: "Your account disabled. Please contact support.",
            };
            return res.redirect("/user/login");
        }

        res.locals.header = {
            user: user,
        };
        req.user = user;

        return next();
    } catch (error) {
        res.locals.message = {
            error: "Error! Please try again.",
        };
        return res.redirect("/user/login");
    }
};
