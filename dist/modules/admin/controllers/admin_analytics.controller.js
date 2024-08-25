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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsController = exports.getStats = void 0;
var express_validator_1 = require("express-validator");
var job_model_1 = require("../../../database/common/job.model");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var getStats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, endDate, errors, dateFilter, start, end, totalJob, totalCustomers, totalContractors, totalRevenue, allJobs, totalCanceled, totalCompleted, totalPending, totalBooked, totalDisputed, totalOngoing, totalExpired, jobPieChartData, completedPercentage, pendingPercentage, disputedPercentage, ongoingPercentage, bookedPercentage, expiredPercentage, months_1, monthlyRevenuePlot_1, monthlyJobPlot_1, monthlyRevenue, monthlyJobs, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                _a = req.query, startDate = _a.startDate, endDate = _a.endDate;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                dateFilter = {};
                if (startDate && endDate) {
                    start = new Date(startDate);
                    end = new Date(endDate);
                    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                        dateFilter = { createdAt: { $gte: start, $lte: end } };
                    }
                    else {
                        return [2 /*return*/, res.status(400).json({ success: false, message: "Invalid date format" })];
                    }
                }
                return [4 /*yield*/, job_model_1.JobModel.countDocuments(dateFilter)];
            case 1:
                totalJob = _b.sent();
                return [4 /*yield*/, customer_model_1.default.countDocuments(dateFilter)];
            case 2:
                totalCustomers = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments(dateFilter)];
            case 3:
                totalContractors = _b.sent();
                return [4 /*yield*/, transaction_model_1.default.countDocuments(__assign(__assign({}, dateFilter), { type: { $in: [transaction_model_1.TRANSACTION_TYPE.CHANGE_ORDER, transaction_model_1.TRANSACTION_TYPE.JOB_DAY, transaction_model_1.TRANSACTION_TYPE.SITE_VISIT] } }))];
            case 4:
                totalRevenue = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments()];
            case 5:
                allJobs = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.CANCELED })];
            case 6:
                totalCanceled = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.COMPLETED })];
            case 7:
                totalCompleted = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.PENDING })];
            case 8:
                totalPending = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.BOOKED })];
            case 9:
                totalBooked = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: { $in: [job_model_1.JOB_STATUS.DISPUTED, job_model_1.JOB_STATUS.NOT_STARTED] } })];
            case 10:
                totalDisputed = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.ONGOING })];
            case 11:
                totalOngoing = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ status: job_model_1.JOB_STATUS.EXPIRED })];
            case 12:
                totalExpired = _b.sent();
                jobPieChartData = {
                    labels: ["Canceled", "Completed", "Pending", "Disputed"],
                    datasets: [
                        {
                            label: "Job Status Distribution",
                            data: [totalCanceled, totalCompleted, totalPending, totalDisputed],
                            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40"], // Colors for the chart segments
                        },
                    ],
                };
                completedPercentage = ((totalCompleted / allJobs) * 100).toFixed(2);
                pendingPercentage = ((totalPending / allJobs) * 100).toFixed(2);
                disputedPercentage = ((totalDisputed / allJobs) * 100).toFixed(2);
                ongoingPercentage = ((totalOngoing / allJobs) * 100).toFixed(2);
                bookedPercentage = ((totalBooked / allJobs) * 100).toFixed(2);
                expiredPercentage = ((totalExpired / allJobs) * 100).toFixed(2);
                months_1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                monthlyRevenuePlot_1 = Array(12).fill(0).map(function (_, index) { return ({
                    month: months_1[index],
                    revenue: 0,
                }); });
                monthlyJobPlot_1 = Array(12).fill(0).map(function (_, index) { return ({
                    month: months_1[index],
                    jobs: 0,
                }); });
                return [4 /*yield*/, transaction_model_1.default.aggregate([
                        {
                            $match: __assign(__assign({}, dateFilter), { type: { $in: [transaction_model_1.TRANSACTION_TYPE.CHANGE_ORDER, transaction_model_1.TRANSACTION_TYPE.JOB_DAY, transaction_model_1.TRANSACTION_TYPE.SITE_VISIT] } }),
                        },
                        {
                            $group: {
                                _id: { $month: "$createdAt" },
                                totalRevenue: { $sum: "$amount" },
                            },
                        },
                        {
                            $sort: { _id: 1 },
                        },
                    ])];
            case 13:
                monthlyRevenue = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.aggregate([
                        {
                            $match: dateFilter,
                        },
                        {
                            $group: {
                                _id: { $month: "$createdAt" },
                                totalJobs: { $sum: 1 },
                            },
                        },
                        {
                            $sort: { _id: 1 },
                        },
                    ])];
            case 14:
                monthlyJobs = _b.sent();
                // Populate the initialized arrays with actual data
                monthlyRevenue.forEach(function (item) {
                    monthlyRevenuePlot_1[item._id - 1].revenue = item.totalRevenue;
                });
                monthlyJobs.forEach(function (item) {
                    monthlyJobPlot_1[item._id - 1].jobs = item.totalJobs;
                });
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Overview stats retrieved",
                        data: {
                            totalJob: totalJob,
                            totalCustomers: totalCustomers,
                            totalContractors: totalContractors,
                            totalRevenue: totalRevenue,
                            allJobs: allJobs,
                            jobPieChartData: jobPieChartData,
                            jobPercentages: [
                                { completedPercentage: completedPercentage, pendingPercentage: pendingPercentage, disputedPercentage: disputedPercentage, ongoingPercentage: ongoingPercentage, bookedPercentage: bookedPercentage, expiredPercentage: expiredPercentage },
                            ],
                            monthlyRevenuePlot: monthlyRevenuePlot_1,
                            monthlyJobPlot: monthlyJobPlot_1,
                        },
                    })];
            case 15:
                err_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ success: false, message: err_1.message })];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.getStats = getStats;
exports.AdminAnalyticsController = {
    getStats: exports.getStats,
};
