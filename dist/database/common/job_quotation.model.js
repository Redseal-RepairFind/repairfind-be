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
exports.JobQoutationModel = exports.JobQuotationStatus = void 0;
var mongoose_1 = require("mongoose");
var JobQuotationStatus;
(function (JobQuotationStatus) {
    JobQuotationStatus["PENDING"] = "PENDING";
    JobQuotationStatus["ACCEPTED"] = "ACCEPTED";
    JobQuotationStatus["REJECTED"] = "REJECTED";
    JobQuotationStatus["COMPLETED"] = "COMPLETED";
})(JobQuotationStatus || (exports.JobQuotationStatus = JobQuotationStatus = {}));
var JobApplicationSchema = new mongoose_1.Schema({
    contractor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors', required: true },
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'jobs', required: true },
    status: { type: String, enum: Object.values(JobQuotationStatus), default: JobQuotationStatus.PENDING },
    estimates: { type: [Object], required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    siteVisit: { type: Object, default: null, properties: {
            address: { type: String, required: false },
            date: { type: Date, required: false },
        } },
    charges: { type: Object, default: {
            subtotal: 0.00,
            processingFee: 0.00,
            gst: 0.00,
            totalAmount: 0.00,
            contractorAmount: 0.00
        } },
}, { timestamps: true });
// Define the static method to calculate charges
JobApplicationSchema.methods.calculateCharges = function () {
    return __awaiter(this, void 0, void 0, function () {
        var totalEstimateAmount, processingFee, gst, subtotal, totalAmount, contractorAmount;
        return __generator(this, function (_a) {
            totalEstimateAmount = 0;
            // Calculate total estimate amount from rate * quantity for each estimate
            this.estimates.forEach(function (estimate) {
                totalEstimateAmount += estimate.rate * estimate.quantity;
            });
            processingFee = 0;
            gst = 0;
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
var JobQoutationModel = (0, mongoose_1.model)('job_quotations', JobApplicationSchema);
exports.JobQoutationModel = JobQoutationModel;