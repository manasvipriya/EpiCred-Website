const dotenv = require("dotenv")
dotenv.config({ path: ".env" })
const express = require("express")
const app = express()
const env = require("./env")
const morgan = require("morgan")
const cors = require("cors")
const cookieSession = require("cookie-session")
const cron = require("node-cron")
const helper = require("./helpers")

const nunjucks = require("nunjucks")
const nunjucksEnv = nunjucks.configure(__dirname, {
    autoescape: true,
    express: app,
    watch: true,
})
const mongoose = require("mongoose")

// routers
const userRouter = require("./routers/user")
const userRouterApiV1 = require("./routers/userApiV1")
const adminRouter = require("./routers/admin")
const adminRouterApiV1 = require("./routers/adminApiV1")
const { apiRateLimiter } = require("./shared/utils")
const messages = require("./shared/messages")
const { CONTACT_INFO } = require("./shared/constants")

// views
app.use(express.static(__dirname + "/public"))

// middlewares
app.set("trust proxy", true)
app.use(morgan("short"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}))
app.use(cors())
app.use(
    cookieSession({
        secret: env.secret,
        keys: ["key1", "key2"],
    })
)
app.use((req, res, next) => {
    res.locals._contact = CONTACT_INFO
    res.locals._env = {
        analytics: process.env.NODE_ENV === "production",
    }
    res.locals._current_year = new Date().getFullYear()
    next()
})

// routes
app.use("/user/api/v1", apiRateLimiter, userRouterApiV1)
app.use("/admin/api/v1", adminRouterApiV1)
app.use("/admin", adminRouter)
app.use("/", userRouter)

// runs every 30 minutes
// * 30 * * * *
cron.schedule("* 30 * * * *", () => {
    helper.user.fetchLatestBlogs()
})

// error handler
app.use(function (req, res, next) {
    const types = ["API"]
    if (types.includes(req?.headers?.ReqType)) {
        res.status(400).send(messages.ERROR)
    } else {
        res.status(404).render("public/user/html/error.html", {
            error: { message: "The page you are looking for is not found" },
        })
    }
})

app.use(function (err, req, res, next) {
    const types = ["API"]
    if (types.includes(req?.headers?.ReqType)) {
        res.status(400).send(messages.ERROR)
    } else {
        res.status(404).render("public/user/html/error.html", {
            error: err || { message: "The page you are looking for is not found" },
        })
    }
})

app.listen(process.env.PORT, async () => {
    try {
        await mongoose.connect(env.dbUri)
        console.log("App running on:", process.env.PORT)
    } catch (error) {
        console.error("Error running app", error)
    }
})
