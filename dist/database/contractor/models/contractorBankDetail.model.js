"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var BankDetailSchema = new mongoose_1.Schema({
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
    },
    financialInstitution: {
        type: String,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    transitNumber: {
        type: String,
    },
    financialInstitutionNumber: {
        type: String,
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
var BankDeatilModel = (0, mongoose_1.model)("BankDetail", BankDetailSchema);
exports.default = BankDeatilModel;
