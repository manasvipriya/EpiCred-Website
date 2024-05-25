const env = require("../env")
const { Response } = require("../middlewares/response")
const models = require("../models")
const { Ok, Unauthorized, NotFound, BadRequest } = Response
const bcrypt = require("bcrypt")
const jsonwebtoken = require("jsonwebtoken")
const messages = require("../shared/messages")
const { getRandomString } = require("../shared/utils")
const { BCRYPT_SALT_ROUNDS, APPLICATION_STATUSES } = require("../shared/constants")
const emailCtrl = require("../controllers/email")
const lendingPartners = require("../data/lendingPartners.json")
const { each, forEach } = require("async")

exports.login = async (payload, cb) => {
    try {
        const admin = await models.admins.findOne({ email: payload.email }, null, { lean: 1 })

        if (!admin) {
            return cb(NotFound({ message: "User not found" }))
        }

        const valid = bcrypt.compareSync(payload.password, admin.password)

        if (valid) {
            return cb(Unauthorized({ message: "Password is incorrect" }))
        }

        return cb(
            null,
            Ok({
                data: {
                    token: jsonwebtoken.sign({ id: admin._id, email: admin.email }, env.secret),
                },
            })
        )
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.home = async (payload, cb) => {
    const data = {
        users: {
            count: 0,
        },
        loans: [],
    }

    try {
        data.users.count = await models.users.countDocuments()

        for (let index = 0; index < APPLICATION_STATUSES.length; index++) {
            const status = APPLICATION_STATUSES[index]
            const count = await models.applications.countDocuments({ status: status })
            data.loans.push({
                name: status,
                count: count,
            })
        }
    } catch (error) {}
    return cb(null, Ok({ data }))
}

exports.users = async (payload, cb) => {
    const { search, draw, sort, start, length } = payload
    const data = {
        draw: draw,
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
    }

    let filter = {}

    if (search?.value) {
        filter.$or = [
            // { $text: { $search: search.value } },
            { name: { $regex: search.value, $options: "i" } },
            { email: { $regex: search.value, $options: "i" } },
            { phoneNumber: { $regex: search.value, $options: "i" } },
        ]
    }

    try {
        const totalRecords = await models.users.countDocuments(filter, { lean: 1 })
        data.recordsFiltered = totalRecords
        data.recordsTotal = totalRecords

        data.data = await models.users
            .find(filter, { password: 0, token: 0 }, { lean: 1 })
            .sort({ [sort.column]: sort.order })
            .skip(+start)
            .limit(+length)

        return cb(null, Ok(data))
    } catch (error) {
        return cb(BadRequest(data))
    }
}

exports.loanApplications = async (payload, cb) => {
    const { search, draw, sort, start, length, userId } = payload
    const data = {
        draw: draw,
        recordsTotal: 0,
        recordsFiltered: 0,
        data: [],
    }

    let filter = {}

    if (userId) {
        filter.userId = userId
    }

    if (search?.value) {
        filter.$or = [
            // { $text: { $search: search.value } },
            { preferredCourse: { $regex: search.value, $options: "i" } },
            { preferredCountry: { $regex: search.value, $options: "i" } },
            { status: { $regex: search.value, $options: "i" } },
        ]

        if (!Number.isNaN(+search.value)) {
            filter.$or.push({ loanAmount: { $in: search.value } })
        }
    }

    try {
        const totalRecords = await models.applications.countDocuments(filter, { lean: 1 })
        data.recordsFiltered = totalRecords
        data.recordsTotal = totalRecords

        const loans = await models.applications
            .find(filter, { password: 0, token: 0 }, { lean: 1 })
            .sort({ [sort.column]: sort.order })
            .skip(+start)
            .limit(+length)

        const userIds = loans.map((loan) => loan.userId)
        const users = await models.users.find(
            { _id: { $in: userIds } },
            { name: 1, email: 1 },
            { lean: 1 }
        )

        loans.forEach((loan) => {
            loan.user = users.find((user) => user._id.toString() === loan.userId.toString())
        })

        data.data = loans

        return cb(null, Ok(data))
    } catch (error) {
        console.log(error)
        return cb(BadRequest(data))
    }
}

exports.createUser = async (payload, cb) => {
    try {
        const exists = await models.users.findOne({ email: payload.email })
        if (exists) {
            return cb(BadRequest({ message: "Email is already registered" }))
        }
        const password = getRandomString(8)
        payload.password = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS)
        payload.token = getRandomString(32)
        const user = await models.users.create(payload)
        emailCtrl.sendAccountVerificationEmail(
            { email: user.email, name: user.name, password: password, token: payload.token },
            async (err, res) => {
                if (err) {
                    await models.users.deleteOne({ _id: user._id })
                    return cb(BadRequest(messages.ERROR))
                } else {
                    return cb(
                        null,
                        Ok({ message: "User created successfully", data: { id: user._id } })
                    )
                }
            }
        )
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.updateUser = async (payload, cb) => {
    try {
        const user = await models.users.findByIdAndUpdate(payload.id, {
            $set: payload,
            updatedAt: Date.now(),
        })
        return cb(null, Ok({ message: "User updated successfully", data: user }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.getUser = async (payload, cb) => {
    try {
        const user = await models.users.findById(payload.id, { password: 0 })
        return cb(null, Ok({ data: { user } }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.deleteUser = async (payload, cb) => {
    try {
        await models.users.deleteOne({ _id: payload.id })
        await models.applications.deleteMany({ userId: payload.id })
        return cb(null, Ok({ message: "Delete user successfully" }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.getLoan = async (payload, cb) => {
    try {
        const loanApplication = await models.applications.findById(payload.id)
        const user = await models.users.findById(loanApplication.userId)
        return cb(null, Ok({ data: { loanApplication, user } }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.createLoanApplication = async (payload, cb) => {
    try {
        const loanApplication = await models.applications.create(payload)
        return cb(null, Ok({ data: { id: loanApplication._id } }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.updateLoanApplication = async (payload, cb) => {
    try {
        const loanApplication = await models.applications.findByIdAndUpdate(payload.id, {
            $set: {
                preferredCountry: payload.preferredCountry,
                preferredCourse: payload.preferredCourse,
                isCollateral: payload.isCollateral,
                loanAmount: payload.loanAmount,
                collateralName: payload.collateralName,
                collateralMonthlyIncome: payload.collateralMonthlyIncome,
                comments: payload.comments,
                status: payload.status,
            },
        })
        return cb(null, Ok({ data: { loanApplication }, message: "Updated successfully" }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.deleteLoanApplication = async (payload, cb) => {
    try {
        await models.applications.deleteOne({ _id: payload.id })
        return cb(null, Ok({ message: "Delete loan application successfully" }))
    } catch (error) {
        return cb(BadRequest(messages.ERROR))
    }
}

exports.lendingPartner = async (payload, cb) => {
    const data = lendingPartners.find((item) => item.name === payload.name)

    if (data) {
        return cb(null, Ok({ data: data }))
    } else {
        return cb(NotFound({ message: "Lending partners details not available" }))
    }
}
