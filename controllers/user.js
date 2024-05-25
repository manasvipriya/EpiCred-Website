const db = require("../db")
const { validate } = require("../shared/utils")
const { Response } = require("../middlewares/response")
const validations = require("../shared/validations")
const { CALCULATOR_INITIAL_DATA } = require("../shared/constants")
const { BadRequest } = Response

const page = (name) => {
    return `public/user/html/${name}.html`
}

// SERVER SIDE RENDERING
exports.homePage = (req, res, next) => {
    db.user.home({}, (err, data) => {
        res.render(page("index"), { intial_data: CALCULATOR_INITIAL_DATA, ...data, ...{ path: req.path  } })
    })
}

exports.aboutUsPage = (req, res, next) => {
    res.render(page("about-us"), { path: req.path })
}

exports.privacyPolicyPage = (req, res, next) => {
    res.render(page("privacy-policy"))
}

exports.termsOfServicePage = (req, res, next) => {
    res.render(page("terms-of-service"))
}

exports.contactUsPage = (req, res, next) => {
    res.render(page("contact-us"), { path: req.path })
}

exports.emiCalculatorPage = (req, res, next) => {
    res.render(page("emi-calculator"), { intial_data: CALCULATOR_INITIAL_DATA })
}

exports.loanEligibilityPage = (req, res, next) => {
    res.render(page("check-loan-eligibility"))
}

exports.educationLoanRefinancePage = (req, res, next) => {
    res.render(page("education-loan-refinance"))
}

exports.domesticEducationLoansPage = (req, res, next) => {
    res.render(page("domestic-education-loans"))
}

exports.graduationLoanPage = (req, res, next) => {
    res.render(page("graduation-loan"))
}

exports.lendingPartnerPage = (req, res, next) => {
    db.admin.lendingPartner({ name: req.params.name }, (err, data) => {
        if (err) {
            next(err)
        } else {
            res.render(page("lending-partner-details"), data)
        }
    })
}

exports.verifyPage = (req, res, next) => {
    const error = validate(
        { token: req.query.token },
        {
            token: {
                presence: { allowEmpty: false, message: "^Invalid request" },
            },
        }
    )

    if (error) {
        return next(BadRequest(error))
    }

    db.user.verify({ token: req.query.token }, (err, data) => {
        if (err) {
            next(err)
        } else {
            res.render(page("verify"), { data: data })
        }
    })
}

exports.loginPage = (req, res, next) => {
    res.render(page("login"))
}

exports.dashboardPage = (req, res, next) => {
    db.user.dashboardPage({ userId: req.user.id }, (err, data) => {
        if (err) {
            next(err)
        } else {
            res.render(page("dashboard"), { data: data })
        }
    })
}

exports.profilePage = (req, res, next) => {
    db.user.profilePage({ userId: req.user.id }, (err, data) => {
        if (err) {
            next(err)
        } else {
            res.render(page("profile"), { data: data })
        }
    })
}

exports.forgotPasswordPage = (req, res, next) => {
    const token = req.query.token

    const error = validate(
        { token: token },
        {
            token: {
                presence: {
                    allowEmpty: false,
                    message: "^Invalid request",
                },
                length: {
                    is: 32,
                    wrongLength: "^Invalid request",
                },
            },
        }
    )

    if (error) {
        return next(error)
    }

    res.render(page("forgot-password"), { token: token })
}

// API

exports.forgotPasswordEmail = (req, res, next) => {
    const payload = req.body

    const error = validate(payload, {
        email: {
            presence: {
                allowEmpty: false,
                message: "^Email is required",
            },
            email: {
                message: "^Email is invalid",
            },
        },
    })

    if (error) {
        return Response.Error(res)(error)
    }

    db.user.forgotPasswordEmail(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.changePassword = (req, res, next) => {
    const payload = req.body

    const error = validate(payload, {
        token: {
            presence: {
                allowEmpty: false,
                message: "^Invalid request",
            },
            length: {
                is: 32,
                wrongLength: "^Invalid request",
            },
        },
        password: {
            presence: {
                allowEmpty: false,
                message: "^Password is required",
            },
            length: {
                minimum: 8,
                tooShort: "^Password must be minimum %{count} characters",
                maximum: 24,
                tooLong: "^Password can be maximum %{count} characters",
            },
        },
        confirmPassword: {
            presence: {
                allowEmpty: false,
                message: "^Confirm password is required",
            },
        },
    })

    const passwordsMatch = payload.password === payload.confirmPassword

    if (error || !passwordsMatch) {
        return Response.Error(res)(
            BadRequest(error || { message: "Password and confirm password do not match" })
        )
    }

    db.user.changePassword(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.checkLoanEligibility = (req, res, next) => {
    const payload = req.body

    const error = validate(payload, {
        ...validations.USER,
        ...validations.LOAN_APPLICATION,
    })

    if (error) {
        return Response.Error(res)(Response.BadRequest(error))
    }

    if (payload.isCollateral) {
        const error = validate(payload, validations.LOAN_APPLICATION_COLLATERAL)

        if (error) {
            return Response.Error(res)(Response.BadRequest(error))
        }
    }

    db.user.checkLoanEligibility(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}

exports.login = (req, res, next) => {
    const payload = req.body

    const error = validate(payload, validations.LOGIN)

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    db.user.login(payload, (err, data) => {
        if (err) {
            return Response.Error(res)(err)
        } else {
            req.session.token = data.data.token
            return Response.Success(res)(data)
        }
    })
}

exports.logout = (req, res, next) => {
    req.session.token = null
    res.send()
}

exports.updateProfile = (req, res, next) => {
    const payload = req.body

    const error = validate(payload, validations.USER)

    if (error) {
        return Response.Error(res)(BadRequest(error))
    }

    db.user.updateProfile(payload, (err, data) => {
        if (err) {
            Response.Error(res)(err)
        } else {
            Response.Success(res)(data)
        }
    })
}
