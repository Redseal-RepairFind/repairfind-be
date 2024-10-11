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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobQuotationModel = exports.ExtraEstimateSchema = exports.JOB_QUOTATION_TYPE = exports.JOB_QUOTATION_STATUS = void 0;
var mongoose_1 = require("mongoose");
var payment_schema_1 = require("./payment.schema");
var payment_util_1 = require("../../utils/payment.util");
var coupon_schema_1 = require("./coupon.schema");
var JOB_QUOTATION_STATUS;
(function (JOB_QUOTATION_STATUS) {
    JOB_QUOTATION_STATUS["PENDING"] = "PENDING";
    JOB_QUOTATION_STATUS["ACCEPTED"] = "ACCEPTED";
    JOB_QUOTATION_STATUS["DECLINED"] = "DECLINED";
    JOB_QUOTATION_STATUS["COMPLETED"] = "COMPLETED";
})(JOB_QUOTATION_STATUS || (exports.JOB_QUOTATION_STATUS = JOB_QUOTATION_STATUS = {}));
var JOB_QUOTATION_TYPE;
(function (JOB_QUOTATION_TYPE) {
    JOB_QUOTATION_TYPE["SITE_VISIT"] = "SITE_VISIT";
    JOB_QUOTATION_TYPE["JOB_DAY"] = "JOB_DAY";
})(JOB_QUOTATION_TYPE || (exports.JOB_QUOTATION_TYPE = JOB_QUOTATION_TYPE = {}));
// Define schema for job quotation estimates
var JobQuotationEstimateSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number }
});
var QuotationDiscountSchema = new mongoose_1.Schema({
    coupon: { type: mongoose_1.Schema.Types.ObjectId, ref: 'coupons' },
    value: { type: Number },
    valueType: { type: String, enum: Object.values(coupon_schema_1.COUPON_VALUE_TYPE) },
});
// Define schema for extra estimates
exports.ExtraEstimateSchema = new mongoose_1.Schema({
    estimates: { type: [JobQuotationEstimateSchema], required: true },
    isPaid: { type: Boolean, default: false },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'payments' },
    date: { type: Date, required: true },
    charges: { type: mongoose_1.Schema.Types.Mixed },
    customerDiscount: QuotationDiscountSchema,
    contractorDiscount: QuotationDiscountSchema
});
var JobQuotationSchema = new mongoose_1.Schema({
    contractor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors', required: true },
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'jobs', required: true },
    status: { type: String, enum: Object.values(JOB_QUOTATION_STATUS), default: JOB_QUOTATION_STATUS.PENDING },
    type: { type: String, enum: Object.values(JOB_QUOTATION_TYPE), default: JOB_QUOTATION_TYPE.JOB_DAY },
    estimates: { type: [JobQuotationEstimateSchema], required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    siteVisit: { type: Date, required: false },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'payments' },
    charges: { type: mongoose_1.Schema.Types.Mixed },
    isPaid: { type: Boolean, default: false },
    changeOrderEstimate: { type: exports.ExtraEstimateSchema },
    siteVisitEstimate: { type: exports.ExtraEstimateSchema },
    responseTime: { type: Number, default: 0 },
    estimatedDuration: { type: Number, default: 0 },
    customerDiscount: QuotationDiscountSchema,
    contractorDiscount: QuotationDiscountSchema
}, { timestamps: true });
// Define the static method to calculate charges
JobQuotationSchema.methods.calculateCharges = function (type) {
    var _a, _b, _c, _d, _e, _f;
    if (type === void 0) { type = null; }
    return __awaiter(this, void 0, void 0, function () {
        var estimates, totalEstimateAmount, customerDiscount, contractorDiscount, siteVisitEstimateNotPaid, charges;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    estimates = this.estimates;
                    totalEstimateAmount = 0;
                    customerDiscount = this.customerDiscount;
                    contractorDiscount = this.contractorDiscount;
                    if (type) {
                        if (type == payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT) {
                            estimates = (_a = this === null || this === void 0 ? void 0 : this.changeOrderEstimate) === null || _a === void 0 ? void 0 : _a.estimates;
                        }
                        if (type == payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT) {
                            estimates = (_b = this === null || this === void 0 ? void 0 : this.siteVisitEstimate) === null || _b === void 0 ? void 0 : _b.estimates;
                            customerDiscount = this.siteVisitEstimate.customerDiscount;
                            contractorDiscount = this.siteVisitEstimate.contractorDiscount;
                        }
                    }
                    else {
                        siteVisitEstimateNotPaid = ((_c = this === null || this === void 0 ? void 0 : this.siteVisitEstimate) === null || _c === void 0 ? void 0 : _c.isPaid) === false ? this.siteVisitEstimate.estimates : [];
                        estimates = __spreadArray(__spreadArray(__spreadArray([], siteVisitEstimateNotPaid, true), ((_e = (_d = this === null || this === void 0 ? void 0 : this.changeOrderEstimate) === null || _d === void 0 ? void 0 : _d.estimates) !== null && _e !== void 0 ? _e : []), true), ((_f = this.estimates) !== null && _f !== void 0 ? _f : []), true);
                    }
                    if (estimates) {
                        estimates.forEach(function (estimate) {
                            totalEstimateAmount += estimate.rate * estimate.quantity;
                        });
                    }
                    return [4 /*yield*/, payment_util_1.PaymentUtil.calculateCharges({ totalEstimateAmount: totalEstimateAmount, customerDiscount: customerDiscount, contractorDiscount: contractorDiscount })];
                case 1:
                    charges = _g.sent();
                    return [2 /*return*/, charges];
            }
        });
    });
};
JobQuotationSchema.set('toObject', { virtuals: true });
JobQuotationSchema.set('toJSON', { virtuals: true });
var JobQuotationModel = (0, mongoose_1.model)('job_quotations', JobQuotationSchema);
exports.JobQuotationModel = JobQuotationModel;
