"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContractorAvailabilitySchema = new mongoose_1.Schema({
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
    },
    avialable: {
        type: String,
        enum: ["yes", "no"],
    },
    time: {
        from: String,
        to: String,
        sos: Boolean,
        day: String,
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
var ContractorAvailabilityModel = (0, mongoose_1.model)("ContractorAvailbility", ContractorAvailabilitySchema);
exports.default = ContractorAvailabilityModel;
