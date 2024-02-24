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
exports.AdminGetAppDetailController = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var transaction_model_1 = __importDefault(require("../../../database/admin/models/transaction.model"));
//get app detail /////////////
var AdminGetAppDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, admin, adminId, totalCustomer, totalContractor, totalJob, totalRequestRejectedJobByContrator, totalPendingJob, totalPendingJobOne, totalPendingJobTwo, totalPendingJobTre, totalPendingJobFor, totalProgressJob, totalProgressJobOne, totalProgressJobTwo, totalCompletedJob, totalComplainedJob, totalRevenue, transactions, i, transaction, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 14, , 15]);
                _a = req.query;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, customer_model_1.default.countDocuments()];
            case 1:
                totalCustomer = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments()];
            case 2:
                totalContractor = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments()];
            case 3:
                totalJob = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "job reject" })
                    //get total pending job detail
                ];
            case 4:
                totalRequestRejectedJobByContrator = _b.sent();
                totalPendingJob = 0;
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "sent request" })];
            case 5:
                totalPendingJobOne = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "sent qoutation" })];
            case 6:
                totalPendingJobTwo = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "qoutation payment open" })];
            case 7:
                totalPendingJobTre = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "inspection payment open" })];
            case 8:
                totalPendingJobFor = _b.sent();
                totalPendingJob = totalPendingJobOne + totalPendingJobTwo + totalPendingJobTre + totalPendingJobFor;
                totalProgressJob = 0;
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "qoutation payment confirm and job in progress" })];
            case 9:
                totalProgressJobOne = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "completed" })];
            case 10:
                totalProgressJobTwo = _b.sent();
                totalProgressJob = totalProgressJobOne + totalProgressJobTwo;
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "comfirmed" })
                    //get total complain job detail
                ];
            case 11:
                totalCompletedJob = _b.sent();
                return [4 /*yield*/, job_model_1.default.countDocuments({ status: "complain" })
                    // get total revenue
                ];
            case 12:
                totalComplainedJob = _b.sent();
                totalRevenue = 0;
                return [4 /*yield*/, transaction_model_1.default.find({ type: "credit" })];
            case 13:
                transactions = _b.sent();
                for (i = 0; i < transactions.length; i++) {
                    transaction = transactions[i];
                    totalRevenue = totalRevenue + transaction.amount;
                }
                res.json({
                    totalCustomer: totalCustomer,
                    totalContractor: totalContractor,
                    totalJob: totalJob,
                    totalRequestRejectedJobByContrator: totalRequestRejectedJobByContrator,
                    totalPendingJob: totalPendingJob,
                    totalProgressJob: totalProgressJob,
                    totalCompletedJob: totalCompletedJob,
                    totalComplainedJob: totalComplainedJob,
                    totalRevenue: totalRevenue,
                });
                return [3 /*break*/, 15];
            case 14:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetAppDetailController = AdminGetAppDetailController;
