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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPayContractorController = exports.AdminGetSinglePayoutDetailController = exports.AdminGetCompletedPayoutDetailController = exports.AdminGetPendingPayoutDetailController = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var payout_model_1 = __importDefault(require("../../../database/admin/models/payout.model"));
var job_model_1 = require("../../../database/common/job.model");
//get pending Payout detail /////////////
var AdminGetPendingPayoutDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, Payouts, pendingPayout, totalPendigPayout, i, Payout, job, customer, contractor, obj, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
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
                return [4 /*yield*/, payout_model_1.default.find({ status: "pending" })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)];
            case 1:
                Payouts = _b.sent();
                pendingPayout = [];
                return [4 /*yield*/, payout_model_1.default.countDocuments({ status: "pending" })];
            case 2:
                totalPendigPayout = _b.sent();
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < Payouts.length)) return [3 /*break*/, 8];
                Payout = Payouts[i];
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: Payout.jobId })];
            case 4:
                job = _b.sent();
                if (!job)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 5:
                customer = _b.sent();
                if (!customer)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractor })];
            case 6:
                contractor = _b.sent();
                if (!contractor)
                    return [3 /*break*/, 7];
                obj = {
                    Payout: Payout,
                    job: job,
                    customer: customer,
                    contractor: contractor,
                };
                pendingPayout.push(obj);
                _b.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 3];
            case 8:
                res.json({
                    totalPendigPayout: totalPendigPayout,
                    pendingPayout: pendingPayout
                });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetPendingPayoutDetailController = AdminGetPendingPayoutDetailController;
//get completed Payout detail /////////////
var AdminGetCompletedPayoutDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, Payouts, completedPayout, totalCompletedPayout, i, Payout, job, customer, contractor, obj, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
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
                return [4 /*yield*/, payout_model_1.default.find({ status: "completed" })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)];
            case 1:
                Payouts = _b.sent();
                completedPayout = [];
                return [4 /*yield*/, payout_model_1.default.countDocuments({ status: "completed" })];
            case 2:
                totalCompletedPayout = _b.sent();
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < Payouts.length)) return [3 /*break*/, 8];
                Payout = Payouts[i];
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: Payout.jobId })];
            case 4:
                job = _b.sent();
                if (!job)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 5:
                customer = _b.sent();
                if (!customer)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractor })];
            case 6:
                contractor = _b.sent();
                if (!contractor)
                    return [3 /*break*/, 7];
                obj = {
                    Payout: Payout,
                    job: job,
                    customer: customer,
                    contractor: contractor,
                };
                completedPayout.push(obj);
                _b.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 3];
            case 8:
                res.json({
                    totalCompletedPayout: totalCompletedPayout,
                    completedPayout: completedPayout
                });
                return [3 /*break*/, 10];
            case 9:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetCompletedPayoutDetailController = AdminGetCompletedPayoutDetailController;
//get single Payout detail /////////////
var AdminGetSinglePayoutDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payoutId, errors, admin, adminId, payout, job, customer, contractor, obj, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                payoutId = req.query.payoutId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, payout_model_1.default.findOne({ _id: payoutId })];
            case 1:
                payout = _a.sent();
                if (!payout) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect payout Id" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: payout.jobId })];
            case 2:
                job = _a.sent();
                if (!job)
                    return [2 /*return*/];
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 3:
                customer = _a.sent();
                if (!customer)
                    return [2 /*return*/];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractor })];
            case 4:
                contractor = _a.sent();
                if (!contractor)
                    return [2 /*return*/];
                obj = {
                    payout: payout,
                    job: job,
                    customer: customer,
                    contractor: contractor,
                };
                res.json({
                    obj: obj
                });
                return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSinglePayoutDetailController = AdminGetSinglePayoutDetailController;
//admin pay contractor /////////////
var AdminPayContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payoutId, errors, admin, adminId, payout, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                payoutId = req.body.payoutId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, payout_model_1.default.findOne({ _id: payoutId, status: "pending" })];
            case 1:
                payout = _a.sent();
                if (!payout) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect payout Id or not pending payout" })];
                }
                payout.status = "completed";
                return [4 /*yield*/, payout.save()];
            case 2:
                _a.sent();
                res.json({
                    message: "payment succefully"
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminPayContractorController = AdminPayContractorController;
