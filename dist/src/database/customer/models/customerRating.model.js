"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CustomerRatingSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'CustomerReg',
        required: true,
    },
    rate: [
        {
            contractorId: { type: String, },
            jobId: { type: String, },
            environment: { type: Number, },
            receptive: { type: Number, },
            courteous: { type: Number, },
            environmentText: { type: String, },
            receptiveText: { type: String, },
            courteousText: { type: String, },
        }
    ],
    avgEnvironment: {
        type: Number,
        required: true,
    },
    avgReceptive: {
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
var CustomerRatingModel = (0, mongoose_1.model)("CustomerRating", CustomerRatingSchema);
exports.default = CustomerRatingModel;
