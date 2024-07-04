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
exports.dispute = exports.AdminSettleJobDisputeController = exports.AdminGetJobDisputForAdminController = exports.AdminAcceptJobDisputeController = exports.AdminGetSingleJobDisputeController = exports.AdminJobDisputeByStatusController = void 0;
var express_validator_1 = require("express-validator");
var job_dispute_model_1 = require("../../../database/common/job_dispute.model");
//get job dispute by status /////////////
var AdminJobDisputeByStatusController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, status_1, errors, admin, adminId, skip, jobDisputes, totalJobDispute, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit, status_1 = _a.status;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.find({ status: status_1 })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate(['customer', 'contractor', 'job'])];
            case 1:
                jobDisputes = _b.sent();
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.countDocuments({ status: status_1 })];
            case 2:
                totalJobDispute = _b.sent();
                res.json({
                    currentPage: page,
                    totalPages: Math.ceil(totalJobDispute / limit),
                    jobDisputes: jobDisputes,
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminJobDisputeByStatusController = AdminJobDisputeByStatusController;
//get single dispute /////////////
var AdminGetSingleJobDisputeController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var disputeId, errors, admin, adminId, jobDispute, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                disputeId = req.params.disputeId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ _id: disputeId })
                        .populate(['customer', 'contractor', 'job'])];
            case 1:
                jobDispute = _a.sent();
                if (!jobDispute) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid disputeId" })];
                }
                res.json({
                    jobDispute: jobDispute,
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleJobDisputeController = AdminGetSingleJobDisputeController;
//admin accept dispute /////////////
var AdminAcceptJobDisputeController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var disputeId, errors, admin, adminId, jobDispute, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                disputeId = req.body.disputeId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ _id: disputeId })
                        .populate(['customer', 'contractor'])];
            case 1:
                jobDispute = _a.sent();
                if (!jobDispute) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid disputeId" })];
                }
                if (jobDispute.status !== job_dispute_model_1.JOB_DISPUTE_STATUS.OPEN) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Job emergency not open" })];
                }
                jobDispute.status = job_dispute_model_1.JOB_DISPUTE_STATUS.PENDING_MEDIATION;
                jobDispute.acceptedBy = adminId;
                return [4 /*yield*/, jobDispute.save()];
            case 2:
                _a.sent();
                res.json({
                    message: "Dispute accepted successfully"
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminAcceptJobDisputeController = AdminAcceptJobDisputeController;
//get  dispute by particular admin /////////////
var AdminGetJobDisputForAdminController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, status_2, errors, admin, adminId, skip, jobDisputes, totalJobDisputes, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit, status_2 = _a.status;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.find({ acceptedBy: adminId, status: status_2 })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate(['customer', 'contractor', 'job'])];
            case 1:
                jobDisputes = _b.sent();
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.countDocuments({ acceptedBy: adminId, status: status_2 })];
            case 2:
                totalJobDisputes = _b.sent();
                res.json({
                    currentPage: page,
                    totalPages: Math.ceil(totalJobDisputes / limit),
                    jobDisputes: jobDisputes,
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetJobDisputForAdminController = AdminGetJobDisputForAdminController;
//admin settle Dispute /////////////
var AdminSettleJobDisputeController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, disputeId, resolvedWay, errors, admin, adminId, jobDispute, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, disputeId = _a.disputeId, resolvedWay = _a.resolvedWay;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ _id: disputeId })];
            case 1:
                jobDispute = _b.sent();
                if (!jobDispute) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid disputeId" })];
                }
                if (jobDispute.status != job_dispute_model_1.JOB_DISPUTE_STATUS.PENDING_MEDIATION) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Dispute not yet accepted" })];
                }
                if (jobDispute.acceptedBy != adminId) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "you do not accepted this dispute" })];
                }
                jobDispute.status = job_dispute_model_1.JOB_DISPUTE_STATUS.CLOSED;
                jobDispute.resolvedWay = resolvedWay;
                return [4 /*yield*/, jobDispute.save()];
            case 2:
                _b.sent();
                res.json({
                    message: "Dispute resolved successfully"
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminSettleJobDisputeController = AdminSettleJobDisputeController;
exports.dispute = {
    AdminJobDisputeByStatusController: exports.AdminJobDisputeByStatusController,
    AdminGetSingleJobDisputeController: exports.AdminGetSingleJobDisputeController,
    AdminAcceptJobDisputeController: exports.AdminAcceptJobDisputeController,
    AdminGetJobDisputForAdminController: exports.AdminGetJobDisputForAdminController,
    AdminSettleJobDisputeController: exports.AdminSettleJobDisputeController
};
