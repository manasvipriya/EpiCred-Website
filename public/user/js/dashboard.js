$(".application-card-status").click(function () {
    // var data = $(this).data("item")

    // var template = render(
    //     `<ul class="p-0 m-0 pl-1">
    //     {% for item in list %}
    //     <li title="{{item.name}} - {{item.text}}">
    //     <i class="loan-status-progress-icon fa {{ 'fa-spinner text-warning' if item.inProgress }} {{ 'fa-check-circle text-success' if item.completed }} {{ 'fa-check-circle text-warning' if not item.completed and not item.inProgress }}"></i>
    //     {{item.name}}
    //     </li>
    //     {% endfor %}
    //     </ul>`,
    //     { list: data }
    // )

    // $("#loanStatusProgressModalBody").html(template)
    // $("#loanStatusProgressModal").modal("show")

    $(this).parent().find(".loan-status-progress").addClass("d-block")
    $(this).addClass("d-none")
})

$(".hide-application-card-status").click(function () {})

$(document).on("click", ".hide-application-card-status", function () {
    console.log($(this).parent())
    $(this).parent().removeClass("d-block")
    $(this).parent().parent().parent().find(".application-card-status").removeClass("d-none")
})
