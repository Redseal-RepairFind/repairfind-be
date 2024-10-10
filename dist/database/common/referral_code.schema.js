"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
// Define the Referral Usage schema
var ReferralUsageSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'usage.userType',
    },
    userType: {
        type: String,
        required: true,
        enum: ['customers', 'contractors'], // Define allowed values for the user type
    },
    date: {
        type: Date,
        default: Date.now,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed, // Flexible field to store any additional information
    },
});
// Define the main Referral schema
var ReferralSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'userType',
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ['customers', 'contractors'], // Define allowed values for user type
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    usage: [ReferralUsageSchema] // Array of usage records
}, {
    timestamps: true
});
// Create and export the model
exports.ReferralModel = mongoose_1.default.model('Referral', ReferralSchema);
