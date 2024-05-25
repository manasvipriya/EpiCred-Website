const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    loanAmount: {
        type: Number,
        required: true,
        index: true,
    },
    preferredCourse: {
        type: String,
        required: true,
        index: true,
    },
    preferredCountry: {
        type: String,
        required: true,
        index: true,
    },
    isCollateral: {
        type: Boolean,
        required: true,
    },
    collateralName: {
        type: String,
        index: true,
    },
    collateralMonthlyIncome: {
        type: Number,
        index: true,
    },
    status: {
        type: String,
        default: "Pending",
        index: true,
    },
    comments: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

schema.index({ preferredCountry: "text", preferredCourse: "text", status: "text" })

module.exports = mongoose.model("applications", schema)
