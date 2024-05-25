exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
}

exports.PAGE_ACTIONS = {
    view: {
        view: true,
        create: false,
        edit: false,
    },
    edit: {
        view: false,
        create: false,
        edit: true,
    },
    create: {
        view: false,
        create: true,
        edit: false,
    },
}

exports.AUTH_TYPES = {
    API: 1,
    SERVER: 2,
    USER_LOGIN: 3,
}

exports.BCRYPT_SALT_ROUNDS = 10

exports.APPLICATION_STATUS_COLOR = {
    Pending: "orange",
    "Credit Assessment": "orange",
}

exports.CONTACT_INFO = {
    email: "info@epicred.in",
    phone: "+919877889609",
    linkedin: "https://www.linkedin.com/company/epitomecredit/",
    instagram: "https://www.instagram.com/epi.cred",
}

exports.CALCULATOR_INITIAL_DATA = {
    loanAmount: {
        min: 100000,
        max: 10000000,
        value: 1600000,
        step: 100000,
    },
    interest: {
        min: 1,
        max: 20,
        value: 15,
    },
    loanDuration: {
        min: 1,
        max: 20,
        value: 10,
    },
    courseDuration: {
        min: 0,
        max: 48,
        value: 24,
    },
    gracePeriod: {
        min: 0,
        max: 12,
        value: 6,
    },
}

exports.APPLICATION_STATUSES = [
    "Initiated",
    "KYC Verification",
    "Credit Assessment",
    "Loan Decision",
    "Processing Fee Payment",
    "Fill Disbursement Request Form",
    "Disbursement in process",
    "Evaluating change request",
    "Disbursed",
]
