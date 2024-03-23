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
exports.CustomerExploreController = exports.exploreContractors = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var schedule_util_1 = require("../../../utils/schedule.util");
var exploreContractors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, distance, latitude, longitude, emergencyJobs, category, location_1, city, country, address, accountType, date, isOffDuty, availableDays, experienceYear, gstNumber, availableDaysArray, pipeline, contractorIdsWithDateInSchedule, contractors, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.query, distance = _a.distance, latitude = _a.latitude, longitude = _a.longitude, emergencyJobs = _a.emergencyJobs, category = _a.category, location_1 = _a.location, city = _a.city, country = _a.country, address = _a.address, accountType = _a.accountType, date = _a.date, isOffDuty = _a.isOffDuty, availableDays = _a.availableDays, experienceYear = _a.experienceYear, gstNumber = _a.gstNumber;
                availableDaysArray = availableDays ? availableDays.split(',') : [];
                pipeline = [
                    {
                        $lookup: {
                            from: "contractor_profiles",
                            localField: "profile",
                            foreignField: "_id",
                            as: "profile"
                        }
                    },
                    { $unwind: "$profile" },
                    {
                        $addFields: {
                            name: {
                                $cond: {
                                    if: {
                                        $or: [
                                            { $eq: ['$accountType', contractor_model_1.CONTRACTOR_TYPES.INDIVIDUAL] },
                                            { $eq: ['$accountType', contractor_model_1.CONTRACTOR_TYPES.EMPLOYEE] }
                                        ]
                                    },
                                    then: { $concat: ['$firstName', ' ', '$lastName'] },
                                    else: '$companyName'
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            stripeIdentity: 0, // Exclude stripeIdentity field from query results
                            stripeCustomer: 0, // 
                            stripePaymentMethods: 0,
                            stripePaymentMethod: 0,
                            passwordOtp: 0,
                            password: 0,
                            emailOtp: 0,
                            dateOfBirth: 0,
                            "profile.previousJobPhotos": 0,
                            "profile.previousJobVideos": 0,
                        }
                    }
                ];
                // Add stages conditionally based on query parameters
                if (category) {
                    pipeline.push({ $match: { "profile.skill": { $regex: new RegExp(category, 'i') } } });
                }
                if (country) {
                    pipeline.push({ $match: { "profile.location.country": { $regex: new RegExp(country, 'i') } } });
                }
                if (city) {
                    pipeline.push({ $match: { "profile.location.city": { $regex: new RegExp(city, 'i') } } });
                }
                if (address) {
                    pipeline.push({ $match: { "profile.location.address": { $regex: new RegExp(address, 'i') } } });
                }
                if (accountType) {
                    pipeline.push({ $match: { "accountType": accountType } });
                }
                if (experienceYear) {
                    pipeline.push({ $match: { "profile.experienceYear": parseInt(experienceYear) } });
                }
                if (emergencyJobs !== undefined) {
                    pipeline.push({ $match: { "profile.emergencyJobs": emergencyJobs === "true" } });
                }
                if (isOffDuty !== undefined) {
                    pipeline.push({ $match: { "profile.isOffDuty": isOffDuty === "true" || null } });
                }
                if (gstNumber) {
                    pipeline.push({ $match: { "profile.gstNumber": gstNumber } });
                }
                if (!date) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, schedule_util_1.getContractorIdsWithDateInSchedule)(new Date(date))];
            case 2:
                contractorIdsWithDateInSchedule = _b.sent();
                // console.log(contractorIdsWithDateInSchedule)
                pipeline.push({ $match: { "profile.contractor": { $in: contractorIdsWithDateInSchedule } } });
                _b.label = 3;
            case 3:
                if (availableDays) {
                    pipeline.push({ $match: { "profile.availableDays": { $in: availableDaysArray } } });
                }
                if (distance && latitude && longitude) {
                    pipeline.push({
                        $addFields: {
                            distance: {
                                $sqrt: {
                                    $sum: [
                                        { $pow: [{ $subtract: [{ $toDouble: "$profile.location.latitude" }, parseFloat(latitude)] }, 2] },
                                        { $pow: [{ $subtract: [{ $toDouble: "$profile.location.longitude" }, parseFloat(longitude)] }, 2] }
                                    ]
                                }
                            }
                        }
                    });
                    pipeline.push({ $match: { "distance": { $lte: parseInt(distance) } } });
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.aggregate(pipeline)];
            case 4:
                contractors = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: "Contractors retrieved successfully",
                        data: contractors
                    })];
            case 5:
                err_1 = _b.sent();
                // Handle error
                console.error("Error fetching contractors:", err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.exploreContractors = exploreContractors;
exports.CustomerExploreController = {
    exploreContractors: exports.exploreContractors
};
