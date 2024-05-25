const express = require("express")
const ctrls = require("../controllers")
const { emailApiRateLimiter } = require("../shared/utils")
const userAuth = require("../middlewares/user-auth")

const router = express.Router()

router.post("/check-loan-eligibility", ctrls.user.checkLoanEligibility)

router.post("/login", ctrls.user.login)

router.get("/logout", ctrls.user.logout)

router.put("/profile", userAuth, ctrls.user.updateProfile)

router.post("/forgot-password-email", emailApiRateLimiter, ctrls.user.forgotPasswordEmail)

router.post("/change-password", ctrls.user.changePassword)

module.exports = router
