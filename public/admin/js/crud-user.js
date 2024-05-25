var profile = $("#form").validate(
    Object.assign(validationClasses, {
        rules: {
            name: {
                required: true,
                minlength: 6,
                maxlength: 100,
            },
            email: {
                email: true,
                required: true,
            },
            phoneNumber: {
                required: true,
                minlength: 10,
                maxlength: 13,
            },
            dob: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Name is required",
                minlength: "Name must be minimum 6 characters",
                maxlength: "Name must be maximum 100 characters",
            },
            email: {
                email: "Email is invalid",
                required: "Email is required",
            },
            phoneNumber: {
                required: "Phone number is required",
                minlength: "Phone number is invalid",
                maxlength: "Phone number is invalid",
            },
            dob: {
                required: "Date of birth is required",
            },
        },
        submitHandler: function (form) {
            var id = $("#id").val()
            var data = {
                name: form.name.value,
                email: form.email.value,
                dob: form.dob.value,
                phoneNumber: form.phoneNumber.value,
                active: form.active.value == 1,
            }

            preloader(true)

            if (id) {
                api(method.put, "/admin/api/v1/user/" + id, data, function (err, res) {
                    preloader(false)
                    if (err) {
                        _error(err.message)
                    } else {
                        _success(res.message)
                        setTimeout(() => {
                            location.reload()
                        }, 1000)
                    }
                })
            } else {
                api(method.post, "/admin/api/v1/user", data, function (err, res) {
                    preloader(false)
                    if (err) {
                        _error(err.message)
                    } else {
                        _success(res.message)
                        setTimeout(() => {
                            window.location.href = "/admin/user/" + res.data.id + "/edit"
                        }, 1000)
                    }
                })
            }
        },
    })
)
