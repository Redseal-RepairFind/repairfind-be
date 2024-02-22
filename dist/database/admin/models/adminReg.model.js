"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var AdminRegSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    superAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    validation: {
        type: Boolean,
        required: true,
        default: false,
    },
    image: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    passwordOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
}, {
    timestamps: true,
});
var AdminRegrModel = (0, mongoose_1.model)("AdminReg", AdminRegSchema);
exports.default = AdminRegrModel;
