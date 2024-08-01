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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDisputeController = exports.createDisputeRefund = exports.settleDispute = exports.acceptDispute = exports.getSingleDispute = exports.getJobDisputes = void 0;
var express_validator_1 = require("express-validator");
var job_dispute_model_1 = require("../../../database/common/job_dispute.model");
var api_feature_1 = require("../../../utils/api.feature");
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var job_day_model_1 = require("../../../database/common/job_day.model");
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var payment_schema_1 = require("../../../database/common/payment.schema");
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var events_1 = require("../../../events");
var getJobDisputes = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, adminId, filter, _a, data, error, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                adminId = req.admin.id;
                filter = {};
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_dispute_model_1.JobDisputeModel.find(filter).populate({
                        path: 'disputer',
                        select: 'firstName lastName name profilePhoto _id'
                    }), req.query)];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                return [2 /*return*/, res.json({ success: true, message: "Job disputes retrieved", data: data })];
            case 2:
                err_1 = _b.sent();
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getJobDisputes = getJobDisputes;
//get single dispute /////////////
var getSingleDispute = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var disputeId, errors, admin, adminId, dispute, jobDay, arbitratorCustomerConversation, arbitratorContractorConversation, _a, _b, customerContractorConversation, jobDispute, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                disputeId = req.params.disputeId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ _id: disputeId })
                        .populate([{
                            path: 'customer',
                            select: 'firstName lastName name profilePhoto _id phoneNumber email'
                        },
                        {
                            path: 'contractor',
                            select: 'firstName lastName name profilePhoto _id phoneNumber email'
                        },
                        {
                            path: 'job',
                            // select: 'title lastName name profilePhoto _id'
                        }
                    ])];
            case 1:
                dispute = _c.sent();
                if (!dispute) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ success: false, message: " Job dispute not found" })];
                }
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: dispute.job })
                    // create conversations here
                ];
            case 2:
                jobDay = _c.sent();
                arbitratorCustomerConversation = null;
                arbitratorContractorConversation = null;
                if (!dispute.arbitrator) return [3 /*break*/, 7];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        $and: [
                            { members: { $elemMatch: { member: dispute.customer } } },
                            { members: { $elemMatch: { member: dispute.arbitrator } } }
                        ]
                    }, {
                        type: conversations_schema_1.CONVERSATION_TYPE.TICKET,
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'admins', member: dispute.arbitrator }],
                    }, { new: true, upsert: true })];
            case 3:
                arbitratorCustomerConversation = _c.sent();
                _a = arbitratorCustomerConversation;
                return [4 /*yield*/, arbitratorCustomerConversation.getHeading(dispute.arbitrator)];
            case 4:
                _a.heading = _c.sent();
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        $and: [
                            { members: { $elemMatch: { member: dispute.contractor } } },
                            { members: { $elemMatch: { member: dispute.arbitrator } } }
                        ]
                    }, {
                        type: conversations_schema_1.CONVERSATION_TYPE.TICKET,
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        members: [{ memberType: 'contractors', member: dispute.contractor }, { memberType: 'admins', member: dispute.arbitrator }],
                    }, { new: true, upsert: true })];
            case 5:
                arbitratorContractorConversation = _c.sent();
                _b = arbitratorContractorConversation;
                return [4 /*yield*/, arbitratorContractorConversation.getHeading(dispute.arbitrator)];
            case 6:
                _b.heading = _c.sent();
                _c.label = 7;
            case 7: return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                    $and: [
                        { members: { $elemMatch: { member: dispute.contractor } } },
                        { members: { $elemMatch: { member: dispute.customer } } }
                    ]
                }, {
                    members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'contractors', member: dispute.contractor }],
                }, { new: true, upsert: true })];
            case 8:
                customerContractorConversation = _c.sent();
                jobDispute = __assign({ conversations: { customerContractorConversation: customerContractorConversation, arbitratorContractorConversation: arbitratorContractorConversation, arbitratorCustomerConversation: arbitratorCustomerConversation }, jobDay: jobDay }, dispute === null || dispute === void 0 ? void 0 : dispute.toJSON());
                res.json({ success: true, message: "Job dispute retrieved", data: jobDispute });
                return [3 /*break*/, 10];
            case 9:
                error_1 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_1))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.getSingleDispute = getSingleDispute;
var acceptDispute = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var disputeId, adminId, jobDispute, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                disputeId = req.params.disputeId;
                adminId = req.admin.id;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ _id: disputeId })
                        .populate(['customer', 'contractor'])];
            case 1:
                jobDispute = _a.sent();
                if (!jobDispute) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Invalid disputeId" })];
                }
                if (jobDispute.status !== job_dispute_model_1.JOB_DISPUTE_STATUS.OPEN) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Dispute not pending" })];
                }
                jobDispute.status = job_dispute_model_1.JOB_DISPUTE_STATUS.ONGOING;
                jobDispute.arbitrator = adminId;
                return [4 /*yield*/, jobDispute.save()];
            case 2:
                _a.sent();
                res.json({ success: true, message: "Dispute accepted successfully" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_2))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptDispute = acceptDispute;
//admin settle Dispute /////////////
var settleDispute = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var resolvedWay, disputeId, errors, admin, adminId, jobDispute, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                resolvedWay = req.body.resolvedWay;
                disputeId = req.params.disputeId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation occurred", errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ _id: disputeId })];
            case 1:
                jobDispute = _a.sent();
                if (!jobDispute) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid disputeId" })];
                }
                if (jobDispute.status != job_dispute_model_1.JOB_DISPUTE_STATUS.ONGOING) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Dispute not ongoing" })];
                }
                if (jobDispute.arbitrator != adminId) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Only dispute arbitrator can settle a dispute" })];
                }
                jobDispute.status = job_dispute_model_1.JOB_DISPUTE_STATUS.RESOLVED;
                jobDispute.resolvedWay = resolvedWay;
                return [4 /*yield*/, jobDispute.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.json({ success: true, message: "Dispute resolved successfully" })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_3))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.settleDispute = settleDispute;
var createDisputeRefund = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, refundAmount, refundPercentage, disputeId, errors, admin, adminId, jobDispute, job, paymentType, payments, _i, _b, payment, refund, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                _a = req.body, refundAmount = _a.refundAmount, refundPercentage = _a.refundPercentage;
                disputeId = req.params.disputeId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation occurred", errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ _id: disputeId })];
            case 1:
                jobDispute = _c.sent();
                if (!jobDispute) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid disputeId" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobDispute.job })];
            case 2:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ message: "Disputed Job not found" })];
                }
                if (jobDispute.status != job_dispute_model_1.JOB_DISPUTE_STATUS.ONGOING) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Dispute not is not ongoing" })];
                }
                if (jobDispute.arbitrator != adminId) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ success: false, message: "Only dispute arbitrator can settle a dispute" })];
                }
                jobDispute.status = job_dispute_model_1.JOB_DISPUTE_STATUS.RESOLVED;
                // jobDispute.resolvedWay = resolvedWay
                return [4 /*yield*/, jobDispute.save()
                    // choose which payment to refund ? SITE_VISIT_PAYMENT, JOB_DAY_PAYMENT, CHANGE_ORDER_PAYMENT
                ];
            case 3:
                // jobDispute.resolvedWay = resolvedWay
                _c.sent();
                paymentType = (job.schedule.type == 'JOB_DAY') ? [payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT, payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT] : [payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT];
                return [4 /*yield*/, job.getPayments(paymentType)];
            case 4:
                payments = _c.sent();
                _i = 0, _b = payments.payments;
                _c.label = 5;
            case 5:
                if (!(_i < _b.length)) return [3 /*break*/, 8];
                payment = _b[_i];
                if (payment.refunded)
                    return [3 /*break*/, 7];
                refund = {
                    refundAmount: payment.amount,
                    totalAmount: payment.amount,
                    fee: 0,
                    contractorAmount: 0,
                    companyAmount: 0,
                    intiatedBy: 'admin',
                    policyApplied: 'dispute_refund',
                };
                //create refund transaction - 
                return [4 /*yield*/, transaction_model_1.default.create({
                        type: transaction_model_1.TRANSACTION_TYPE.REFUND,
                        amount: payments.totalAmount,
                        initiatorUser: adminId,
                        initiatorUserType: 'admins',
                        fromUser: job.contractor,
                        fromUserType: 'contractors',
                        toUser: jobDispute.customer,
                        toUserType: 'customers',
                        description: "Refund from job: ".concat(job === null || job === void 0 ? void 0 : job.title, " payment"),
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING,
                        remark: 'job_refund',
                        invoice: {
                            items: [],
                            charges: refund
                        },
                        metadata: __assign(__assign({}, refund), { payment: payment.id.toString(), charge: payment.charge }),
                        job: job.id,
                        payment: payment.id,
                    })];
            case 6:
                //create refund transaction - 
                _c.sent();
                events_1.JobEvent.emit('JOB_REFUND_REQUESTED', { job: job, payment: payment, refund: refund });
                _c.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                // Update the job status to canceled
                job.status = job_model_1.JOB_STATUS.CANCELED;
                job.jobHistory.push({
                    eventType: 'JOB_DISPUTE_REFUND',
                    timestamp: new Date(),
                    payload: { reason: 'Settlement by admin', canceledBy: jobDispute.disputerType }
                });
                // emit job cancelled event 
                events_1.JobEvent.emit('JOB_CANCELED', { job: job, canceledBy: 'customer' });
                return [4 /*yield*/, job.save()];
            case 9:
                _c.sent();
                return [2 /*return*/, res.json({ success: true, message: "Dispute refund created" })];
            case 10:
                error_4 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_4))];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.createDisputeRefund = createDisputeRefund;
exports.AdminDisputeController = {
    getJobDisputes: exports.getJobDisputes,
    getSingleDispute: exports.getSingleDispute,
    acceptDispute: exports.acceptDispute,
    settleDispute: exports.settleDispute,
    createDisputeRefund: exports.createDisputeRefund
};
