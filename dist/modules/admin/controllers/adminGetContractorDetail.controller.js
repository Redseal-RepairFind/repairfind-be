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
exports.AdminChangeContractorContractorDetailController = exports.AdminGetSingleContractorDetailController = exports.AdminGetContractorDetailController = void 0;
var express_validator_1 = require("express-validator");
var contractorDocumentValidate_model_1 = __importDefault(require("../../../database/contractor/models/contractorDocumentValidate.model"));
var contractorAvaliability_model_1 = __importDefault(require("../../../database/contractor/models/contractorAvaliability.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var job_model_1 = __importDefault(require("../../../database/contractor/models/job.model"));
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var contractorRating_model_1 = __importDefault(require("../../../database/contractor/models/contractorRating.model"));
//get contractor detail /////////////
var AdminGetContractorDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, contractors, totalContractor, artisans, i, contractor, document_1, availability, jobRequests, rating, contractorRating, jobRequested, i_1, jobRequest, customer, obj, objTwo, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 14, , 15]);
                _a = req.body, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, contractor_model_1.ContractorModel.find()
                        .select('-password')
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)];
            case 1:
                contractors = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments()];
            case 2:
                totalContractor = _b.sent();
                artisans = [];
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < contractors.length)) return [3 /*break*/, 13];
                contractor = contractors[i];
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ contractorId: contractor._id })];
            case 4:
                document_1 = _b.sent();
                return [4 /*yield*/, contractorAvaliability_model_1.default.find({ contractorId: contractor._id })];
            case 5:
                availability = _b.sent();
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractor._id }).sort({ createdAt: -1 })];
            case 6:
                jobRequests = _b.sent();
                rating = null;
                return [4 /*yield*/, contractorRating_model_1.default.findOne({ contractorId: contractor._id })];
            case 7:
                contractorRating = _b.sent();
                if (contractorRating) {
                    rating = contractorRating;
                }
                jobRequested = [];
                i_1 = 0;
                _b.label = 8;
            case 8:
                if (!(i_1 < jobRequests.length)) return [3 /*break*/, 11];
                jobRequest = jobRequests[i_1];
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 9:
                customer = _b.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
                };
                jobRequested.push(obj);
                _b.label = 10;
            case 10:
                i_1++;
                return [3 /*break*/, 8];
            case 11:
                objTwo = {
                    contractorProfile: contractor,
                    rating: rating,
                    document: document_1,
                    availability: availability,
                    jobHistory: jobRequested
                };
                artisans.push(objTwo);
                _b.label = 12;
            case 12:
                i++;
                return [3 /*break*/, 3];
            case 13:
                res.json({
                    totalContractor: totalContractor,
                    artisans: artisans
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
exports.AdminGetContractorDetailController = AdminGetContractorDetailController;
//get  single contractor detail /////////////
var AdminGetSingleContractorDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, errors, admin, adminId, contractor, document_2, availability, jobRequests, rating, contractorRating, jobRequested, i, jobRequest, customer, obj, objTwo, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                contractorId = req.body.contractorId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })
                        .select('-password')];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid artisan ID" })];
                }
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ contractorId: contractor._id })];
            case 2:
                document_2 = _a.sent();
                return [4 /*yield*/, contractorAvaliability_model_1.default.find({ contractorId: contractor._id })];
            case 3:
                availability = _a.sent();
                return [4 /*yield*/, job_model_1.default.find({ contractorId: contractor._id }).sort({ createdAt: -1 })];
            case 4:
                jobRequests = _a.sent();
                rating = null;
                return [4 /*yield*/, contractorRating_model_1.default.findOne({ contractorId: contractor._id })];
            case 5:
                contractorRating = _a.sent();
                if (contractorRating) {
                    rating = contractorRating;
                }
                jobRequested = [];
                i = 0;
                _a.label = 6;
            case 6:
                if (!(i < jobRequests.length)) return [3 /*break*/, 9];
                jobRequest = jobRequests[i];
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: jobRequest.customerId }).select('-password')];
            case 7:
                customer = _a.sent();
                obj = {
                    job: jobRequest,
                    customer: customer
                };
                jobRequested.push(obj);
                _a.label = 8;
            case 8:
                i++;
                return [3 /*break*/, 6];
            case 9:
                objTwo = {
                    contractorProfile: contractor,
                    rating: rating,
                    document: document_2,
                    availability: availability,
                    jobHistory: jobRequested
                };
                res.json({
                    artisan: objTwo
                });
                return [3 /*break*/, 11];
            case 10:
                err_2 = _a.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleContractorDetailController = AdminGetSingleContractorDetailController;
//change contractor status /////////////
var AdminChangeContractorContractorDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_1, contractorId, errors, admin, adminId, contractor, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, status_1 = _a.status, contractorId = _a.contractorId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid artisan ID" })];
                }
                contractor.status = status_1;
                return [4 /*yield*/, contractor.save()];
            case 2:
                _b.sent();
                res.json({
                    message: "artisan status successfully change to ".concat(status_1, ".")
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminChangeContractorContractorDetailController = AdminChangeContractorContractorDetailController;
