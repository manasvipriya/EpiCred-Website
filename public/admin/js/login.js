$("#login").submit(function () {
    var data = {
        email: $("#email").val(),
        password: $("#password").val(),
    }

    api(method.post, "/admin/api/v1/login", data, (err, res) => {
        if (!err && res) {
            localStorage.setItem("token", res.data.token)
            _success(res.message)

            setTimeout(() => {
                location.href = "/admin/"
            }, 2000)
        } else {
            _error(err.message)
        }
    })
})
