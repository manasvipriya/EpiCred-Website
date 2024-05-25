$(".isCollateral").change(function (e) {
    const value = +e.target.value
    if (!value) {
        $(".collateral-data").addClass("d-none")
    } else {
        $(".collateral-data").removeClass("d-none")
    }
})

var form = $("#form").validate({
    errorClass: "input-invalid",
    validClass: "input-success",
    rules: {
        name: {
            required: true,
            minlength: 6,
        },
        email: {
            required: true,
            email: true,
        },
        phoneNumber: {
            required: true,
            minlength: 10,
            maxlength: 10,
        },
        dob: {
            required: true,
        },
        loanAmount: {
            required: true,
        },
        preferredCourse: {
            required: true,
        },
        preferredCountry: {
            required: true,
        },
        isCollateral: {
            required: true,
        },
        collateralName: {
            required: {
                depends: function (e) {
                    return parseInt($("#isCollateral").val())
                },
            },
        },
        collateralMonthlyIncome: {
            required: {
                depends: function (e) {
                    return parseInt($("#isCollateral").val())
                },
            },
        },
    },
    messages: {
        name: {
            required: "Name is required",
            minlength: "Name should be min 6 characters",
        },
        email: {
            required: "Email is required",
            email: "Email is invalid",
        },
        phoneNumber: {
            required: "Phone Number is required",
            minlength: "Phone Number is invalid",
            maxlength: "Phone Number is invalid",
        },
        dob: {
            required: "Date of birth is required",
        },
        loanAmount: {
            required: "Loan amount is required",
        },
        preferredCourse: {
            required: "Course Name is required",
        },
        preferredCountry: {
            required: "Country Name is required",
        },
        isCollateral: {
            required: "select 'Yes' or 'No'",
        },
        collateralName: {
            required: "Name is required",
        },
        collateralMonthlyIncome: {
            required: "Monthly income is required",
        },
    },
    submitHandler: function (form) {
        if (!form.toc.checked) {
            return _error("Accept privacy policy & terms of use")
        }

        var data = {
            name: form.name.value,
            email: form.email.value,
            phoneNumber: form.phoneNumber.value,
            dob: form.dob.value,
            preferredCourse: form.preferredCourse.value,
            preferredCountry: form.preferredCountry.value,
            isCollateral: +form.isCollateral.value,
            collateralName: form.collateralName.value,
            collateralMonthlyIncome: form.collateralMonthlyIncome.value,
            loanAmount: form.loanAmount.value,
        }

        preloader(true)
        api(method.post, "/user/api/v1/check-loan-eligibility", data, function (err, res) {
            preloader(false)
            if (!err && res) {
                form.reset()
                _success(res.message, function () {
                    window.location = "/user/login"
                })
            } else {
                _error(err.message)
            }
        })
    },
})

$(".dob").attr("max", new Date().toISOString().slice(0, -14))
