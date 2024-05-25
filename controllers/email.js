const env = require("../env")
const ElasticEmail = require("@elasticemail/elasticemail-client")

const defaultClient = ElasticEmail.ApiClient.instance
const apikey = defaultClient.authentications["apikey"]
apikey.apiKey = process.env.EMAIL_API_KEY

const emailApi = new ElasticEmail.EmailsApi()

exports.sendAccountVerificationEmail = (data, cb) => {
    if (!env.enableEmail) {
        return cb(null)
    }
    const content = [
        `Hi ${data.name},`,
        "Please verify your email and login to check the eligibility & loan status.<br>",
        `Email: ${data.email}`,
        `Password: ${data.password} <br>`,
        `Click the following link to verify:`,
        `<a target="_blank" href="${env.baseUrl}/user/verify?token=${data.token}">${env.baseUrl}/user/verify?token=${data.token}</a>`,
    ].join("<br>")

    emailApi.emailsPost(
        ElasticEmail.EmailMessageData.constructFromObject({
            Recipients: [new ElasticEmail.EmailRecipient(data.email)],
            Content: {
                Body: [
                    ElasticEmail.BodyPart.constructFromObject({
                        ContentType: "HTML",
                        Content: content,
                    }),
                ],
                Subject: "epicred - Account Verification",
                From: env.emailFrom,
            },
        }),
        cb
    )
}

exports.sendForgotPasswordEmail = (data, cb) => {
    if (!env.enableEmail) {
        return cb(null)
    }
    const content = [
        `Hi ${data.name},`,
        "We have received a request for password change.<br>",
        `Click the following link to change password:`,
        `<a target="_blank" href="${env.baseUrl}/user/forgot-password?token=${data.token}">${env.baseUrl}/user/forgot-password?token=${data.token}</a>`,
    ].join("<br>")

    emailApi.emailsPost(
        ElasticEmail.EmailMessageData.constructFromObject({
            Recipients: [new ElasticEmail.EmailRecipient(data.email)],
            Content: {
                Body: [
                    ElasticEmail.BodyPart.constructFromObject({
                        ContentType: "HTML",
                        Content: content,
                    }),
                ],
                Subject: "epicred - Forgot Password",
                From: env.emailFrom,
            },
        }),
        cb
    )
}
