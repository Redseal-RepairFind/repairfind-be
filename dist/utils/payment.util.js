"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentUtil = void 0;
var coupon_schema_1 = require("../database/common/coupon.schema");
var calculateCharges = function (_a) {
    var totalEstimateAmount = _a.totalEstimateAmount, customerDiscount = _a.customerDiscount, contractorDiscount = _a.contractorDiscount;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, subtotal, repairfindServiceFee, gstAmount, totalAmount, customerPayable, contractorPayable, customerProcessingFee, contractorProcessingFee, siteVisitAmount, customerDiscountValue, contractorDiscountValue, repairfindServiceFeeRate, customerProcessingFeeRate, contractorProcessingFeeRate, gstRate, _c, customerCoupon, contractorCoupon;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = Array(15).fill(0), subtotal = _b[0], repairfindServiceFee = _b[1], gstAmount = _b[2], totalAmount = _b[3], customerPayable = _b[4], contractorPayable = _b[5], customerProcessingFee = _b[6], contractorProcessingFee = _b[7], siteVisitAmount = _b[8], customerDiscountValue = _b[9], contractorDiscountValue = _b[10], repairfindServiceFeeRate = _b[11], customerProcessingFeeRate = _b[12], contractorProcessingFeeRate = _b[13], gstRate = _b[14];
                    // Set service fee rates based on total estimate amount
                    if (totalEstimateAmount <= 5000) {
                        repairfindServiceFeeRate = 10;
                    }
                    else if (totalEstimateAmount <= 10000) {
                        repairfindServiceFeeRate = 8;
                    }
                    else {
                        repairfindServiceFeeRate = 5;
                    }
                    customerProcessingFeeRate = 3;
                    contractorProcessingFeeRate = 3;
                    gstRate = 5;
                    repairfindServiceFee = parseFloat(((repairfindServiceFeeRate / 100) * totalEstimateAmount).toFixed(2));
                    return [4 /*yield*/, Promise.all([
                            (customerDiscount === null || customerDiscount === void 0 ? void 0 : customerDiscount.coupon) ? coupon_schema_1.CouponModel.findById(customerDiscount.coupon).select('type _id name') : null,
                            (contractorDiscount === null || contractorDiscount === void 0 ? void 0 : contractorDiscount.coupon) ? coupon_schema_1.CouponModel.findById(contractorDiscount.coupon).select('type _id name') : null
                        ])];
                case 1:
                    _c = _d.sent(), customerCoupon = _c[0], contractorCoupon = _c[1];
                    // Calculate customer discount based on valueType
                    if (customerDiscount) {
                        if (customerDiscount.valueType === coupon_schema_1.COUPON_VALUE_TYPE.FIXED) {
                            customerDiscountValue = customerDiscount.value;
                        }
                        else if (customerDiscount.valueType === coupon_schema_1.COUPON_VALUE_TYPE.PERCENTAGE) {
                            customerDiscountValue = parseFloat(((customerDiscount.value / 100) * totalEstimateAmount).toFixed(2));
                        }
                        // Ensure discount doesn't exceed total amount
                        customerDiscountValue = Math.min(customerDiscountValue, totalEstimateAmount);
                    }
                    // Calculate contractor discount based on valueType
                    if (contractorDiscount) {
                        if (contractorDiscount.valueType === coupon_schema_1.COUPON_VALUE_TYPE.FIXED) {
                            contractorDiscountValue = contractorDiscount.value;
                        }
                        else if (contractorDiscount.valueType === coupon_schema_1.COUPON_VALUE_TYPE.PERCENTAGE) {
                            contractorDiscountValue = parseFloat(((contractorDiscount.value / 100) * repairfindServiceFee).toFixed(2));
                        }
                        // Ensure discount doesn't exceed total amount
                        contractorDiscountValue = Math.min(contractorDiscountValue, repairfindServiceFee);
                    }
                    customerProcessingFee = parseFloat(((customerProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
                    contractorProcessingFee = parseFloat(((contractorProcessingFeeRate / 100) * totalEstimateAmount).toFixed(2));
                    gstAmount = parseFloat(((gstRate / 100) * totalEstimateAmount).toFixed(2));
                    subtotal = totalEstimateAmount;
                    customerPayable = parseFloat((subtotal + customerProcessingFee + gstAmount - customerDiscountValue).toFixed(2));
                    contractorPayable = parseFloat((subtotal + gstAmount - (contractorProcessingFee + (repairfindServiceFee - contractorDiscountValue))).toFixed(2));
                    return [2 /*return*/, {
                            subtotal: subtotal,
                            gstAmount: gstAmount,
                            customerPayable: customerPayable,
                            contractorPayable: contractorPayable,
                            repairfindServiceFee: repairfindServiceFee,
                            customerProcessingFee: customerProcessingFee,
                            contractorProcessingFee: contractorProcessingFee,
                            // Return rates as well
                            gstRate: gstRate,
                            repairfindServiceFeeRate: repairfindServiceFeeRate,
                            contractorProcessingFeeRate: contractorProcessingFeeRate,
                            customerProcessingFeeRate: customerProcessingFeeRate,
                            // Correctly apply customer and contractor discounts
                            customerDiscount: (customerDiscount === null || customerDiscount === void 0 ? void 0 : customerDiscount.value)
                                ? {
                                    coupon: customerCoupon,
                                    amount: customerDiscountValue,
                                    value: customerDiscount.value,
                                    valueType: customerDiscount.valueType,
                                    appliedOn: 'totalEstimateAmount' // Indicating where it was applied
                                }
                                : null,
                            contractorDiscount: (contractorDiscount === null || contractorDiscount === void 0 ? void 0 : contractorDiscount.value)
                                ? {
                                    coupon: contractorCoupon,
                                    amount: contractorDiscountValue,
                                    value: contractorDiscount.value,
                                    valueType: contractorDiscount.valueType,
                                    appliedOn: 'repairfindServiceFee' // Indicating where it was applied
                                }
                                : null,
                        }];
            }
        });
    });
};
exports.PaymentUtil = {
    calculateCharges: calculateCharges,
};
