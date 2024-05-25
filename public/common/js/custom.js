$(".preloader").hide()
// this is for close icon when navigation open in mobile view
$(".nav-toggler").on("click", function () {
    $("#main-wrapper").toggleClass("show-sidebar")
    $(".nav-toggler i").toggleClass("fa-times")
})
$(".search-box a, .search-box .app-search .srh-btn").on("click", function () {
    $(".app-search").toggle(200)
    $(".app-search input").focus()
})

// ==============================================================
// Resize all elements
// ==============================================================
$("body, .page-wrapper").trigger("resize")
// $(".page-wrapper").delay(20).show()

//****************************
/* This is for the mini-sidebar if width is less then 1170*/
//****************************
var setsidebartype = function () {
    var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width
    if (width < 1170) {
        $("#main-wrapper").attr("data-sidebartype", "mini-sidebar")
    } else {
        $("#main-wrapper").attr("data-sidebartype", "full")
    }
}
$(window).ready(setsidebartype)
$(window).on("resize", setsidebartype)

var validationClasses = {
    errorClass: "input-invalid",
    validClass: "input-success",
}

function getHeaders() {
    var headers = {}

    try {
        var token = localStorage.getItem("token")
        headers["Authorization"] = token
        headers["ReqType"] = "API"
    } catch (error) {}

    return headers
}

var method = {
    post: "POST",
    get: "GET",
    patch: "PATCH",
    delete: "DELETE",
    put: "PUT",
}

function api(method, httpUrl, body, callback) {
    body = body || {}

    $.ajax({
        type: method.toUpperCase(),
        url: httpUrl,
        headers: getHeaders(),
        data: JSON.stringify(body),
        contentType: "application/json",
        success: function (data, xhr, result) {
            callback(null, data)
        },
        error: function (xhr, textStatus, errorThrown) {
            try {
                callback(JSON.parse(xhr.responseText))
            } catch (error) {
                callback({ status: 400, message: "Unknown Error", success: false })
            }
        },
    })
}


function render(template, data) {
    try {
        nunjucksEnv = nunjucks.configure({ autoescape: true })
        if (!data) {
            data = {}
        }
    
        if (!template) {
            throw Error("A template string must be passed to render function")
        }
    
        return nunjucks.renderString(template, data)
    } catch (error) {
        
    }
}

function datatables(options) {
    const { selector, columns = [], url, filterData = {}, searchDelay = 1500, order = [] } = options

    const defaultOptions = {
        destroy: true,
        processing: true,
        serverSide: true,
        autoWidth: false,
        searchDelay: searchDelay,
        ajax: {
            url: url,
            headers: getHeaders(),
            type: method.post,
            async: true,
            data: filterData,
            dataSrc: function (res) {
                return res.data
            },
        },
        columns: columns,
        order: order,
    }

    return $(selector).DataTable(defaultOptions)
}

function _success(message, cb) {
    swal("Success", message, "success").then(function (result) {
        if (typeof cb === "function") {
            cb(result)
        }
    })
}

function _confirmation(message, cb) {
    swal({
        title: "Confirmation",
        text: message,
        icon: "info",
        buttons: true,
        dangerMode: true,
    }).then((result) => {
        if (typeof cb === "function") {
            cb(result)
        }
    })
}

function _error(message) {
    swal("Error", message, "error")
}

$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop()
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName)
})

function preloader(show) {
    if (show) {
        return $(".preloader").show()
    }

    return $(".preloader").hide()
}

function userLogout() {
    api(method.get, "/user/api/v1/logout", null, (err, data) => {
        localStorage.removeItem("token")
        location.href = "/"
    })
}

function adminLogout() {
    api(method.get, "/admin/api/v1/logout", null, (err, data) => {
        localStorage.removeItem("token")
        location.href = "/admin"
    })
}

function formatCurrency(number) {
    return "₹ " + new Intl.NumberFormat("en-IN").format(number)
}

$(".only-number").on("input", function () {
    this.value = this.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1")
        .replace(/^0[^.]/, "0")
})

$(".only-text").on("input", function () {
    this.value = this.value.replace(/[^a-zA-Z ]+/g, "")
})
