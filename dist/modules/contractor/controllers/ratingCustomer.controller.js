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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractorRatingDetailController = exports.contractorRateCustomerController = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customerRating_model_1 = __importDefault(require("../../../database/customer/models/customerRating.model"));
var contractorRatedJob_model_1 = __importDefault(require("../../../database/contractor/models/contractorRatedJob.model"));
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var contractorRating_model_1 = __importDefault(require("../../../database/contractor/models/contractorRating.model"));
//contractor  rate customer
var contractorRateCustomerController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, environment, receptive, courteous, environmentText, receptiveText, courteousText, errors, contractor, contractorId, contractorExist, job, ratedJob, ratingCustumer, avgRating, newRatingCustomer, newRatedJob, ratings, totalEnvironment, totalReceptive, totalCourteous, i, rating, avgEnvironment, avgReceptive, avgCourteous, avgRating, newRatedJob, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = req.body, jobId = _a.jobId, environment = _a.environment, receptive = _a.receptive, courteous = _a.courteous, environmentText = _a.environmentText, receptiveText = _a.receptiveText, courteousText = _a.courteousText;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, contractorId: contractorId })];
            case 2:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid job ID" })];
                }
                return [4 /*yield*/, contractorRatedJob_model_1.default.findOne({ jobId: jobId })];
            case 3:
                ratedJob = _b.sent();
                if (ratedJob) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "you have rated this customer already" })];
                }
                return [4 /*yield*/, customerRating_model_1.default.findOne({ customerId: job.customerId })];
            case 4:
                ratingCustumer = _b.sent();
                if (!!ratingCustumer) return [3 /*break*/, 7];
                avgRating = Math.round(((environment + receptive + courteous) / 15) * 5);
                newRatingCustomer = new customerRating_model_1.default({
                    customerId: job.customerId,
                    rate: [
                        {
                            contractorId: contractorId,
                            jobId: jobId,
                            environment: environment,
                            receptive: receptive,
                            courteous: courteous,
                            environmentText: environmentText,
                            receptiveText: receptiveText,
                            courteousText: courteousText,
                        }
                    ],
                    avgEnvironment: environment,
                    avgReceptive: receptive,
                    avgCourteous: courteous,
                    avgRating: avgRating
                });
                return [4 /*yield*/, newRatingCustomer.save()];
            case 5:
                _b.sent();
                newRatedJob = new contractorRatedJob_model_1.default({
                    jobId: jobId
                });
                return [4 /*yield*/, newRatedJob.save()];
            case 6:
                _b.sent();
                res.json({
                    message: "customer successful rated"
                });
                return [3 /*break*/, 10];
            case 7:
                ratings = __spreadArray(__spreadArray([], ratingCustumer.rate, true), [{
                        contractorId: contractorId,
                        jobId: jobId,
                        environment: environment,
                        receptive: receptive,
                        courteous: courteous,
                        environmentText: environmentText,
                        receptiveText: receptiveText,
                        courteousText: courteousText,
                    }], false);
                totalEnvironment = 0;
                totalReceptive = 0;
                totalCourteous = 0;
                for (i = 0; i < ratings.length; i++) {
                    rating = ratings[i];
                    totalEnvironment = totalEnvironment + rating.environment;
                    totalReceptive = totalReceptive + rating.receptive;
                    totalCourteous = totalCourteous + rating.courteous;
                }
                avgEnvironment = Math.round(totalEnvironment / ratings.length);
                avgReceptive = Math.round(totalReceptive / ratings.length);
                avgCourteous = Math.round(totalCourteous / ratings.length);
                avgRating = Math.round(((avgEnvironment + avgReceptive + avgCourteous) / 15) * 5);
                ratingCustumer.rate = ratings;
                ratingCustumer.avgEnvironment = avgEnvironment;
                ratingCustumer.avgReceptive = avgReceptive;
                ratingCustumer.avgCourteous = avgCourteous;
                ratingCustumer.avgEnvironment = avgRating;
                return [4 /*yield*/, ratingCustumer.save()];
            case 8:
                _b.sent();
                newRatedJob = new contractorRatedJob_model_1.default({
                    jobId: jobId
                });
                return [4 /*yield*/, newRatedJob.save()];
            case 9:
                _b.sent();
                res.json({
                    message: "customer successful rated"
                });
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.contractorRateCustomerController = contractorRateCustomerController;
//contractor rating detail
var contractorRatingDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, contractorRating, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _b.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, contractorRating_model_1.default.findOne({ contractorId: contractorId })];
            case 2:
                contractorRating = _b.sent();
                if (!contractorRating) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "no rating foung" })];
                }
                res.json({
                    message: "customer successful rated"
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.contractorRatingDetailController = contractorRatingDetailController;
