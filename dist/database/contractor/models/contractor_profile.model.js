"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorProfileModel = void 0;
var mongoose_1 = require("mongoose");
var config_1 = require("../../../config");
// Define subdocument schemas
var IContractorLocationSchema = new mongoose_1.Schema({
    address: String,
    city: String,
    region: String,
    country: String,
    latitude: String,
    longitude: String,
});
var IContractorJobPhotoSchema = new mongoose_1.Schema({
    url: String,
    description: String,
    mime: String,
    size: String,
    title: String,
});
var IContractorJobVideoSchema = new mongoose_1.Schema({
    url: String,
    description: String,
    mime: String,
    size: String,
    title: String,
});
var CompanyProfileSchema = new mongoose_1.Schema({
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: config_1.config.mongodb.collections.contractors,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    gstNumber: {
        type: String,
        required: true,
    },
    gstType: {
        type: String,
    },
    profileType: {
        type: String,
    },
    location: {
        type: IContractorLocationSchema,
    },
    backgrounCheckConsent: {
        type: Boolean,
    },
    skill: {
        type: String,
    },
    website: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    experienceYear: {
        type: Number,
    },
    availableDays: {
        type: Array,
        items: {
            type: String,
        },
    },
    about: {
        type: String,
    },
    profilePhoto: {
        type: Object,
    },
    emergencyJobs: {
        type: Boolean,
    },
    previousJobPhotos: {
        type: [IContractorJobPhotoSchema],
    },
    previousJobVideos: {
        type: [IContractorJobVideoSchema],
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
