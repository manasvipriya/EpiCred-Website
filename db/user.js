const { Response } = require("../middlewares/response")
const models = require("../models")
const messages = require("../shared/messages")
const { Ok, BadRequest, Unauthorized, NotFound } = Response
const bcrypt = require("bcrypt")
const { getRandomString, promisify } = require("../shared/utils")
const constants = require("../shared/constants")
const emailCtrl = require("../controllers/email")
const jsonwebtoken = require("jsonwebtoken")
const env = require("../env")
const { transformApplications } = require("../transforms/user")
const testimonials = require("../data/testimonials.json")

exports.home = async (payload, cb) => {
    const data = {
        blogs: [],
        testimonials: testimonials,
    }

    try {
        data.blogs = await models.blogs.find({}).limit(6)
    } catch (error) {}

    return cb(null, Ok({ data }))
}

exports.checkLoanEligibility = async (payload, cb) => {
    try {
        const data = await models.users.findOne({ email: payload.email })
        if (data) {
            return cb(BadRequest(messages.ALREADY_REGISTERED))
        }

        const password = getRandomString()
        const user = {
            name: payload.name,
            email: payload.email,
            dob: payload.dob,
            phoneNumber: payload.phoneNumber,
            password: bcrypt.hashSync(password, constants.BCRYPT_SALT_ROUNDS),
            token: getRandomString(12),
        }

        const created = await models.users.create(user)
        await models.applications.create({
            userId: created._id.toString(),
            preferredCourse: payload.preferredCourse,
            preferredCountry: payload.preferredCountry,
            collateralName: payload.collateralName,
            collateralMonthlyIncome: payload.collateralMonthlyIncome,
            loanAmount: payload.loanAmount,
            isCollateral: payload.isCollateral,
        })

        emailCtrl.sendAccountVerificationEmail({ ...user, password }, (err, data) => {
            console.log(err)
            if (err) {
                return cb(BadRequest(messages.ERROR))
            } else {
                return cb(
                    null,
                    Ok({
                        message:
                            "Your account is created for eligibility. Please check your email for login instructions.",
                    })
                )
            }
        })
    } catch (error) {
        console.log(error)
        return cb(BadRequest(messages.ERROR))
    }
}

exports.verify = async (payload, cb) => {
    const { token } = payload

    try {
        const user = await models.users.findOne({ token: token })

        if (user) {
            await models.users.findByIdAndUpdate(user._id, {
                $set: { verified: true, token: null },
            })
            return cb(null, Ok({ message: "Your account is verified, Please login." }))
        } else {
            return cb(BadRequest(messages.ERROR))
        }
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.login = async (payload, cb) => {
    const { email, password } = payload

    try {
        const user = await models.users.findOne({ email: email })

        if (!user) {
            return cb(NotFound({ message: "Email is not registered" }))
        }

        if (user && !user.verified) {
            return cb(
                BadRequest({
                    message:
                        "Your email is not verified. Please check your email for login instructions & verification",
                })
            )
        }

        const valid = bcrypt.compareSync(password, user.password)

        if (!valid) {
            return cb(Unauthorized({ message: "Your password is incorrect" }))
        }

        const data = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        }

        const token = jsonwebtoken.sign(data, env.secret)

        return cb(null, Ok({ data: { token }, message: "Your credentials are verified" }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.dashboardPage = async (payload, cb) => {
    try {
        const applications = await models.applications.find({ userId: payload.userId }, null, {
            lean: 1,
        })
        return cb(null, Ok({ applications: transformApplications(applications) }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.profilePage = async (payload, cb) => {
    try {
        const profile = await models.users.findOne(
            { _id: payload.userId },
            { name: 1, email: 1, phoneNumber: 1, dob: 1 },
            { lean: 1 }
        )
        return cb(null, Ok({ profile: profile }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.changePassword = async (payload, cb) => {
    try {
        const updated = await models.users.findOneAndUpdate(
            { token: payload.token },
            {
                $set: {
                    password: bcrypt.hashSync(payload.password, constants.BCRYPT_SALT_ROUNDS),
                    token: null,
                },
            }
        )
        if (updated) {
            return cb(null, Ok({ message: "Your password is updated. Please login." }))
        } else {
            return cb(BadRequest(messages.ERROR))
        }
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.updateProfile = async (payload, cb) => {
    try {
        await models.users.findByIdAndUpdate(payload.id, {
            $set: {
                name: payload.name,
                // email: payload.email,
                dob: payload.dob,
                phoneNumber: payload.phoneNumber,
            },
        })
        return cb(null, Ok(messages.SUCCESS_UPDATE))
    } catch (error) {
        return cb(BadRequest(messages.ERROR_UPDATING))
    }
}

exports.forgotPasswordEmail = async (payload, cb) => {
    try {
        const user = await models.users.findOne({ email: payload.email }, null)

        if (!user) {
            return cb(NotFound({ message: "User is not registered" }))
        }

        if (!user.verified) {
            return cb(
                NotFound({
                    message:
                        "Your email is not verified. Please check your inbox for verification email.",
                })
            )
        }
        user.token = getRandomString(32)
        await user.save()
        emailCtrl.sendForgotPasswordEmail(user, (err, sent) => {
            if (err) {
                return cb(BadRequest(messages.ERROR))
            } else {
                return cb(
                    null,
                    Ok({ message: "Please check your email for password change instructions" })
                )
            }
        })
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}
