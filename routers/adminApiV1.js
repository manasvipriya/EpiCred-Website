const router = require("express").Router()
const ctrls = require("../controllers")
const adminAuth = require("../middlewares/admin-auth")

router.post("/login", ctrls.admin.login)

router.post("/users", adminAuth, ctrls.admin.users)

router.post("/loan-applications", adminAuth, ctrls.admin.loanApplications)

router.get("/logout", ctrls.admin.logout)

router.post("/user", adminAuth, ctrls.admin.createUser)

router.put("/user/:id", adminAuth, ctrls.admin.updateUser)

router.post("/loan-application", adminAuth, ctrls.admin.createLoanApplication)

router.put("/loan-application/:id", adminAuth, ctrls.admin.updateLoanApplication)

router.delete("/user/:id", adminAuth, ctrls.admin.deleteUser)

router.delete("/loan-application/:id", adminAuth, ctrls.admin.deleteLoanApplication)

module.exports = router
