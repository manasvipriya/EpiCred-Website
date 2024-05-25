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
            var data = {
                id: $("#id").val(),
                name: form.name.value,
                email: form.email.value,
                dob: form.dob.value,
                phoneNumber: form.phoneNumber.value,
            }

            preloader(true)
            api(method.put, "/user/api/v1/profile", data, function (err, res) {
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
        },
    })
)
$("#dob").attr("max", new Date().toISOString().slice(0, -14))
