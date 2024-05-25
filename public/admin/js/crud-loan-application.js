$("#isCollateral").change(function (e) {
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
        loanAmount: {
            required: "Loan amount is required",
        },
        preferredCourse: {
            required: "Preferred Course Name is required",
        },
        preferredCountry: {
            required: "Preferred Country Name is required",
        },
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
        var id = $("#id").val()

        var data = {
            userId: new URLSearchParams(location.search).get("userId"),
            preferredCourse: form.preferredCourse.value,
            preferredCountry: form.preferredCountry.value,
            isCollateral: +form.isCollateral.value,
            collateralName: form.collateralName.value,
            collateralMonthlyIncome: form.collateralMonthlyIncome.value,
            loanAmount: form.loanAmount.value,
            status: form.status.value,
            comments: form.comments.value,
        }

        if (id) {
            preloader(true)
            api(method.put, "/admin/api/v1/loan-application/" + id, data, function (err, res) {
                preloader(false)
                if (!err && res) {
                    _success(res.message, function (result) {
                        location.reload()
                    })
                } else {
                    _error(err.message)
                }
            })
        } else {
            preloader(true)
            api(method.post, "/admin/api/v1/loan-application", data, function (err, res) {
                preloader(false)
                if (!err && res) {
                    _success(res.message, function () {
                        window.location.href = "/admin/loan-application/" + res.data.id + "/edit"
                    })
                } else {
                    _error(err.message)
                }
            })
        }
    },
})
