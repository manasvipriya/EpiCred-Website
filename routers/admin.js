const router = require("express").Router()
const adminCtrl = require("../controllers/admin")
const adminAuthServer = require("../middlewares/admin-auth-server")
const urls = require("../middlewares/admin-urls")

// Page render
router.get("/", urls, adminAuthServer, adminCtrl.homePage)

router.get("/login", urls, adminCtrl.loginPage)

router.get("/users", urls, adminAuthServer, adminCtrl.usersPage)

router.get("/user/create", urls, adminAuthServer, adminCtrl.createUserPage)

router.get("/user/:id/:action", urls, adminAuthServer, adminCtrl.editViewUserPage)

router.get("/loan-applications", urls, adminAuthServer, adminCtrl.loanApplicationsPage)

router.get("/loan-application/create", urls, adminAuthServer, adminCtrl.createLoanApplicationpage)

router.get(
    "/loan-application/:id/:action",
    urls,
    adminAuthServer,
    adminCtrl.editViewLoanApplicationPage
)

module.exports = router
