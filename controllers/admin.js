const { Response } = require("../middlewares/response")
const { BadRequest } = Response
const db = require("../db")
const { validate, getRandomString, getDatatableOrderby } = require("../shared/utils")
const validations = require("../shared/validations")
const { APPLICATION_STATUSES } = require("../shared/constants")

const page = (name) => {
    return `public/admin/html/${name}.html`
}

exports.loginPage = (req, res, next) => {
    return res.render(page("login"))
}

exports.homePage = (req, res, next) => {
    db.admin.home({}, (err, data) => {
        res.render(page("index"), data)
    })
}

exports.usersPage = (req, res, next) => {
    res.render(page("users"))
}

exports.createUserPage = (req, res, next) => {
    res.render(page("crud-user"), { action: "create" })
}

exports.editViewUserPage = (req, res, next) => {
    db.admin.getUser({ id: req.params.id }, (err, _res) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            res.render(page("crud-user"), {
                action: req.params.action,
                id: req.params.id,
                user: _res?.data?.user,
                isView: req.params.action === "view",
            })
        }
    })
}

exports.loanApplicationsPage = (req, res, next) => {
    res.render(page("loan-applications"))
}

exports.createLoanApplicationpage = (req, res, next) => {
    res.render(page("crud-loan-application"), { action: "create" })
}

exports.editViewLoanApplicationPage = (req, res, next) => {
    db.admin.getLoan({ id: req.params.id }, (err, _res) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            res.render(page("crud-loan-application"), {
                action: req.params.action,
                id: req.params.id,
                loanApplication: _res?.data?.loanApplication,
                user: _res?.data?.user,
                isView: req.params.action === "view",
                statuses: APPLICATION_STATUSES,
            })
        }
    })
}

// API

exports.login = (req, res, next) => {
    const payload = req.body

    const error = validate(payload, validations.LOGIN)

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    db.admin.login(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            req.session.token = data.data.token
            Response.Success(res)(data)
        }
    })
}

exports.logout = (req, res, next) => {
    req.session.token = null
    res.send()
}

exports.users = (req, res, next) => {
    const payload = req.body
    payload.sort = getDatatableOrderby(payload)
    db.admin.users(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.loanApplications = (req, res, next) => {
    const payload = req.body
    payload.sort = getDatatableOrderby(payload)
    db.admin.loanApplications(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.createUser = (req, res, next) => {
    const payload = req.body

    const error = validate(payload, validations.USER)

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    db.admin.createUser(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.updateUser = (req, res, next) => {
    const payload = { ...req.body, id: req.params.id }

    const error = validate(payload, {
        id: {
            presence: {
                allowEmpty: false,
                message: "^ID is required",
            },
            length: {
                is: 24,
                wrongLength: "^Invalid ID",
            },
        },
        ...validations.USER,
    })

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    db.admin.updateUser(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.deleteUser = (req, res, next) => {
    const payload = { id: req.params.id }
    const constraints = {
        id: {
            presence: {
                allowEmpty: false,
                message: "^Invalid request",
            },
            length: {
                is: 24,
                wrongLength: "^Invalid request",
            },
        },
    }

    const error = validate(payload, constraints)

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    db.admin.deleteUser(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.createLoanApplication = (req, res, next) => {
    const payload = req.body

    const constraints = {
        userId: {
            presence: {
                allowEmpty: false,
                message: "^User id is required",
            },
            length: {
                is: 24,
                wrongLength: "^Invalid User Id",
            },
        },
        ...validations.LOAN_APPLICATION,
    }

    const error = validate(payload, constraints)

    if (error) {
        return Response.Error(res)(Response.BadRequest(error))
    }

    if (payload.isCollateral) {
        const error = validate(payload, validations.LOAN_APPLICATION_COLLATERAL)

        if (error) {
            return Response.Error(res)(Response.BadRequest(error))
        }
    }

    db.admin.createLoanApplication(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.updateLoanApplication = (req, res, next) => {
    const payload = { ...req.body, id: req.params.id }

    const constraints = {
        id: {
            presence: {
                allowEmpty: false,
                message: "^ID is required",
            },
            length: {
                is: 24,
                wrongLength: "^Invalid ID",
            },
        },
        ...validations.LOAN_APPLICATION,
    }

    const error = validate(payload, constraints)

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    if (payload.isCollateral) {
        const error = validate(payload, validations.LOAN_APPLICATION_COLLATERAL)

        if (error) {
            return Response.Error(res)(BadRequest(error))
        }
    }

    db.admin.updateLoanApplication(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.deleteLoanApplication = (req, res, next) => {
    const payload = { id: req.params.id }
    const constraints = {
        id: {
            presence: {
                allowEmpty: false,
                message: "^Invalid request",
            },
            length: {
                is: 24,
                wrongLength: "^Invalid request",
            },
        },
    }

    const error = validate(payload, constraints)

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    db.admin.deleteLoanApplication(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}
