const validatejs = require("validate.js")
const env = require("../env")
const { UrlBuilder } = require("http-url-builder")
const randomString = require("randomstring")
const rateLimiter = require("express-rate-limit")
const { Response } = require("../middlewares/response")

exports.validate = (data, constraints) => {
    if (!data) {
        throw new Error("data is required")
    }

    if (!constraints) {
        throw new Error("constraints is required")
    }

    const invalid = validatejs(data, constraints, { format: "flat" })
    if (invalid) {
        return { message: invalid[0] }
    }

    return null
}

exports.genPageSize = (queryParams) => {
    let { page, size } = queryParams

    try {
        page = parseInt(page) || 1
        size = parseInt(size) || 10
    } catch (error) {
        page = 1
        size = 10
    }

    size = size > 100 ? 10 : size
    return { page: page, size: size }
}

exports.genNextPrevUrls = (request) => {
    let { page, size } = exports.genPageSize(request.query)
    let query = { ...request.query }

    delete query.page
    delete query.size

    let base_url = process.env.NODE_ENV === "local" ? `http://${request.headers.host}` : env.baseUrl
    const full_url = `${base_url}${request.baseUrl}${request._parsedUrl.pathname}`
    let next_url = new UrlBuilder(full_url)
    let prev_url = new UrlBuilder(full_url)
    Object.keys(query).forEach((key) => {
        next_url = next_url.addQueryParam(key, query[key])
        prev_url = prev_url.addQueryParam(key, query[key])
    })

    if (page == 1) {
        prev_url = ""
    } else {
        prev_url = prev_url
            .addQueryParam("page", page - 1)
            .addQueryParam("size", size)
            .build()
    }
    next_url = next_url
        .addQueryParam("page", page + 1)
        .addQueryParam("size", size)
        .build()

    return { next_url: next_url, prev_url: prev_url, ...exports.getSkipLimit({ page, size }) }
}

/**
 *
 * @param {Object} data - request query
 * @returns {Object} { skip: 0, limit: 10 } - object
 *
 */
exports.getSkipLimit = ({ page = 1, size = 10 }) => {
    try {
        page = parseInt(page) || 1
    } catch (error) {
        page = 1
    }

    try {
        size = parseInt(size) || 10
    } catch (error) {
        size = 10
    }

    let skip = page * size - size
    let limit = size

    return { skip, limit }
}

exports.getDatatableOrderby = (payload) => {
    const order = payload?.order?.[0]

    if (order) {
        const column = payload.columns.find((col, pos) => order.column == pos)

        if (column) {
            return { order: order.dir === "desc" ? -1 : 1, column: column.data }
        }
        return { column: "createdAt", order: -1 }
    }
    return { column: "createdAt", order: -1 }
}

exports.getRandomString = (length = 8) => {
    return randomString.generate({ length: length })
}

exports.promisify = (fn) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error) {
                    return reject(error)
                }

                return resolve(result)
            })
        })
    }
}

exports.emailApiRateLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3,
    handler: (request, response, next, options) => {
        return Response.Error(response)(
            Response.TooManyRequests({
                message: "Too many requests from this IP. Please try again later.",
            })
        )
    },
})

exports.apiRateLimiter = rateLimiter({
    windowMs: 1 * 60 * 1000,
    max: 100,
    handler: (request, response, next, options) => {
        return Response.Error(response)(
            Response.TooManyRequests({
                message: "Too many requests from this IP. Please try again later.",
            })
        )
    },
})

exports.getArgs = (arr) => {
    const args = {}
    arr.slice(2, arr.length).forEach((arg) => {
        // long arg
        if (arg.slice(0, 2) === "--") {
            const longArg = arg.split("=")
            const longArgFlag = longArg[0].slice(2, longArg[0].length)
            const longArgValue = longArg.length > 1 ? longArg[1] : true
            args[longArgFlag] = longArgValue
        }
        // flags
        else if (arg[0] === "-") {
            const flags = arg.slice(1, arg.length).split("")
            flags.forEach((flag) => {
                args[flag] = true
            })
        }
    })
    return args
}
