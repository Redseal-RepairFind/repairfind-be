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
exports.ContractorSearch = exports.customerFilterContractoController = exports.customerSearchForCategoryController = exports.customerSearchForContractorByCategoryAndDateController = exports.customerSearchForContractorByLocatinController = void 0;
var express_validator_1 = require("express-validator");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var latitudeLogitudeCal_1 = require("../../../utils/latitudeLogitudeCal");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
//custome search for contractor by location controller /////////////
var customerSearchForContractorByLocatinController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var location_1, files, errors, customer, customerId, searchContractors, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                location_1 = req.query.location;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({
                        $or: [
                            { "location.address": { $regex: new RegExp(location_1, 'i') } },
                            { "location.city": { $regex: new RegExp(location_1, 'i') } },
                            { "location.region": { $regex: new RegExp(location_1, 'i') } },
                            { "location.country": { $regex: new RegExp(location_1, 'i') } },
                        ]
                    })];
            case 1:
                searchContractors = _a.sent();
                res.json({
                    success: true,
                    data: searchContractors
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                // signup error
                console.log("error", err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.customerSearchForContractorByLocatinController = customerSearchForContractorByLocatinController;
//custome search for contractor by category and date controller /////////////
var customerSearchForContractorByCategoryAndDateController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category, date, files, errors, customer, customerId, searchContractors, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, category = _a.category, date = _a.date;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({
                        $and: [
                            { skill: { $regex: new RegExp(category, 'i') } },
                            { availableDays: { $regex: new RegExp(date, 'i') } },
                        ]
                    })];
            case 1:
                searchContractors = _b.sent();
                res.json({
                    success: true,
                    data: searchContractors
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                // signup error
                console.log("error", err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.customerSearchForContractorByCategoryAndDateController = customerSearchForContractorByCategoryAndDateController;
//custome search for category controller /////////////
var customerSearchForCategoryController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var category, files, errors, customer, customerId, pipeline, searchCategory, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                category = req.query.category;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                pipeline = [
                    {
                        $match: {
                            skill: {
                                $regex: new RegExp(category, 'i') // Case-insensitive regex matching
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$skill',
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $sort: { count: -1 },
                    },
                    {
                        $limit: 10,
                    },
                ];
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.aggregate(pipeline)];
            case 1:
                searchCategory = _a.sent();
                res.json({
                    success: true,
                    data: searchCategory
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                // signup error
                console.log("error", err_3);
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.customerSearchForCategoryController = customerSearchForCategoryController;
//custome filter contractor controller /////////////
var customerFilterContractoController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, distance, emergency, category, location_2, accountType, date, files, errors, customer, customerId, lanLong, searchContractors, output, i, searchContractor, contractorProfile, obj, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.query, distance = _a.distance, emergency = _a.emergency, category = _a.category, location_2 = _a.location, accountType = _a.accountType, date = _a.date;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                lanLong = (0, latitudeLogitudeCal_1.latitudeLongitudeCal)(parseFloat(distance), 180);
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({
                        $and: [
                            { emergencyJobs: emergency },
                            {
                                $or: [
                                    { "location.address": { $regex: new RegExp(location_2, 'i') } },
                                    { "location.city": { $regex: new RegExp(location_2, 'i') } },
                                    { "location.region": { $regex: new RegExp(location_2, 'i') } },
                                    { "location.country": { $regex: new RegExp(location_2, 'i') } },
                                    { "location.latitude": { $regex: new RegExp(lanLong.latitude.toString(), 'i') } },
                                    { "location.longitude": { $regex: new RegExp(lanLong.longitude.toString(), 'i') } },
                                ]
                            },
                            { availableDays: { $regex: new RegExp(date, 'i') } },
                            { skill: { $regex: new RegExp(category, 'i') } },
                        ]
                    }).limit(50)];
            case 1:
                searchContractors = _b.sent();
                output = [];
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < searchContractors.length)) return [3 /*break*/, 5];
                searchContractor = searchContractors[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({
                        $and: [
                            { _id: searchContractor.contractor },
                            { accountType: { $regex: new RegExp(accountType, 'i') } },
                        ]
                    }).select('-password')];
            case 3:
                contractorProfile = _b.sent();
                obj = {
                    searchContractor: searchContractor,
                    contractorProfile: contractorProfile
                };
                output.push(obj);
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                res.json({
                    success: true,
                    data: output
                });
                return [3 /*break*/, 7];
            case 6:
                err_4 = _b.sent();
                // signup error
                console.log("error", err_4);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.customerFilterContractoController = customerFilterContractoController;
exports.ContractorSearch = {
    customerSearchForContractorByLocatinController: exports.customerSearchForContractorByLocatinController,
    customerSearchForContractorByCategoryAndDateController: exports.customerSearchForContractorByCategoryAndDateController,
    customerSearchForCategoryController: exports.customerSearchForCategoryController,
    customerFilterContractoController: exports.customerFilterContractoController
};
