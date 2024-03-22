"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var contractorAccountTypes_1 = require("../../../constants/contractorAccountTypes");
var CustomerJobListingchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'CustomerReg',
        required: true,
    },
    jobCategory: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    voiceDescription: {
        type: String,
        default: ''
    },
    jobLocation: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    jobExpiry: {
        type: Date,
        required: true,
    },
    contractorType: {
        type: String,
        enum: [contractorAccountTypes_1.contractorAccountTypes.Company, contractorAccountTypes_1.contractorAccountTypes.Employee, contractorAccountTypes_1.contractorAccountTypes.Individual],
        required: true,
    },
    emergency: {
        type: String,
        enum: ["yes", "no"],
        required: true,
    },
    jobImg: {
        type: String,
        default: ''
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
var CustomerJobListingModel = (0, mongoose_1.model)("CustomerJobListing", CustomerJobListingchema);
exports.default = CustomerJobListingModel;
