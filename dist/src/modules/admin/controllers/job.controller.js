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
exports.AdminJobController = exports.AdminGetInvoiceSingleJobsrDetailController = exports.AdminGetTotalJobsrController = exports.AdminGetSingleJobsrDetailController = exports.AdminGetJobsrDetailController = void 0;
var express_validator_1 = require("express-validator");
var job_model_1 = require("../../../database/common/job.model");
var invoices_shema_1 = require("../../../database/common/invoices.shema");
//get jobs detail /////////////
var AdminGetJobsrDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, jobsDetails, totalJob, jobs, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, job_model_1.JobModel.find()
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate(['customer', 'contractor', 'quotation'])];
            case 1:
                jobsDetails = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments()];
            case 2:
                totalJob = _b.sent();
                jobs = [];
                // for (let i = 0; i < jobsDetails.length; i++) {
                //     const jobsDetail = jobsDetails[i];
                //     const customer = await CustomerRegModel.findOne({_id: jobsDetail.customerId});
                //     const contractor = await ContractorModel.findOne({_id: jobsDetail.contractorId})
                //     if (!customer || !contractor) continue;
                //     const obj = {
                //         job: jobsDetail,
                //         contractor,
                //         customer
                //     }
                //     jobs.push(obj)
                // }
                res.json({
                    currentPage: page,
                    totalPages: Math.ceil(totalJob / limit),
                    totalJob: totalJob,
                    jobsDetails: jobsDetails
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetJobsrDetailController = AdminGetJobsrDetailController;
//get single jobs detail /////////////
var AdminGetSingleJobsrDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, admin, adminId, jobsDetail, obj, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId }).populate(['customer', 'contractor', 'quotation'])];
            case 1:
                jobsDetail = _a.sent();
                if (!jobsDetail) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid job ID" })];
                }
                obj = {
                    job: jobsDetail,
                };
                res.json({
                    job: obj
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleJobsrDetailController = AdminGetSingleJobsrDetailController;
//get total jobs /////////////
var AdminGetTotalJobsrController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, admin, adminId, totalJob, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_model_1.JobModel.countDocuments()];
            case 1:
                totalJob = _b.sent();
                res.json({
                    totalJob: totalJob
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetTotalJobsrController = AdminGetTotalJobsrController;
//get invoce for  single jobs detail /////////////
var AdminGetInvoiceSingleJobsrDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, admin, adminId, invoice, obj, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, invoices_shema_1.InvoiceModel.findOne({ jobId: jobId }).populate({
                        path: 'jobId', // Field in JobModel referencing another model
                        populate: [
                            { path: 'customer' }, // Field in CustomerModel referencing another model
                            { path: 'contractor' },
                            { path: 'quotation' }
                        ]
                    })
                        .populate('customerId')];
            case 1:
                invoice = _a.sent();
                if (!invoice) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid job ID or no invoice for this job yet" })];
                }
                obj = {
                    invoice: invoice
                };
                res.json({
                    job: obj
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetInvoiceSingleJobsrDetailController = AdminGetInvoiceSingleJobsrDetailController;
exports.AdminJobController = {
    AdminGetJobsrDetailController: exports.AdminGetJobsrDetailController,
    AdminGetSingleJobsrDetailController: exports.AdminGetSingleJobsrDetailController,
    AdminGetTotalJobsrController: exports.AdminGetTotalJobsrController,
    AdminGetInvoiceSingleJobsrDetailController: exports.AdminGetInvoiceSingleJobsrDetailController
};
