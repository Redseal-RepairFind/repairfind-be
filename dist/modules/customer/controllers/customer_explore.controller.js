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
exports.CustomerExploreController = exports.getContractorSchedules = exports.getFavoriteContractors = exports.getContractorReviews = exports.getSingleContractor = exports.exploreContractors = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var mongoose_1 = require("mongoose"); // Import Document type from mongoose
var schedule_util_1 = require("../../../utils/schedule.util");
var api_feature_1 = require("../../../utils/api.feature");
var custom_errors_1 = require("../../../utils/custom.errors");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var date_fns_1 = require("date-fns");
var contractor_schedule_model_1 = require("../../../database/contractor/models/contractor_schedule.model");
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
var review_model_1 = require("../../../database/common/review.model");
var customer_favorite_contractors_model_1 = __importDefault(require("../../../database/customer/models/customer_favorite_contractors.model"));
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = require("../../../database/common/job.model");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var exploreContractors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, customerId, _a, data, error, customer, _b, searchName, listing, minDistance, maxDistance, radius, _c, latitude, _d, longitude, emergencyJobs, category, location_1, city, country, address, accountType, date, isOffDuty, availability, experienceYear, gstNumber, _e, page, _f, limit, sort, minResponseTime, maxResponseTime, sortByResponseTime, availableDaysArray, skip, toRadians, pipeline, contractorIdsWithDateInSchedule, _g, sortField, sortOrder, sortStage, result, contractors, metadata, err_1;
    var _h;
    var _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = (_j = req === null || req === void 0 ? void 0 : req.customer) === null || _j === void 0 ? void 0 : _j.id;
                if (!!customerId) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(contractor_model_1.ContractorModel.find({ accountType: contractor_interface_1.CONTRACTOR_TYPES.Individual }), {})];
            case 1:
                _a = _m.sent(), data = _a.data, error = _a.error;
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Contractors retrieved successfully', data: data })];
            case 2: return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 3:
                customer = _m.sent();
                _m.label = 4;
            case 4:
                _m.trys.push([4, 8, , 9]);
                _b = req.query, searchName = _b.searchName, listing = _b.listing, minDistance = _b.minDistance, maxDistance = _b.maxDistance, radius = _b.radius, _c = _b.latitude, latitude = _c === void 0 ? Number((_k = customer === null || customer === void 0 ? void 0 : customer.location) === null || _k === void 0 ? void 0 : _k.latitude) : _c, _d = _b.longitude, longitude = _d === void 0 ? Number((_l = customer === null || customer === void 0 ? void 0 : customer.location) === null || _l === void 0 ? void 0 : _l.longitude) : _d, emergencyJobs = _b.emergencyJobs, category = _b.category, location_1 = _b.location, city = _b.city, country = _b.country, address = _b.address, accountType = _b.accountType, date = _b.date, isOffDuty = _b.isOffDuty, availability = _b.availability, experienceYear = _b.experienceYear, gstNumber = _b.gstNumber, _e = _b.page, page = _e === void 0 ? 1 : _e, _f = _b.limit, limit = _f === void 0 ? 10 : _f, sort = _b.sort, minResponseTime = _b.minResponseTime, maxResponseTime = _b.maxResponseTime, sortByResponseTime = _b.sortByResponseTime;
                availableDaysArray = availability ? availability.split(',') : [];
                skip = (parseInt(page) - 1) * parseInt(limit);
                toRadians = function (degrees) { return degrees * (Math.PI / 180); };
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
                                            { $eq: ['$accountType', contractor_interface_1.CONTRACTOR_TYPES.Individual] },
                                            { $eq: ['$accountType', contractor_interface_1.CONTRACTOR_TYPES.Employee] }
                                        ]
                                    },
                                    then: { $concat: ['$firstName', ' ', '$lastName'] },
                                    else: '$companyName'
                                }
                            },
                            rating: { $avg: '$reviews.averageRating' }, // Calculate average rating using $avg
                            reviewCount: { $size: '$reviews' }, // Calculate average rating using $avg
                            stripeAccountStatus: {
                                details_submitted: "$stripeAccount.details_submitted",
                                payouts_enabled: "$stripeAccount.payouts_enabled",
                                charges_enabled: "$stripeAccount.charges_enabled",
                                // transfers_enabled: { $ifNull: ["$stripeAccount.capabilities.transfers", "inactive"] },
                                // card_payments_enabled: { $ifNull: ["$stripeAccount.capabilities.card_payments", "inactive"] },
                                transfers_enabled: {
                                    $cond: {
                                        if: { $ifNull: ["$stripeAccount.capabilities.transfers", "inactive"] }, //{ $eq: ["$stripeAccount.capabilities.transfers", "active"] },
                                        then: true,
                                        else: false
                                    }
                                },
                                card_payments_enabled: {
                                    $cond: {
                                        if: { $ifNull: ["$stripeAccount.capabilities.card_payments", "inactive"] }, //{ $eq: ["$stripeAccount.capabilities.card_payments", "active"] },
                                        then: true,
                                        else: false
                                    }
                                },
                                status: {
                                    $cond: {
                                        if: {
                                            $and: [
                                                { $eq: ["$stripeAccount.capabilities.card_payments", "active"] },
                                                { $eq: ["$stripeAccount.capabilities.transfers", "active"] }
                                            ]
                                        },
                                        then: 'active',
                                        else: 'inactive'
                                    }
                                }
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "job_quotations",
                            localField: "_id",
                            foreignField: "contractor",
                            as: "quotations"
                        }
                    },
                    {
                        $addFields: {
                            distance: {
                                $round: [
                                    {
                                        $multiply: [
                                            6371, // Earth's radius in km
                                            {
                                                $acos: {
                                                    $add: [
                                                        {
                                                            $multiply: [
                                                                { $sin: toRadians(latitude) },
                                                                { $sin: { $toDouble: { $multiply: [{ $toDouble: "$profile.location.latitude" }, (Math.PI / 180)] } } }
                                                            ]
                                                        },
                                                        {
                                                            $multiply: [
                                                                { $cos: toRadians(latitude) },
                                                                { $cos: { $toDouble: { $multiply: [{ $toDouble: "$profile.location.latitude" }, (Math.PI / 180)] } } },
                                                                { $cos: { $subtract: [{ $toDouble: { $multiply: [{ $toDouble: "$profile.location.longitude" }, (Math.PI / 180)] } }, toRadians(longitude)] } }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    0
                                ]
                            },
                        }
                    },
                    {
                        $addFields: {
                            avgResponseTime: {
                                $avg: "$quotations.responseTime"
                            },
                            expiresIn: {
                                $cond: {
                                    if: { $and: [{ $gt: ["$expiryDate", null] }, { $gt: ["$createdAt", null] }] },
                                    then: {
                                        $ceil: {
                                            $divide: [
                                                { $subtract: ["$expiryDate", "$$NOW"] },
                                                1000 * 60 * 60 * 24
                                            ]
                                        }
                                    },
                                    else: null
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            stripeIdentity: 0,
                            stripeCustomer: 0,
                            stripeAccount: 0,
                            stripePaymentMethods: 0,
                            stripePaymentMethod: 0,
                            passwordOtp: 0,
                            password: 0,
                            emailOtp: 0,
                            dateOfBirth: 0,
                            reviews: 0,
                            onboarding: 0,
                        }
                    },
                    //example filter out who do not have stripe account
                    // { $match: { "stripeAccountStatus.status": 'active' } },
                    // filter out contractors without certn approval
                    { $match: { "certnDetails.report_status": 'COMPLETE' } },
                    //example filter out employees and contractors 
                    { $match: { accountType: { $ne: contractor_interface_1.CONTRACTOR_TYPES.Employee } } },
                    { $match: { "profile.isOffDuty": { $eq: false } } }
                ];
                if (customerId) {
                    pipeline.push({
                        $lookup: {
                            from: "blocked_users",
                            let: { contractorId: "$_id" }, // Passing contractor's ID as a variable
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$customer", new mongoose_1.Types.ObjectId(customerId)] }, // Customer is the one checking
                                                { $eq: ["$contractor", "$$contractorId"] } // Contractor is blocked
                                            ]
                                        }
                                    }
                                }
                            ],
                            as: "blockStatus" // Save the result of the lookup in the "blockStatus" field
                        }
                    }, {
                        // Exclude contractors who have block statuses in the "blockStatus" array
                        $match: {
                            blockStatus: { $eq: [] } // Ensure only contractors who are not blocked by the customer are included
                        }
                    });
                }
                if (searchName) {
                    pipeline.push({ $match: { "name": { $regex: new RegExp(searchName, 'i') } } });
                }
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
                if (!date) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, schedule_util_1.getContractorIdsWithDateInSchedule)(new Date(date))];
            case 5:
                contractorIdsWithDateInSchedule = _m.sent();
                pipeline.push({ $match: { "profile.contractor": { $in: contractorIdsWithDateInSchedule } } });
                _m.label = 6;
            case 6:
                if (availability) {
                    pipeline.push({ $match: { "profile.availability": { $in: availableDaysArray } } });
                }
                if (radius) {
                    pipeline.push({ $match: { "distance": { $lte: parseInt(radius) } } });
                }
                if (minDistance !== undefined) {
                    pipeline.push({ $match: { "distance": { $gte: parseInt(minDistance) } } });
                }
                if (maxDistance !== undefined) {
                    pipeline.push({ $match: { "distance": { $lte: parseInt(maxDistance) } } });
                }
                if (minResponseTime !== undefined) {
                    minResponseTime = minResponseTime * 1000;
                    pipeline.push({ $match: { "avgResponseTime": { $gte: parseInt(minResponseTime) } } });
                }
                if (maxResponseTime !== undefined) {
                    maxResponseTime = maxResponseTime * 1000;
                    pipeline.push({ $match: { "avgResponseTime": { $lte: parseInt(maxResponseTime) } } });
                }
                // if (sortByResponseTime !== undefined) {
                //     const sortOrder = sortByResponseTime === "asc" ? 1 : -1;
                //     pipeline.push({ $sort: { avgResponseTime: sortOrder } });
                // }
                if (sort) {
                    _g = sort.startsWith('-') ? [sort.slice(1), -1] : [sort, 1], sortField = _g[0], sortOrder = _g[1];
                    sortStage = {
                        //@ts-ignore
                        $sort: (_h = {}, _h[sortField] = sortOrder, _h)
                    };
                    pipeline.push(sortStage);
                }
                switch (listing) {
                    case 'recommended':
                        pipeline.push({ $sample: { size: 10 } } // Randomly sample 10 contractors
                        );
                        break;
                    case 'top-rated':
                        // Logic to fetch top-rated contractors
                        pipeline.push({ $match: { averageRating: { $exists: true } } });
                        break;
                    case 'featured':
                        // Logic to fetch featured contractors
                        pipeline.push({ $match: { isFeatured: true } } // Filter contractors marked as featured
                        );
                        break;
                    default:
                        // Default logic if type is not specified or invalid
                        // You can handle this case based on your requirements
                        break;
                }
                // Add $facet stage for pagination
                pipeline.push({
                    $facet: {
                        metadata: [
                            { $count: "totalItems" },
                            { $addFields: { page: page, limit: limit, currentPage: parseInt(page), lastPage: { $ceil: { $divide: ["$totalItems", parseInt(limit)] } }, listing: listing } }
                        ],
                        data: [{ $skip: skip }, { $limit: parseInt(limit) }]
                    }
                });
                return [4 /*yield*/, contractor_model_1.ContractorModel.aggregate(pipeline)];
            case 7:
                result = _m.sent();
                contractors = result[0].data;
                metadata = result[0].metadata[0];
                // Send response
                res.status(200).json({ success: true, data: __assign(__assign({}, metadata), { data: contractors }) });
                return [3 /*break*/, 9];
            case 8:
                err_1 = _m.sent();
                console.error("Error fetching contractors:", err_1);
                res.status(400).json({ message: 'Something went wrong' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.exploreContractors = exploreContractors;
var getSingleContractor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, contractor, _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                contractorId = req.params.contractorId;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId).populate([
                        { path: 'profile' },
                    ])];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                _a = contractor;
                return [4 /*yield*/, contractor.getStats()];
            case 2:
                _a.stats = _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Contractor  found', data: contractor })];
            case 3:
                error_1 = _b.sent();
                next(new custom_errors_1.BadRequestError('An error occurred', error_1));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSingleContractor = getSingleContractor;
var getContractorReviews = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, contractor, filter, _a, data, error, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                contractorId = req.params.contractorId;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId).populate([
                        { path: 'profile' },
                    ])];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                filter = { contractor: contractorId };
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(review_model_1.ReviewModel.find(filter).populate(['customer']), req.query)];
            case 2:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (!data) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(data.data.map(function (review) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = review;
                                    return [4 /*yield*/, review.getHeading()];
                                case 1:
                                    _a.heading = _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [2 /*return*/, res.status(200).json({ success: true, message: 'Contractor reviews  retrieved', data: data })];
            case 5:
                error_2 = _b.sent();
                next(new custom_errors_1.BadRequestError('An error occurred', error_2));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getContractorReviews = getContractorReviews;
var getFavoriteContractors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, favorites, favoriteIds, filter, _a, data, error, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                return [4 /*yield*/, customer_favorite_contractors_model_1.default.find({ customer: customerId }).select('contractor')];
            case 1:
                favorites = _b.sent();
                favoriteIds = favorites.map(function (fav) { return fav.contractor; });
                filter = { _id: { $in: favoriteIds } };
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(contractor_model_1.ContractorModel.find(filter), req.query)];
            case 2:
                _a = _b.sent(), data = _a.data, error = _a.error;
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Favorite contractors  retrieved', data: data })];
            case 3:
                error_3 = _b.sent();
                next(new custom_errors_1.BadRequestError('An error occurred', error_3));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getFavoriteContractors = getFavoriteContractors;
var getContractorSchedules = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, month, contractorId_1, contractorProfile, startDate_1, endDate_1, expandedSchedules, jobs, jobSchedules, contractorExistingSchedules, existingSchedules, mergedSchedules_1, uniqueSchedules, filterAvailableTimes, updatedSchedules, groupedSchedules, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.query, year = _a.year, month = _a.month;
                contractorId_1 = req.params.contractorId;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId_1 })];
            case 1:
                contractorProfile = _b.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                if (year && !(0, date_fns_1.isValid)(new Date("".concat(year, "-01-01")))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid year format' })];
                }
                if (!year) {
                    year = new Date().getFullYear().toString();
                }
                if (month) {
                    // If month is specified, retrieve schedules for that month
                    if (!(0, date_fns_1.isValid)(new Date("".concat(year, "-").concat(month, "-01")))) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid month format' })];
                    }
                    startDate_1 = (0, date_fns_1.startOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                    endDate_1 = (0, date_fns_1.endOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                }
                else {
                    // If no month specified, retrieve schedules for the whole year
                    startDate_1 = (0, date_fns_1.startOfYear)(new Date("".concat(year, "-01-01")));
                    endDate_1 = (0, date_fns_1.endOfYear)(new Date("".concat(year, "-12-31")));
                }
                expandedSchedules = (0, schedule_util_1.generateExpandedSchedule)(contractorProfile.availability, year).filter(function (schedule) {
                    return schedule.date >= startDate_1 && schedule.date <= endDate_1;
                });
                return [4 /*yield*/, job_model_1.JobModel.find({
                        contractor: contractorId_1,
                        'schedule.startDate': { $gte: startDate_1, $lte: endDate_1 },
                    }).populate('contract')];
            case 2:
                jobs = _b.sent();
                return [4 /*yield*/, Promise.all(jobs.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var contractor, contract, charges, scheduleDate, startTime, estimatedDuration, start, endTime, times, hour, formattedHour;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                                case 1:
                                    contractor = _c.sent();
                                    return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne(job.contract)];
                                case 2:
                                    contract = _c.sent();
                                    return [4 /*yield*/, (contract === null || contract === void 0 ? void 0 : contract.calculateCharges())
                                        // spread time
                                    ];
                                case 3:
                                    charges = _c.sent();
                                    scheduleDate = job.schedule.startDate;
                                    startTime = scheduleDate ? scheduleDate.toTimeString().slice(0, 8) : "00:00:00";
                                    estimatedDuration = (_a = job.schedule.estimatedDuration) !== null && _a !== void 0 ? _a : 1;
                                    start = new Date(scheduleDate);
                                    start.setHours(start.getHours() + estimatedDuration);
                                    endTime = start.toTimeString().slice(0, 8);
                                    times = [];
                                    // Expand hours from startTime to endTime with one-hour intervals
                                    for (hour = parseInt(startTime.split(":")[0], 10); hour <= parseInt(endTime.split(":")[0], 10); hour++) {
                                        formattedHour = "".concat(hour.toString().padStart(2, '0'), ":00:00");
                                        times.push(formattedHour);
                                    }
                                    return [2 /*return*/, {
                                            date: job.schedule.startDate,
                                            type: job.schedule.type,
                                            contractor: contractor,
                                            times: times,
                                            events: [
                                                {
                                                    //@ts-ignore
                                                    totalAmount: (_b = charges === null || charges === void 0 ? void 0 : charges.customerPayable) !== null && _b !== void 0 ? _b : 0,
                                                    job: job.id,
                                                    skill: job === null || job === void 0 ? void 0 : job.category,
                                                    date: job === null || job === void 0 ? void 0 : job.schedule.startDate,
                                                    estimatedDuration: estimatedDuration
                                                }
                                            ]
                                        }];
                            }
                        });
                    }); }))];
            case 3:
                jobSchedules = _b.sent();
                return [4 /*yield*/, contractor_schedule_model_1.ContractorScheduleModel.find({ contractor: contractorId_1 })];
            case 4:
                contractorExistingSchedules = _b.sent();
                existingSchedules = contractorExistingSchedules.map(function (schedule) {
                    var _a, _b;
                    var startTime = (_a = schedule.startTime) !== null && _a !== void 0 ? _a : "00:00:00";
                    var endTime = (_b = schedule.endTime) !== null && _b !== void 0 ? _b : "23:00:00";
                    var times = [];
                    // Expand hours from startTime to endTime with one-hour intervals
                    for (var hour = parseInt(startTime.split(":")[0], 10); hour <= parseInt(endTime.split(":")[0], 10); hour++) {
                        var formattedHour = "".concat(hour.toString().padStart(2, '0'), ":00:00");
                        times.push(formattedHour);
                    }
                    return {
                        date: schedule.date,
                        type: schedule.type,
                        contractor: schedule.contractor,
                        times: times,
                        events: schedule.events
                    };
                });
                mergedSchedules_1 = __spreadArray(__spreadArray(__spreadArray([], expandedSchedules, true), jobSchedules, true), existingSchedules, true);
                uniqueSchedules = mergedSchedules_1.filter(function (schedule, index) {
                    var date = schedule.date.toDateString();
                    // Check if the current schedule's date is unique within the mergedSchedules array
                    var isFirstOccurrence = mergedSchedules_1.findIndex(function (s) { return s.date.toDateString() === date; }) === index;
                    // Retain the existing schedule and the first occurrence of other dates
                    return schedule.events ? schedule : isFirstOccurrence;
                });
                filterAvailableTimes = function (schedules) {
                    // Create a map of dates to unavailable and job times
                    var conflictTimes = schedules.reduce(function (acc, schedule) {
                        if (schedule.type !== 'available') {
                            var date_1 = new Date(schedule.date).toDateString();
                            if (!acc[date_1])
                                acc[date_1] = new Set();
                            schedule.times.forEach(function (time) { return acc[date_1].add(time); });
                        }
                        return acc;
                    }, {});
                    // Filter out the conflicting times for available schedules
                    return schedules.map(function (schedule) {
                        if (schedule.type === 'available') {
                            var date_2 = new Date(schedule.date).toDateString();
                            if (conflictTimes[date_2]) {
                                schedule.times = schedule.times.filter(function (time) { return !conflictTimes[date_2].has(time); });
                            }
                        }
                        return schedule;
                    });
                };
                updatedSchedules = filterAvailableTimes(uniqueSchedules);
                groupedSchedules = updatedSchedules.reduce(function (acc, schedule) {
                    var key = (0, date_fns_1.format)(new Date(schedule.date), 'yyyy-M');
                    if (!acc[key]) {
                        acc[key] = { schedules: [], summary: {}, events: [] };
                    }
                    schedule.contractor = contractorId_1;
                    acc[key].schedules.push(schedule);
                    // Use the event type as the key for the summary object
                    if (!acc[key].summary[schedule.type]) {
                        acc[key].summary[schedule.type] = [];
                    }
                    acc[key].summary[schedule.type].push((0, date_fns_1.getDate)(new Date(schedule.date)));
                    // console.log((new Date(schedule.date + 'GMT+800').getDate()), schedule.date)
                    // Include events summary if events are defined
                    if (schedule.events) {
                        var eventsSummary = schedule.events.map(function (event) { return ({
                            title: event.title,
                            booking: event.booking,
                            date: event.date,
                            startTime: event.startTime,
                            endTime: event.endTime,
                        }); });
                        acc[key].events = acc[key].events.concat(eventsSummary);
                    }
                    return acc;
                }, {});
                res.json({ success: true, message: 'Contractor schedules retrieved successfully', data: groupedSchedules });
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                console.error('Error retrieving schedules:', error_4);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getContractorSchedules = getContractorSchedules;
exports.CustomerExploreController = {
    exploreContractors: exports.exploreContractors,
    getSingleContractor: exports.getSingleContractor,
    getContractorSchedules: exports.getContractorSchedules,
    getContractorReviews: exports.getContractorReviews,
    getFavoriteContractors: exports.getFavoriteContractors
};
