"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CustomerSchema = new mongoose_1.Schema({
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
    phoneNumber: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: "",
    },
    profileImg: {
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
    phoneNumberOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    acceptTerms: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
}, {
    timestamps: true,
});
CustomerSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passwordOtp;
        delete ret.phoneNumberOtp;
        return ret;
    }
});
var CustomerModel = (0, mongoose_1.model)("customers", CustomerSchema);
exports.default = CustomerModel;
