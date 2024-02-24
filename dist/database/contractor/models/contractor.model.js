"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorModel = void 0;
var mongoose_1 = require("mongoose");
var constants_1 = require("../../../constants");
var contractorStatus_1 = require("../../../constants/contractorStatus");
var ContractorSchema = new mongoose_1.Schema({
    profile: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "contractor_profiles",
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    companyName: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(contractorStatus_1.contractorStatus),
        default: contractorStatus_1.contractorStatus.REVIEWING,
    },
    phoneNumber: {
        type: String
    },
    acceptTerms: {
        type: Boolean
    },
    accountType: {
        type: String,
        enum: Object.values(constants_1.contractorAccountTypes),
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Rest of your schema
ContractorSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passwordOtp;
        return ret;
    }
});
exports.ContractorModel = (0, mongoose_1.model)("contractors", ContractorSchema);
