"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContractorDocumentValidateSchema = new mongoose_1.Schema({
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        default: "",
    },
    // gst: {
    //   type: String,
    //   required: true,
    // },
    tradeTicket: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    skill: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        default: "",
    },
    // validId: {
    //   type: String,
    //   required: true,
    // },
    yearExpirence: {
        type: String,
        required: true,
    },
    nationIdImage: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    certnId: {
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
var ContractorDocumentValidateModel = (0, mongoose_1.model)("ContractorDocumetValidation", ContractorDocumentValidateSchema);
exports.default = ContractorDocumentValidateModel;
