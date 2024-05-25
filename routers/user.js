const router = require("express").Router()
const ctrls = require("../controllers")
const { AUTH_TYPES } = require("../shared/constants")
const userAuthServer = require("../middlewares/user-auth-server")
const userServer = require("../middlewares/user-server")
const urls = require("../middlewares/user-urls")

// Server Side Render
router.get("/", userServer, ctrls.user.homePage)

router.get("/about-us", userServer, ctrls.user.aboutUsPage)

router.get("/privacy-policy", userServer, ctrls.user.privacyPolicyPage)

router.get("/terms-of-service", userServer, ctrls.user.termsOfServicePage)

router.get("/contact-us", userServer, ctrls.user.contactUsPage)

router.get("/repayment-calculator", userServer, ctrls.user.emiCalculatorPage)

router.get("/check-loan-eligibility", userServer, ctrls.user.loanEligibilityPage)

router.get("/education-loan-refinance", userServer, ctrls.user.educationLoanRefinancePage)

router.get("/domestic-education-loans", userServer, ctrls.user.domesticEducationLoansPage)

router.get("/graduation-loan", userServer, ctrls.user.graduationLoanPage)

router.get("/lending-partner/:name", userServer, ctrls.user.lendingPartnerPage)

router.get("/user/verify", userServer, ctrls.user.verifyPage)

router.get("/user/login", userServer, ctrls.user.loginPage)

router.get("/user/dashboard", userAuthServer, urls, ctrls.user.dashboardPage)

router.get("/user/profile", userAuthServer, urls, ctrls.user.profilePage)

router.get("/user/forgot-password", ctrls.user.forgotPasswordPage)

module.exports = router
