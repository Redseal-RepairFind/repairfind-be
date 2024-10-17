"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AdminJobController = exports.getJobStats = exports.getSingleJob = exports.getJobs = void 0;
var express_validator_1 = require("express-validator");
var job_model_1 = require("../../../database/common/job.model");
var api_feature_1 = require("../../../utils/api.feature");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
var getJobs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, data, filter, allJobs, totalCanceled, totalCompleted, totalPending, totalBooked, totalDisputed, totalNotStarted, totalOngoing, totalExpired, mostRequestedCategory, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find().populate(['customer', 'contractor', 'contract']), req.query)];
            case 1:
                _a = _b.sent(), data = _a.data, filter = _a.filter;
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(filter)];
            case 2:
                allJobs = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.CANCELED }))];
            case 3:
                totalCanceled = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.COMPLETED }))];
            case 4:
                totalCompleted = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.PENDING }))];
            case 5:
                totalPending = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.BOOKED }))];
            case 6:
                totalBooked = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.DISPUTED }))];
            case 7:
                totalDisputed = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.NOT_STARTED }))];
            case 8:
                totalNotStarted = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.ONGOING }))];
            case 9:
                totalOngoing = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(__assign(__assign({}, filter), { status: job_model_1.JOB_STATUS.EXPIRED }))];
            case 10:
                totalExpired = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.aggregate([
                        { $match: __assign({}, filter) },
                        { $group: { _id: "$category", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 1 },
                    ])];
            case 11:
                mostRequestedCategory = _b.sent();
                return [2 /*return*/, res.json({
                        success: true, message: "Jobs retrieved successfully",
                        data: __assign(__assign({}, data), { stats: {
                                allJobs: allJobs,
                                totalCanceled: totalCanceled,
                                totalCompleted: totalCompleted,
                                totalPending: totalPending,
                                totalBooked: totalBooked,
                                totalDisputed: totalDisputed,
                                totalNotStarted: totalNotStarted,
                                totalOngoing: totalOngoing,
                                totalExpired: totalExpired,
                                mostRequestedCategory: mostRequestedCategory[0]
                            } }),
                    })];
            case 12:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.getJobs = getJobs;
var getSingleJob = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, job, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId).populate(['customer', 'contractor', 'contract'])];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(401).json({ message: "Job not found" })];
                }
                res.json({ success: true, message: "Job retrieved", data: job });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(500).json({ success: false, message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleJob = getSingleJob;
var getJobStats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, totalJob, totalCanceled, totalCompleted, totalDisputed, mostRequestedCategory, topRatedContractor, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.query;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, job_model_1.JobModel.countDocuments()];
            case 1:
                totalJob = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.CANCELED })];
            case 2:
                totalCanceled = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.COMPLETED })];
            case 3:
                totalCompleted = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.DISPUTED })];
            case 4:
                totalDisputed = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.aggregate([
                        { $group: { _id: "$category", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 1 }
                    ])];
            case 5:
                mostRequestedCategory = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.aggregate([
                        { $match: { reviews: { $exists: true, $ne: [] } } },
                        {
                            $addFields: {
                                name: {
                                    $cond: {
                                        if: {
                                            $or: [
                                                { $eq: ['$accountType', contractor_interface_1.CONTRACTOR_TYPES.Individual] },
                                                { $eq: ['$accountType', contractor_interface_1.CONTRACTOR_TYPES.Employee] }
                                            ]
                                        },
                                        then: { $concat: ['$firstName', ' ', '$lastName'] },
                                        else: '$companyName'
                                    }
                                },
                                rating: { $avg: '$reviews.averageRating' }, // Calculate average rating using $avg
                                ratingCount: { $size: '$reviews' }, // Calculate average rating using $avg
                            }
                        },
                        { $project: { _id: 1, profilePhoto: 1, name: 1, rating: 1, ratingCount: 1, reviewCount: { $size: "$reviews" } } },
                        { $sort: { reviewCount: -1 } },
                        { $limit: 1 }
                    ])];
            case 6:
                topRatedContractor = _b.sent();
                // const topRatedContractor = await ContractorModel.findById(topRatedContractorId[0]._id)
                return [2 /*return*/, res.json({ success: false, message: "Job stats retrieved", data: { totalJob: totalJob, totalCanceled: totalCanceled, totalCompleted: totalCompleted, totalDisputed: totalDisputed, mostRequestedCategory: mostRequestedCategory[0], topRatedContractor: topRatedContractor[0] } })];
            case 7:
                err_3 = _b.sent();
                return [2 /*return*/, res.status(500).json({ success: false, message: err_3.message })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getJobStats = getJobStats;
exports.AdminJobController = {
    getJobs: exports.getJobs,
    getSingleJob: exports.getSingleJob,
    getJobStats: exports.getJobStats,
};
