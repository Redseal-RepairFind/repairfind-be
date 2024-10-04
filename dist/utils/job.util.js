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
exports.JobUtil = void 0;
var job_quotation_model_1 = require("../database/common/job_quotation.model");
var payment_schema_1 = require("../database/common/payment.schema");
var populate = function (job, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var tasks, result, contractTask, totalEnquiresTask, hasUnrepliedEnquiryTask, myQuotationTask, jobDayTask, disputeTask;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tasks = [];
                    result = {};
                    if (options.contract) {
                        contractTask = job_quotation_model_1.JobQuotationModel.findOne({ _id: job.contract, job: job.id }).then(function (contract) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b, _c;
                            var _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        if (!contract) return [3 /*break*/, 6];
                                        if (!contract.changeOrderEstimate) return [3 /*break*/, 2];
                                        _a = contract.changeOrderEstimate;
                                        return [4 /*yield*/, contract.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
                                    case 1:
                                        _a.charges = (_d = _f.sent()) !== null && _d !== void 0 ? _d : {};
                                        _f.label = 2;
                                    case 2:
                                        if (!contract.siteVisitEstimate) return [3 /*break*/, 4];
                                        _b = contract.siteVisitEstimate;
                                        return [4 /*yield*/, contract.calculateCharges(payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT)];
                                    case 3:
                                        _b.charges = (_e = _f.sent()) !== null && _e !== void 0 ? _e : {};
                                        _f.label = 4;
                                    case 4:
                                        _c = contract;
                                        return [4 /*yield*/, contract.calculateCharges()];
                                    case 5:
                                        _c.charges = _f.sent();
                                        result.contract = contract;
                                        _f.label = 6;
                                    case 6:
                                        console.log(contract);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        tasks.push(contractTask);
                    }
                    if (options.totalEnquires) {
                        totalEnquiresTask = job.getTotalEnquires().then(function (totalEnquires) {
                            result.totalEnquires = totalEnquires;
                        });
                        tasks.push(totalEnquiresTask);
                    }
                    if (options.hasUnrepliedEnquiry) {
                        hasUnrepliedEnquiryTask = job.getHasUnrepliedEnquiry().then(function (hasUnrepliedEnquiry) {
                            result.hasUnrepliedEnquiry = hasUnrepliedEnquiry;
                        });
                        tasks.push(hasUnrepliedEnquiryTask);
                    }
                    if (options.myQuotation) {
                        myQuotationTask = job.getMyQuotation(options.myQuotation).then(function (myQuotation) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _a = myQuotation;
                                        return [4 /*yield*/, myQuotation.calculateCharges()];
                                    case 1:
                                        _a.charges = _d.sent();
                                        if (!myQuotation.siteVisitEstimate) return [3 /*break*/, 3];
                                        _b = myQuotation.siteVisitEstimate;
                                        return [4 /*yield*/, myQuotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT)];
                                    case 2:
                                        _b.charges = _d.sent();
                                        _d.label = 3;
                                    case 3:
                                        if (!myQuotation.changeOrderEstimate) return [3 /*break*/, 5];
                                        _c = myQuotation.changeOrderEstimate;
                                        return [4 /*yield*/, myQuotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
                                    case 4:
                                        _c.charges = _d.sent();
                                        _d.label = 5;
                                    case 5:
                                        result.myQuotation = myQuotation;
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        tasks.push(myQuotationTask);
                    }
                    if (options.jobDay) {
                        jobDayTask = job.getJobDay().then(function (jobDay) {
                            result.jobDay = jobDay;
                        });
                        tasks.push(jobDayTask);
                    }
                    if (options.dispute) {
                        disputeTask = job.getJobDispute().then(function (dispute) {
                            result.dispute = dispute;
                        });
                        tasks.push(disputeTask);
                    }
                    // Wait for all tasks to complete
                    return [4 /*yield*/, Promise.all(tasks)];
                case 1:
                    // Wait for all tasks to complete
                    _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
exports.JobUtil = {
    populate: populate
};
