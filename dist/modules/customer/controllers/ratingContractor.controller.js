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
exports.customerRatingDetailController = exports.customerRateContractorController = void 0;
var express_validator_1 = require("express-validator");
var customerReg_model_1 = __importDefault(require("../../../database/customer/models/customerReg.model"));
var contractorRating_model_1 = __importDefault(require("../../../database/contractor/models/contractorRating.model"));
var customerRatedJob_mdel_1 = __importDefault(require("../../../database/customer/models/customerRatedJob.mdel"));
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var customerRating_model_1 = __importDefault(require("../../../database/customer/models/customerRating.model"));
//customer  rate contractor
var customerRateContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, cleanliness, timeliness, skill, communication, courteous, cleanlinessText, timelinessText, skillText, communicationText, courteousText, errors, customer, customerId, checkCustomer, job, ratedJob, ratingContractor, avgRating, newRatingContractor, newRatedJob, ratings, totalCleanliness, totalTimeliness, totalSkill, totalCommunication, totalCourteous, i, rating, avgCleanliness, avgTimeliness, avgSkill, avgCommunication, avgCourteous, avgRating, newRatedJob, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = req.body, jobId = _a.jobId, cleanliness = _a.cleanliness, timeliness = _a.timeliness, skill = _a.skill, communication = _a.communication, courteous = _a.courteous, cleanlinessText = _a.cleanlinessText, timelinessText = _a.timelinessText, skillText = _a.skillText, communicationText = _a.communicationText, courteousText = _a.courteousText;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.default.findOne({ _id: jobId, customerId: customerId })];
            case 2:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid job ID" })];
                }
                return [4 /*yield*/, customerRatedJob_mdel_1.default.findOne({ jobId: jobId })];
            case 3:
                ratedJob = _b.sent();
                if (ratedJob) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "you have rated this contractor already" })];
                }
                return [4 /*yield*/, contractorRating_model_1.default.findOne({ contractorId: job.contractorId })];
            case 4:
                ratingContractor = _b.sent();
                if (!!ratingContractor) return [3 /*break*/, 7];
                avgRating = Math.round(((cleanliness + timeliness + skill + communication + courteous) / 25) * 5);
                newRatingContractor = new contractorRating_model_1.default({
                    contractorId: job.contractorId,
                    rate: [
                        {
                            customerId: customerId,
                            jobId: jobId,
                            cleanliness: cleanliness,
                            timeliness: timeliness,
                            skill: skill,
                            communication: communication,
                            courteous: courteous,
                            cleanlinessText: cleanlinessText,
                            timelinessText: timelinessText,
                            skillText: skillText,
                            communicationText: communicationText,
                            courteousText: courteousText,
                        }
                    ],
                    avgCleanliness: cleanliness,
                    avgTimeliness: timeliness,
                    avgSkill: skill,
                    avgCommunication: communication,
                    avgCourteous: courteous,
                    avgRating: avgRating
                });
                return [4 /*yield*/, newRatingContractor.save()];
            case 5:
                _b.sent();
                newRatedJob = new customerRatedJob_mdel_1.default({
                    jobId: jobId
                });
                return [4 /*yield*/, newRatedJob.save()];
            case 6:
                _b.sent();
                res.json({
                    message: "contractor successful rated"
                });
                return [3 /*break*/, 10];
            case 7:
                ratings = __spreadArray(__spreadArray([], ratingContractor.rate, true), [{
                        customerId: customerId,
                        jobId: jobId,
                        cleanliness: cleanliness,
                        timeliness: timeliness,
                        skill: skill,
                        communication: communication,
                        courteous: courteous,
                        cleanlinessText: cleanlinessText,
                        timelinessText: timelinessText,
                        skillText: skillText,
                        communicationText: communicationText,
                        courteousText: courteousText,
                    }], false);
                totalCleanliness = 0;
                totalTimeliness = 0;
                totalSkill = 0;
                totalCommunication = 0;
                totalCourteous = 0;
                for (i = 0; i < ratings.length; i++) {
                    rating = ratings[i];
                    totalCleanliness = totalCleanliness + rating.cleanliness;
                    totalTimeliness = totalTimeliness + rating.timeliness;
                    totalSkill = totalSkill + rating.skill;
                    totalCommunication = totalCommunication + rating.communication;
                    totalCourteous = totalCourteous + rating.courteous;
                }
                avgCleanliness = Math.round(totalCleanliness / ratings.length);
                avgTimeliness = Math.round(totalTimeliness / ratings.length);
                avgSkill = Math.round(totalSkill / ratings.length);
                avgCommunication = Math.round(totalCommunication / ratings.length);
                avgCourteous = Math.round(totalCourteous / ratings.length);
                avgRating = Math.round(((avgCleanliness + avgTimeliness + avgSkill + avgCommunication + avgCourteous) / 25) * 5);
                ratingContractor.rate = ratings;
                ratingContractor.avgCleanliness = avgCleanliness;
                ratingContractor.avgTimeliness = avgTimeliness;
                ratingContractor.avgSkill = avgSkill;
                ratingContractor.avgCommunication = avgCommunication;
                ratingContractor.avgCourteous = avgCourteous;
                ratingContractor.avgRating = avgRating;
                return [4 /*yield*/, ratingContractor.save()];
            case 8:
                _b.sent();
                newRatedJob = new customerRatedJob_mdel_1.default({
                    jobId: jobId
                });
                return [4 /*yield*/, newRatedJob.save()];
            case 9:
                _b.sent();
                res.json({
                    message: "contractor successful rated"
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
exports.customerRateContractorController = customerRateContractorController;
// customer rating
var customerRatingDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, checkCustomer, customerRating, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, customerReg_model_1.default.findOne({ _id: customerId })];
            case 1:
                checkCustomer = _b.sent();
                if (!checkCustomer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, customerRating_model_1.default.findOne({ customerId: customerId })];
            case 2:
                customerRating = _b.sent();
                if (!customerRating) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "no ratig found" })];
                }
                res.json({
                    customerRating: customerRating
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
exports.customerRatingDetailController = customerRatingDetailController;
