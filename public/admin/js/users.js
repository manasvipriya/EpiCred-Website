var myTable = datatables({
    selector: "#table",
    columns: [
        {
            title: "Name",
            data: "name",
        },
        {
            title: "Email",
            data: "email",
        },
        {
            title: "Phone Number",
            data: "phoneNumber",
        },
        {
            title: "DoB",
            data: "dob",
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
                    `<a target="_blank" href="/admin/user/${row._id}/view" class="btn btn-sm btn-primary" title="View"><i class="fa fa-eye"></i></a>`,
                    `<a target="_blank" href="/admin/user/${row._id}/edit" class="btn btn-sm btn-primary" title="Edit"><i class="fa fa-edit"></i></a>`,
                    `<a target="_blank" href="/admin/loan-applications?userId=${row._id}" class="btn btn-sm btn-primary" title="Loan Applications"><i class="fa fa-dollar-sign"></i></a>`,
                    `<a target="_blank" href="/admin/loan-application/create?userId=${row._id}" class="btn btn-sm btn-primary" title="Add Loan Application"><i class="fa fa-plus"></i></a>`,
                    `<button type="button" class="btn btn-sm btn-danger delete" title="Delete" data-id="${row._id}"><i class="fa fa-trash"></i></button>`,
                ].join(" ")
            },
        },
    ],
    url: "/admin/api/v1/users",
    filterData: {},
    order: [[5, "desc"]],
})

$("#table").on("click", "tbody tr .delete", function () {
    const id = this.dataset.id
    var row = myTable.row($(this).parents("tr"))

    _confirmation(
        "Do you want to delete this user? It will also delete the loan applications associated with them.",
        function (result) {
            if (result) {
                preloader(true)

                api(method.delete, "/admin/api/v1/user/" + id, null, function (err, res) {
                    preloader(false)
                    if (err) {
                        _error(err.message)
                    } else {
                        _success(res.message)
                        row.remove().draw()
                    }
                })
            }
        }
    )
})
