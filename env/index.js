const env = process.env?.NODE_ENV || "local"

const obj = {
    production: {
        baseUrl: "https://www.epicred.in",
        dbUri: "mongodb://localhost:27017/epitomecredit",
        emailFrom: "info@epicred.in",
        secret: "c48f0788-1e72-11ee-be56-0242ac120002",
        enableEmail: true,
        blogJsonEndPoint:
            "https://blog.epicred.in/wp-json/wp/v2/posts?per_page=3&order=desc&orderby=date",
    },
    development: {
        baseUrl: "http://15.207.171.41:5000",
        dbUri: "mongodb://localhost:27017/epitomecredit",
        emailFrom: "info@epicred.in",
        secret: "c48f0788-1e72-11ee-be56-0242ac120002",
        enableEmail: false,
        blogJsonEndPoint:
            "https://blog.epicred.in/wp-json/wp/v2/posts?per_page=6&order=desc&orderby=date",
    },
    local: {
        baseUrl: "http://localhost:3000",
        dbUri: "mongodb://localhost:27017/epitomecredit",
        emailFrom: "info@epicred.in",
        secret: "c48f0788-1e72-11ee-be56-0242ac120002",
        enableEmail: true,
        blogJsonEndPoint:
            "https://blog.epicred.in/wp-json/wp/v2/posts?per_page=6&order=desc&orderby=date",
    },
}

module.exports = obj[env]
