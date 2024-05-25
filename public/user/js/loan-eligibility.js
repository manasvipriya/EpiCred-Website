$(".isCollateral").change(function (e) {
    const value = +e.target.value
    if (!value) {
        $(".collateral-data").addClass("d-none")
    } else {
        $(".collateral-data").removeClass("d-none")
    }
})

var letPartOne = $("#letPartOne").validate({
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
    },
    submitHandler: function (form) {
        performStep("two", "Step 2")
    },
})

var letPartTwo = $("#letPartTwo").validate({
    errorClass: "input-invalid",
    validClass: "input-success",
    rules: {
        loanAmount: {
            required: true,
        },
        preferredCourse: {
            required: true,
        },
        preferredCountry: {
            required: true,
        },
    },
    messages: {
        loanAmount: {
            required: "Loan amount is required",
        },
        preferredCourse: {
            required: "Preferred Course Name is required",
        },
        preferredCountry: {
            required: "Preferred Country Name is required",
        },
    },
    submitHandler: function (form) {
        performStep("three", "Step 3")
    },
})

var letPartThree = $("#letPartThree").validate({
    errorClass: "input-invalid",
    validClass: "input-success",
    rules: {
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
        isCollateral: {
            required: "Please select collateral 'Yes' or 'No'",
        },
        collateralName: {
            required: "Co-applicant name is required",
        },
        collateralMonthlyIncome: {
            required: "Co-applicant monthly income is required",
        },
    },
    submitHandler: function (form) {
        if (!form.toc.checked) {
            return _error("Accept privacy policy & terms of use")
        }

        var data = {
            name: letPartOne.currentForm.name.value,
            email: letPartOne.currentForm.email.value,
            phoneNumber: letPartOne.currentForm.phoneNumber.value,
            dob: letPartOne.currentForm.dob.value,
            preferredCourse: letPartTwo.currentForm.preferredCourse.value,
            preferredCountry: letPartTwo.currentForm.preferredCountry.value,
            loanAmount: letPartTwo.currentForm.loanAmount.value,
            isCollateral: +letPartThree.currentForm.isCollateral.value,
            collateralName: letPartThree.currentForm.collateralName.value,
            collateralMonthlyIncome: letPartThree.currentForm.collateralMonthlyIncome.value,
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

function performStep(className, step) {
    $(".le-part").addClass("d-none")
    $(".le-part-" + className).removeClass("d-none")
    $(".le-status-" + className).addClass("bg-primary")
    $("#leStep").text(step)
}

$("#dob").attr("max", new Date().toISOString().slice(0, -14))
