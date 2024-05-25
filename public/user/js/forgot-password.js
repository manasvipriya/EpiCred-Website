$("#form").validate(
    Object.assign(validationClasses, {
        rules: {
            password: {
                required: true,
                minlength: 8,
                maxlength: 24,
            },
            confirmPassword: {
                equalTo: "#password",
                minlength: 8,
                maxlength: 24,
            },
        },
        messages: {
            password: {
                required: "Password is required",
                minlength: "Password must be minimum 8 characters",
                maxlength: "Password must be maximum 24 characters",
            },
            confirmPassword: {
                equalTo: "Password and Confirm Password must match",
                minlength: "Confirm Password must be minimum 8 characters",
                maxlength: "Password must be maximum 24 characters",
            },
        },
        submitHandler: function (form) {
            var data = {
                token: form.token.value,
                password: form.password.value,
                confirmPassword: form.confirmPassword.value,
            }

            api(method.post, "/user/api/v1/change-password", data, (err, res) => {
                if (err) {
                    _error(err.message)
                } else {
                    form.reset()
                    _success(res.message, function () {
                        window.location = "/user/login"
                    })
                }
            })
        },
    })
)
