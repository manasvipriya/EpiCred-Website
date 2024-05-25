var myTable = datatables({
    selector: "#table",
    columns: [
        {
            title: "Name",
            data: "user.name",
            defaultContent: "NA",
        },
        {
            title: "Email",
            data: "user.email",
            defaultContent: "NA",
        },
        {
            title: "Country",
            data: "preferredCountry",
        },
        {
            title: "Course",
            data: "preferredCourse",
        },
        {
            title: "Loan Amount",
            data: "loanAmount",
        },
        {
            title: "Status",
            data: "status",
        },
        {
            title: "Created On",
            data: "createdAt",
            render: function (_, __, row) {
                return moment(row.createdAt).format("DD MMM YYYY hh:mm a")
            },
        },
        {
            title: "Actions",
            data: "_id",
            render: function (_, __, row) {
                return [
                    `<a target="_blank" href="/admin/loan-application/${row._id}/view" class="btn btn-sm btn-primary" title="View"><i class="fa fa-eye"></i></a>`,
                    `<a target="_blank" href="/admin/loan-application/${row._id}/edit" class="btn btn-sm btn-primary" title="Edit"><i class="fa fa-edit"></i></a>`,
                    `<button class="btn btn-sm btn-danger delete" title="Delete" data-id="${row._id}"><i class="fa fa-trash"></i></button>`,
                ].join(" ")
            },
            width: "100",
        },
    ],
    url: "/admin/api/v1/loan-applications",
    filterData: {
        userId: new URLSearchParams(location.search).get("userId"),
    },
})

$("#table").on("click", "tbody tr .delete", function () {
    var id = this.dataset.id
    var row = myTable.row($(this).parents("tr"))
    _confirmation("Do you want to delete this loan application?", function (result) {
        if (result) {
            preloader(true)

            api(method.delete, "/admin/api/v1/loan-application/" + id, null, function (err, res) {
                preloader(false)
                if (err) {
                    _error(err.message)
                } else {
                    _success(res.message)
                    row.remove().draw()
                }
            })
        }
    })
})
