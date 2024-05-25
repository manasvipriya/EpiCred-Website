const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        unqiue: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
        index: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
    role: {
        type: Number,
        default: 2,
    },
    token: {
        type: String,
        default: null,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: true,
    },
})

schema.index({ name: "text", email: "text", phoneNumber: "text", dob: "text" })

module.exports = mongoose.model("users", schema)
