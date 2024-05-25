const urls = require("../data/urls")

module.exports = (req, res, next) => {
    res.locals.dashboard_urls = urls.admin
    next()
}
