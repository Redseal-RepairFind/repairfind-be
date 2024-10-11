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
exports.PromotionModel = exports.PROMOTION_TARGET = exports.PROMOTION_VALUE_TYPE = exports.PROMOTION_STATUS = void 0;
var mongoose_1 = __importStar(require("mongoose"));
// Define exportable enums
var PROMOTION_STATUS;
(function (PROMOTION_STATUS) {
    PROMOTION_STATUS["ACTIVE"] = "ACTIVE";
    PROMOTION_STATUS["INACTIVE"] = "INACTIVE";
})(PROMOTION_STATUS || (exports.PROMOTION_STATUS = PROMOTION_STATUS = {}));
var PROMOTION_VALUE_TYPE;
(function (PROMOTION_VALUE_TYPE) {
    PROMOTION_VALUE_TYPE["FIXED"] = "FIXED";
    PROMOTION_VALUE_TYPE["PERCENTAGE"] = "PERCENTAGE";
})(PROMOTION_VALUE_TYPE || (exports.PROMOTION_VALUE_TYPE = PROMOTION_VALUE_TYPE = {}));
var PROMOTION_TARGET;
(function (PROMOTION_TARGET) {
    PROMOTION_TARGET["CONTRACTORS"] = "CONTRACTORS";
    PROMOTION_TARGET["CUSTOMERS"] = "CUSTOMERS";
    PROMOTION_TARGET["BOTH"] = "BOTH";
})(PROMOTION_TARGET || (exports.PROMOTION_TARGET = PROMOTION_TARGET = {}));
// Define the Promotion schema
var PromotionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    startDate: { type: Date },
    endDate: { type: Date },
    target: {
        type: String,
        enum: Object.values(PROMOTION_TARGET), // Reference the enum
        default: PROMOTION_TARGET.BOTH, // Default value from enum
    },
    criteria: { type: String },
    value: { type: Number },
    valueType: {
        type: String,
        enum: Object.values(PROMOTION_VALUE_TYPE), // Reference the enum
        required: true
    },
    description: { type: String },
    status: {
        type: String,
        enum: Object.values(PROMOTION_STATUS), // Reference the enum
        default: PROMOTION_STATUS.INACTIVE, // Default value from enum
    },
    contractorLimit: { type: Number },
    customerLimit: { type: Number },
}, {
    timestamps: true,
});
exports.PromotionModel = mongoose_1.default.model('promotions', PromotionSchema);
