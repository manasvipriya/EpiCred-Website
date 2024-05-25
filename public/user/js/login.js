var form = $("#form").validate(
    Object.assign({
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 8,
                maxlength: 24,
            },
        },
        messages: {
            email: {
                required: "Email is required",
                email: "Email is invalid",
            },
            password: {
                required: "Password is required",
                minlength: "Password is invalid",
                maxlength: "Password is invalid",
            },
        },
        submitHandler: function (e) {
            if (form.valid()) {
                var data = {
                    email: e.email.value,
                    password: e.password.value,
                }
                preloader(true)
                api(method.post, "/user/api/v1/login", data, function (err, res) {
                    preloader(false)
                    if (err) {
                        _error(err.message)
                    } else {
                        localStorage.setItem("token", res.data.token)
                        _success(res.message)
                        setTimeout(function () {
                            location.href = "/user/dashboard"
                        }, 1000)
                    }
                })
            }
        },
    })
)

$("#forgotPasswordForm").submit(function (e) {
    $("#forgotPasswordModal").modal("hide")
    preloader(true)
    api(
        method.post,
        "/user/api/v1/forgot-password-email",
        { email: $("#forgotPasswordEmail").val() },
        function (err, res) {
            preloader(false)
            if (err) {
                _error(err.message)
            } else {
                $("#forgotPasswordEmail").val("")
                _success(res.message, function () {
                    window.location = "/"
                })
            }
        }
    )
})
