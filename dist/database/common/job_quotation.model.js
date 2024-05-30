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
exports.JobQuotationModel = exports.ExtraEstimateSchema = exports.JOB_QUOTATION_TYPE = exports.JOB_QUOTATION_STATUS = void 0;
var mongoose_1 = require("mongoose");
var job_model_1 = require("./job.model");
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
// Define schema for extra estimates
exports.ExtraEstimateSchema = new mongoose_1.Schema({
    estimates: { type: [JobQuotationEstimateSchema], required: true },
    isPaid: { type: Boolean, default: false },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'payments' },
    date: { type: Date, required: true }
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
    isPaid: { type: Boolean, default: false },
    changeOrderEstimate: { type: exports.ExtraEstimateSchema },
    siteVisitEstimate: { type: exports.ExtraEstimateSchema }
}, { timestamps: true });
// Define the static method to calculate charges
JobQuotationSchema.methods.calculateCharges = function (type) {
    if (type === void 0) { type = null; }
    return __awaiter(this, void 0, void 0, function () {
        var estimates, subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount, totalEstimateAmount;
        return __generator(this, function (_a) {
            estimates = this.estimates;
            if (type == job_model_1.JOB_PAYMENT_TYPE.CHANGE_ORDER) {
                estimates = this.changeOrderEstimate.estimates;
            }
            if (type == job_model_1.JOB_PAYMENT_TYPE.SITE_VISIT) {
                estimates = this.siteVisitEstimate.estimates;
            }
            siteVisitAmount = 0;
            totalEstimateAmount = 0;
            estimates.forEach(function (estimate) {
                totalEstimateAmount += estimate.rate * estimate.quantity;
            });
            if (totalEstimateAmount <= 1000) {
                processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
            }
            else if (totalEstimateAmount <= 5000) {
                processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
            }
            else {
                processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
            }
            gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
            subtotal = totalEstimateAmount;
            totalAmount = (subtotal + processingFee + gst).toFixed(2);
            contractorAmount = (subtotal + gst).toFixed(2);
            return [2 /*return*/, { subtotal: subtotal, processingFee: processingFee, gst: gst, totalAmount: totalAmount, contractorAmount: contractorAmount }];
        });
    });
};
JobQuotationSchema.virtual('charges').get(function () {
    var totalEstimateAmount = 0;
    var estimates = this.estimates;
    var type = (this.type == JOB_QUOTATION_TYPE.SITE_VISIT) ? job_model_1.JOB_PAYMENT_TYPE.SITE_VISIT : job_model_1.JOB_PAYMENT_TYPE.JOB_DAY;
    if (type == job_model_1.JOB_PAYMENT_TYPE.CHANGE_ORDER) {
        estimates = this.changeOrderEstimate.estimates;
    }
    if (type == job_model_1.JOB_PAYMENT_TYPE.SITE_VISIT) {
        estimates = this.siteVisitEstimate.estimates;
    }
    estimates.forEach(function (estimate) {
        totalEstimateAmount += estimate.rate * estimate.quantity;
    });
    var subtotal, processingFee, gst, totalAmount, contractorAmount, siteVisitAmount = 0;
    if (totalEstimateAmount <= 1000) {
        processingFee = parseFloat(((20 / 100) * totalEstimateAmount).toFixed(2));
    }
    else if (totalEstimateAmount <= 5000) {
        processingFee = parseFloat(((15 / 100) * totalEstimateAmount).toFixed(2));
    }
    else {
        processingFee = parseFloat(((10 / 100) * totalEstimateAmount).toFixed(2));
    }
    gst = parseFloat(((5 / 100) * totalEstimateAmount).toFixed(2));
    subtotal = totalEstimateAmount;
    totalAmount = (subtotal + processingFee + gst).toFixed(2);
    contractorAmount = (subtotal + gst).toFixed(2);
    return { subtotal: subtotal, processingFee: processingFee, gst: gst, totalAmount: totalAmount, contractorAmount: contractorAmount };
});
JobQuotationSchema.set('toObject', { virtuals: true });
JobQuotationSchema.set('toJSON', { virtuals: true });
var JobQuotationModel = (0, mongoose_1.model)('job_quotations', JobQuotationSchema);
exports.JobQuotationModel = JobQuotationModel;
