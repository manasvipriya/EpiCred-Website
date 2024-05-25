module.exports = {
    USER: {
        name: {
            presence: {
                allowEmpty: false,
                message: "^Name is required",
            },
        },
        email: {
            presence: {
                allowEmpty: false,
                message: "^Email is required",
            },
            email: {
                message: "^Email is invalid",
            },
        },
        dob: {
            presence: {
                allowEmpty: false,
                message: "^Date of birth is required",
            },
        },
        phoneNumber: {
            presence: {
                allowEmpty: false,
                message: "^Phone number is required",
            },
            length: {
                minimum: 10,
                maximum: 13,
                tooShort: "^Phone number is invalid",
                tooLong: "^Phone number is invalid",
            },
        },
    },
    LOGIN: {
        email: {
            presence: {
                allowEmpty: false,
                message: "^Email is required",
            },
            email: {
                message: "^Email is invalid",
            },
            length: {
                maximum: 32,
                tooLong: "^Email can be maximum %{count} characters",
            },
        },
        password: {
            presence: {
                allowEmpty: false,
                message: "^Password is required",
            },
            length: {
                minimum: 8,
                tooShort: "^Password must be minimum %{count} characters",
                maximum: 24,
                tooLong: "^Password can be maximum %{count} characters",
            },
        },
    },
    LOAN_APPLICATION: {
        loanAmount: {
            presence: {
                allowEmpty: false,
                message: "^Loan amount is required",
            },
            numericality: {
                greaterThan: 0,
                notGreaterThan: "^Loan amount is invalid",
            },
        },
        preferredCourse: {
            presence: {
                allowEmpty: false,
                message: "^Preferred Course name is required",
            },
        },
        preferredCountry: {
            presence: {
                allowEmpty: false,
                message: "^Preferred Country is required",
            },
        },
        isCollateral: {
            presence: {
                allowEmpty: false,
                message: "^Co-applicant is required",
            },
        },
    },
    LOAN_APPLICATION_COLLATERAL: {
        collateralName: {
            presence: {
                allowEmpty: false,
                message: "^Co-applicant Name is required",
            },
        },
        collateralMonthlyIncome: {
            presence: {
                allowEmpty: false,
                message: "^Co-applicant Monthly Income is required",
            },
            numericality: {
                greaterThan: 0,
                notGreaterThan: "^Co-applicant Monthly Income is invalid",
            },
        },
    },
}
