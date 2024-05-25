var loanAmount = $("#loanAmount")[0]
var interestPerYear = $("#interest")[0]
var loanDuration = $("#loanDuration")[0]
var courseDuration = $("#courseDuration")[0]
var gracePeriod = $("#gracePeriod")[0]

var emiPerMonthText = $(".emiPerMonth")
var principalAmountText = $(".principalAmount")
var totalInterestChargedText = $(".totalInterestCharged")
var totalAmountText = $(".totalAmount")

$(".form-range").on("input change", function (event) {
    var target = $(this).data("value")
    $(target).val(event.target.value)
    calculate()
})

$(".cal-long-text, .cal-short-text").on("input", function (event) {
    var target = $(this)[0].id.replace("Value", "")
    $("#" + target).val(event.target.value)
    calculate()
})

calculate()

function calculate() {
    var principalAmount = loanAmount.valueAsNumber
    var interest = interestPerYear.valueAsNumber
    var timePeriod = loanDuration.valueAsNumber * 12

    if (gracePeriod.valueAsNumber + courseDuration.valueAsNumber > 0) {
        var data = calculateMoratorium(
            principalAmount,
            interest,
            timePeriod,
            gracePeriod.valueAsNumber + courseDuration.valueAsNumber
        )
        var sameEmi = data.sameEmi
        var emiPerMonth = sameEmi.newEMI
        var totalInterestCharged = emiPerMonth * sameEmi.pendingInstallments - principalAmount
        var totalAmount = principalAmount + totalInterestCharged
        populate({
            emiPerMonth,
            principalAmount: sameEmi.foreclosureAmount,
            totalInterestCharged,
            interest,
            timePeriod: sameEmi.pendingInstallments,
            totalAmount,
            displayPrincipalAmount: principalAmount,
        })
    } else {
        var emiPerMonth = calculateMonthlyPayment(principalAmount, interest, timePeriod)
        var totalInterestCharged = emiPerMonth * timePeriod - principalAmount
        var totalAmount = principalAmount + totalInterestCharged
        populate({
            emiPerMonth,
            principalAmount,
            totalInterestCharged,
            interest,
            timePeriod,
            totalAmount,
            displayPrincipalAmount: totalAmount,
        })
    }
}

function populate({
    emiPerMonth,
    principalAmount,
    totalInterestCharged,
    interest,
    timePeriod,
    totalAmount,
    displayPrincipalAmount,
}) {
    emiPerMonthText.html(formatCurrency(Math.round(emiPerMonth)))
    principalAmountText.html(formatCurrency(Math.round(displayPrincipalAmount)))
    totalInterestChargedText.html(formatCurrency(Math.round(totalInterestCharged)))
    totalAmountText.html(formatCurrency(Math.round(totalAmount)))
    chart(Math.round(principalAmount), Math.round(totalInterestCharged))
    createRepaymentSummary(principalAmount, interest, timePeriod)
}

function chart(principalAmount, totalInterestCharged) {
    Highcharts.chart("chart", {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie",
        },
        title: {
            text: "",
        },
        tooltip: {
            formatter: function () {
                return `<b>${this.key}</b> <br>${formatCurrency(this.y)}`
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: false,
                },
            },
        },
        series: [
            {
                colorByPoint: true,
                data: [
                    {
                        name: "Principal Amount",
                        y: principalAmount,
                        selected: true,
                        color: "#E34731",
                    },
                    {
                        name: "Total Interest",
                        y: totalInterestCharged,
                        color: "#F98575",
                    },
                ],
            },
        ],
    })
}

// calculate the monthly payment
function calculateMonthlyPayment(principalAmount, interest, timePeriod) {
    // var monthlyRate = rate / (12 * 100)
    // var monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term))
    // return monthlyPayment

    var powerFactor = Math.pow(1 + interest / (12 * 100), timePeriod)

    var emiPerMonth = (principalAmount * (interest / (12 * 100)) * powerFactor) / (powerFactor - 1)
    return emiPerMonth
}

// create the loan repayment summary table
function createRepaymentSummary(loanAmount, interestRate, loanTermInMonths) {
    var table = document.getElementById("repaymentTable")

    // empty table
    var tableHeaderRowCount = 1
    var rowCount = table.rows.length
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount)
    }

    let remainingLoanAmount = loanAmount
    var tempLoanAmount = loanAmount
    for (let month = 1; month <= loanTermInMonths; month++) {
        var monthlyPayment = calculateMonthlyPayment(
            remainingLoanAmount,
            interestRate,
            loanTermInMonths - month + 1
        )
        var interestPaid = remainingLoanAmount * (interestRate / (12 * 100))
        var principalRepaid = monthlyPayment - interestPaid
        remainingLoanAmount -= principalRepaid
        var loanPaidPercentage = ((loanAmount - remainingLoanAmount) / loanAmount) * 100
        var newRow = table.insertRow()
        newRow.innerHTML = `
          <td>${month}</td>
          <td>${Math.round(tempLoanAmount)}</td>
          <td>${Math.round(interestPaid)}</td>
          <td>${Math.round(principalRepaid)}</td>
          <td>${Math.round(remainingLoanAmount)}</td>
          <td>${loanPaidPercentage.toFixed(2)}</td>
        `
        console.log($(".show-more-rows")[0].classList)
        if (month > 10 && !$(".show-more-rows")[0].classList.contains("d-none")) {
            newRow.classList.add("summary-table-rows-hidden")
        }
        tempLoanAmount -= principalRepaid
    }
}

function calculateMoratorium(principalAmount, interestRate, loanDuration, gracePeriod) {
    var principal = principalAmount
    var interest = interestRate
    var interestAmount = interest / 100 / 12
    var tenure = loanDuration
    var installments = 0
    var moratoriumMonths = gracePeriod

    // EMI Calculation

    var EMIAmount =
        (principal * interestAmount * Math.pow(1 + interestAmount, tenure)) /
        (Math.pow(1 + interestAmount, tenure) - 1)
    var monthlyEMIAmount = EMIAmount.toFixed(0)

    var totalLoanAmount__ = +tenure * +EMIAmount
    var totalAmount__ = totalLoanAmount__.toFixed(0)

    var totalInterest__ = +totalAmount__ - +principal

    // Loop to Find EMI-NEW
    var openingBalance
    var EMI_OLD = +monthlyEMIAmount
    var closingBalance = +principal
    var interestPaid
    var InterestRate = +interestAmount
    var n

    for (n = 1; n <= +installments; n++) {
        openingBalance = +closingBalance
        interestPaid = +openingBalance * +InterestRate
        closingBalance = +openingBalance - +EMI_OLD + +interestPaid
    }

    while (n <= +installments + +moratoriumMonths) {
        openingBalance = +closingBalance
        interestPaid = +openingBalance * +InterestRate
        closingBalance = +openingBalance + +interestPaid
        n++
    }

    // Foreclosure Calculation
    var foreclosureAmount = +closingBalance
    var newTenure = +tenure - +installments
    var EMI_NEW =
        (+foreclosureAmount * +InterestRate * Math.pow(1 + InterestRate, newTenure)) /
        (Math.pow(1 + InterestRate, newTenure) - 1)

    // Display in Front-end
    var pendingInstallments = tenure - installments
    var paidInstallments = installments

    // With Same EMI
    var currentEMI = monthlyEMIAmount
    var newEMI = EMI_NEW
    var increasedEMI = EMI_NEW - currentEMI
    var oldTenure = tenure
    var updatedTenure = (+principal + +monthlyEMIAmount * +moratoriumMonths) / +monthlyEMIAmount
    var NEW_TENURE = (+EMI_NEW * +tenure) / monthlyEMIAmount
    var tenureDiff = +NEW_TENURE - +oldTenure

    // With Same Tenure
    var updatedEMI =
        (+principal + +monthlyEMIAmount * +moratoriumMonths) / (+tenure - +installments)
    var currentEMITwo = currentEMI
    var currentEMIThree = currentEMI
    var pendingInstallmentsOne = pendingInstallments
    var pendingInstallmentsTwo = pendingInstallments
    var financialImpact = +pendingInstallments * +increasedEMI
    var newIncreasedEMI = increasedEMI

    return {
        sameEmi: {
            currentEMI,
            newEMI,
            increasedEMI,
            oldTenure,
            updatedTenure,
            newTenure: NEW_TENURE,
            tenureDiff: tenureDiff,
            foreclosureAmount,
            pendingInstallments: pendingInstallmentsTwo,
        },
        sameTenure: {
            updatedEMI,
            currentEMITwo,
            currentEMIThree,
            pendingInstallments: pendingInstallmentsTwo,
            financialImpact,
            newIncreasedEMI,
        },
    }
}

$("#showMoreRows").click(function () {
    $(".summary-table-rows-hidden").removeClass("summary-table-rows-hidden")
    $(".show-more-rows").addClass("d-none")
})
