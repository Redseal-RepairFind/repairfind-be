"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorProfileModel = void 0;
var mongoose_1 = require("mongoose");
var config_1 = require("../../../config");
// Define subdocument schemas
var ContractorLocationSchema = new mongoose_1.Schema({
    address: String,
    city: String,
    region: String,
    country: String,
    latitude: String,
    longitude: String,
});
var ContractorJobPhotoSchema = new mongoose_1.Schema({
    url: String,
    description: String,
    mime: String,
    size: String,
    title: String,
});
var ContractorJobVideoSchema = new mongoose_1.Schema({
    url: String,
    description: String,
    mime: String,
    size: String,
    title: String,
});
// Subdocument schema for bank details
var BankDetailsSchema = new mongoose_1.Schema({
    institutionName: String,
    transitNumber: String,
    institutionNumber: String,
    accountNumber: String,
});
var CompanyProfileSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "contractors",
        required: true,
    },
    gstName: {
        type: String,
    },
    gstNumber: {
        type: String,
        required: false,
    },
    gstType: {
        type: String,
    },
    profileType: {
        type: String,
    },
    location: {
        type: ContractorLocationSchema,
    },
    backgroundCheckConsent: {
        type: Boolean,
    },
    skill: {
        type: String,
    },
    website: {
        type: String,
    },
    email: {
        type: String,
    },
    experienceYear: {
        type: Number,
    },
    availableDays: {
        type: [String],
    },
    isOffDuty: {
        type: Boolean,
        default: false,
    },
    about: {
        type: String,
    },
    emergencyJobs: {
        type: Boolean,
    },
    previousJobPhotos: {
        type: [ContractorJobPhotoSchema],
    },
    previousJobVideos: {
        type: [ContractorJobVideoSchema],
    },
    bankDetails: {
        type: BankDetailsSchema, // Embed the BankDetails subdocument
    },
    certnId: {
        type: String,
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
exports.ContractorProfileModel = (0, mongoose_1.model)(config_1.config.mongodb.collections.contractor_profiles, CompanyProfileSchema);
