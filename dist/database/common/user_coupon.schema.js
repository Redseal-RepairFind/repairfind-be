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
exports.UserCouponModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
// Define the UserCoupon schema
var UserCouponSchema = new mongoose_1.Schema({
    promotion: { type: mongoose_1.Schema.Types.ObjectId, ref: 'promotions', required: true }, // Reference to the coupon
    name: { type: String, required: true }, // Name of the coupon
    code: { type: String, required: true, unique: true }, // Coupon code for checkout
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true, refPath: 'userType' }, // Reference to the user
    userType: { type: String, enum: ['contractors', 'customers'], required: true }, // Type of user
    valueType: { type: String, enum: ['fixed', 'percentage'], required: true }, // Type of discount
    value: { type: Number, required: true }, // Coupon value (dollar or percentage)
    applicableAtCheckout: { type: Boolean, default: true }, // Can be applied at checkout
    redeemedAt: { type: Date }, // Optional redeemed date
    expiryDate: { type: Date }, // Expiry date of the coupon
    // active means it can be applied, pending means that its not immediately available, either
    // because its already applied to a pending transaction or its not yet approved 
    status: {
        type: String,
        enum: ['pending', 'expired', 'redeemed', 'active'],
        default: 'pending' // Default status is pending
    }
}, { timestamps: true });
// Export the UserCoupon model
exports.UserCouponModel = mongoose_1.default.model('user_coupons', UserCouponSchema);
