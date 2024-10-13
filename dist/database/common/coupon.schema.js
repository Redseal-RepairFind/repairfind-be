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
exports.CouponModel = exports.COUPON_STATUS = exports.COUPON_VALUE_TYPE = exports.COUPON_TYPE = void 0;
var mongoose_1 = __importStar(require("mongoose"));
/**
 * Coupon Model Definitions
 *
 * This module defines the structure and schema for coupons in the application.
 *
 * Enums:
 * - COUPON_TYPE: Represents the types of coupons (e.g., REFERRAL_BONUS, SERVICE_FEE_DISCOUNT).
 * - COUPON_VALUE_TYPE: Represents the value types of coupons (e.g., FIXED, PERCENTAGE).
 * - COUPON_STATUS: Represents the status of a coupon (e.g., PENDING, EXPIRED, REDEEMED, ACTIVE).
 *
 * Interface:
 * - ICoupon: Represents a coupon with the following properties:
 *   - promotion: Reference to the promotion (Schema.Types.ObjectId).
 *   - name: Name of the coupon (e.g., 'Referral Bonus' or 'Early User Discount').
 *   - code: Unique coupon code to be applied at checkout (e.g., 'REFER25', 'EARLY50').
 *   - user: Reference to the user (Schema.Types.ObjectId).
 *   - type: Coupon type (e.g., REFERRAL_BONUS, SERVICE_FEE_DISCOUNT).
 *   - userType: Type of user (either 'contractors' or 'customers').
 *   - valueType: Type of value (either FIXED or PERCENTAGE).
 *   - value: Amount in dollars or percentage (e.g., 25 for $25 or 50 for 50%).
 *   - applicableAtCheckout: Ensures the coupon can be applied during checkout.
 *   - redeemedAt: Date when the coupon is redeemed (optional).
 *   - expiryDate: Expiration date of the coupon.
 *   - status: The status of the coupon (e.g., 'pending', 'expired', 'redeemed', 'active').
 *
 * Schema:
 * - CouponSchema: Defines the Mongoose schema for the ICoupon interface, including validation rules.
 */
var COUPON_TYPE;
(function (COUPON_TYPE) {
    COUPON_TYPE["REFERRAL_BONUS"] = "REFERRAL_BONUS";
    COUPON_TYPE["SERVICE_FEE_DISCOUNT"] = "SERVICE_FEE_DISCOUNT";
})(COUPON_TYPE || (exports.COUPON_TYPE = COUPON_TYPE = {}));
var COUPON_VALUE_TYPE;
(function (COUPON_VALUE_TYPE) {
    COUPON_VALUE_TYPE["FIXED"] = "FIXED";
    COUPON_VALUE_TYPE["PERCENTAGE"] = "PERCENTAGE";
})(COUPON_VALUE_TYPE || (exports.COUPON_VALUE_TYPE = COUPON_VALUE_TYPE = {}));
var COUPON_STATUS;
(function (COUPON_STATUS) {
    COUPON_STATUS["PENDING"] = "PENDING";
    COUPON_STATUS["INUSE"] = "INUSE";
    COUPON_STATUS["EXPIRED"] = "EXPIRED";
    COUPON_STATUS["REDEEMED"] = "REDEEMED";
    COUPON_STATUS["ACTIVE"] = "ACTIVE";
})(COUPON_STATUS || (exports.COUPON_STATUS = COUPON_STATUS = {}));
// Define the Coupon schema
var CouponSchema = new mongoose_1.Schema({
    promotion: { type: mongoose_1.Schema.Types.ObjectId, ref: 'promotions', required: true },
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, refPath: 'userType' },
    userType: { type: String, enum: ['contractors', 'customers'], required: true },
    type: { type: String, enum: Object.values(COUPON_TYPE), required: true },
    valueType: { type: String, enum: Object.values(COUPON_VALUE_TYPE), required: true },
    value: { type: Number, required: true },
    applicableAtCheckout: { type: Boolean, default: true },
    redeemedAt: { type: Date },
    expiryDate: { type: Date },
    status: {
        type: String,
        enum: Object.values(COUPON_STATUS),
        default: COUPON_STATUS.PENDING
    }
}, { timestamps: true });
// Export the Coupon model
exports.CouponModel = mongoose_1.default.model('coupons', CouponSchema);
