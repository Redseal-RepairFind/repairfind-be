"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContractorRatingSchema = new mongoose_1.Schema({
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
    },
    rate: [
        {
            customerId: { type: String, },
            jobId: { type: String, },
            cleanliness: { type: Number, },
            timeliness: { type: Number, },
            skill: { type: Number, },
            communication: { type: Number, },
            courteous: { type: Number, },
            cleanlinessText: { type: String, },
            timelinessText: { type: String, },
            skillText: { type: String, },
            communicationText: { type: String, },
            courteousText: { type: String, },
        }
    ],
    avgCleanliness: {
        type: Number,
        required: true,
    },
    avgTimeliness: {
        type: Number,
        required: true,
    },
    avgSkill: {
        type: Number,
        required: true,
    },
    avgCommunication: {
        type: Number,
        required: true,
    },
    avgCourteous: {
        type: Number,
        required: true,
    },
    avgRating: {
        type: Number,
        required: true,
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
var ContractorRatingModel = (0, mongoose_1.model)("ContractorRating", ContractorRatingSchema);
exports.default = ContractorRatingModel;
