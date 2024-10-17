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
exports.TransactionDetailController = exports.AdminGetSingleTransactionDetailController = exports.AdminGetTransactionDetailController = void 0;
var express_validator_1 = require("express-validator");
var transaction_model_1 = __importDefault(require("../../../database/common/transaction.model"));
var job_model_1 = require("../../../database/common/job.model");
//get transaction detail /////////////
var AdminGetTransactionDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, transactions, totalTansactions, transactionDetail, i, transaction, job, obj, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
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
                return [4 /*yield*/, transaction_model_1.default.find()
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate(['initiatorUser', 'fromUser', 'toUser', 'job', 'payment'])];
            case 1:
                transactions = _b.sent();
                return [4 /*yield*/, transaction_model_1.default.countDocuments()];
            case 2:
                totalTansactions = _b.sent();
                transactionDetail = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < transactions.length)) return [3 /*break*/, 6];
                transaction = transactions[i];
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: transaction.job })];
            case 4:
                job = _b.sent();
                if (!job) {
                    job = null;
                }
                obj = {
                    transaction: transaction,
                    job: job
                };
                transactionDetail.push(obj);
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6:
                res.json({
                    currentPage: page,
                    totalPages: Math.ceil(totalTansactions / limit),
                    totalTansactions: totalTansactions,
                    transactions: transactionDetail
                });
                return [3 /*break*/, 8];
            case 7:
                err_1 = _b.sent();
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetTransactionDetailController = AdminGetTransactionDetailController;
//get transaction single detail /////////////
var AdminGetSingleTransactionDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var transactionId, errors, admin, adminId, transaction, job, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                transactionId = req.params.transactionId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, transaction_model_1.default.findOne({ _id: transactionId }).populate(['initiatorUser', 'fromUser', 'toUser', 'job', 'payment'])];
            case 1:
                transaction = _a.sent();
                if (!transaction) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid transaction ID" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: transaction.job })];
            case 2:
                job = _a.sent();
                if (!job) {
                    job = null;
                }
                res.json({
                    transaction: transaction,
                    job: job
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleTransactionDetailController = AdminGetSingleTransactionDetailController;
exports.TransactionDetailController = {
    AdminGetTransactionDetailController: exports.AdminGetTransactionDetailController,
    AdminGetSingleTransactionDetailController: exports.AdminGetSingleTransactionDetailController,
};
