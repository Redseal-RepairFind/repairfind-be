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
exports.CustomerTransactionController = exports.getSingleTransaction = exports.getTransactions = void 0;
var custom_errors_1 = require("../../../utils/custom.errors");
var transaction_model_1 = __importDefault(require("../../../database/common/transaction.model"));
var api_feature_1 = require("../../../utils/api.feature");
// Controller method to fetch customer transactions
var getTransactions = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, filter, _a, data, error, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerId = req.customer.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                filter = {
                    $or: [
                        { fromUser: customerId, fromUserType: 'customers' },
                        { toUser: customerId, toUserType: 'customers' }
                    ]
                };
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(transaction_model_1.default.find(filter).populate([{ path: 'fromUser' }, { path: 'toUser' }]), req.query)];
            case 2:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (!data) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(data.data.map(function (transaction) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = transaction;
                                    return [4 /*yield*/, transaction.getIsCredit(customerId)];
                                case 1:
                                    _a.isCredit = _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                // Return the transactions in the response
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                next(new custom_errors_1.InternalServerError('Error fetching customer transactions', error_1));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getTransactions = getTransactions;
var getSingleTransaction = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, transactionId, transaction, _a, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerId = req.customer.id;
                transactionId = req.params.transactionId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, transaction_model_1.default.findById(transactionId).populate([{ path: 'fromUser' }, { path: 'toUser' }])];
            case 2:
                transaction = _b.sent();
                if (!transaction) return [3 /*break*/, 4];
                _a = transaction;
                return [4 /*yield*/, transaction.getIsCredit(customerId)];
            case 3:
                _a.isCredit = _b.sent();
                _b.label = 4;
            case 4:
                res.status(200).json({ message: 'transaction retrieved successfully', success: true, data: transaction });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                next(new custom_errors_1.InternalServerError('Error fetching customer transactions', error_2));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getSingleTransaction = getSingleTransaction;
exports.CustomerTransactionController = {
    getTransactions: exports.getTransactions,
    getSingleTransaction: exports.getSingleTransaction
};
