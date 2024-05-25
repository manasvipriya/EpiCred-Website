const { APPLICATION_STATUS_COLOR, APPLICATION_STATUSES } = require("../shared/constants")

exports.transformApplications = (items) => {
    const transform = (item) => {
        const currentStatus = []

        const currentStatusIndex = APPLICATION_STATUSES.findIndex(
            (status) => status === item.status
        )

        APPLICATION_STATUSES.forEach((status, index) => {
            const completed = index < currentStatusIndex
            const inProgress = index === currentStatusIndex
            let text = "Pending"

            if (completed) {
                text = "Completed"
            } else if (inProgress) {
                text = "In Progress"
            }

            currentStatus.push({
                name: status,
                completed: completed,
                inProgress: inProgress,
                text: text,
            })
        })

        return {
            ...item,
            collateralName: item.collateralName || "NA",
            collateralMonthlyIncome: item.collateralMonthlyIncome || "NA",
            currentStatus: currentStatus,
        }
    }

    if (Array.isArray(items)) {
        return items.map((data) => transform(data))
    }

    return transform(items)
}
