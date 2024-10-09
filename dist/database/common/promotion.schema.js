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
exports.PromotionModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
// Define the Promotion schema
var PromotionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    startDate: { type: Date },
    endDate: { type: Date },
    target: {
        type: String,
        enum: ['contractors', 'customers', 'both'],
        default: 'both'
    },
    criteria: { type: String },
    value: { type: Number },
    valueType: { type: String, enum: ['fixed', 'percentage'], required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    }
}, {
    timestamps: true
});
exports.PromotionModel = mongoose_1.default.model('promotions', PromotionSchema);
