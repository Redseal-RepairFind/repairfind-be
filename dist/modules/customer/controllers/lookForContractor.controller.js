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
exports.customerGetSingleContractorOnSkillController = exports.customerGetAllContractorOnSkillController = exports.customerSearchForContractorController = exports.customerGetPopularContractorController = void 0;
var express_validator_1 = require("express-validator");
var contractorDocumentValidate_model_1 = __importDefault(require("../../../database/contractor/models/contractorDocumentValidate.model"));
var contractorAvaliability_model_1 = __importDefault(require("../../../database/contractor/models/contractorAvaliability.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractorRating_model_1 = __importDefault(require("../../../database/contractor/models/contractorRating.model"));
var contractorBankDetail_model_1 = __importDefault(require("../../../database/contractor/models/contractorBankDetail.model"));
var days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednessday', 'Thurday', 'Wednessday', 'Friday', 'Saturday'
];
//get pupular contractor /////////////
var customerGetPopularContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, customer, customerId, pipeline, poplar, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                pipeline = [
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
                        $limit: 5,
                    },
                ];
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.aggregate(pipeline)];
            case 1:
                poplar = _b.sent();
                res.json({
                    poplar: poplar
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.customerGetPopularContractorController = customerGetPopularContractorController;
//search for contractor /////////////
var customerSearchForContractorController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, skill, errors, customer, customerId, contractors, searchContractors, i, searchContractor, bankDetail, contractor, availability, rating, contractorRating, obj, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body;
                skill = req.query.skill;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                contractors = [];
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.find({ skill: { $regex: new RegExp(skill, 'i') }, verified: true })];
            case 1:
                searchContractors = _b.sent();
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < searchContractors.length)) return [3 /*break*/, 8];
                searchContractor = searchContractors[i];
                if (!searchContractor.verified)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, contractorBankDetail_model_1.default.findOne({ contractorId: searchContractor.contractorId })];
            case 3:
                bankDetail = _b.sent();
                if (!bankDetail)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: searchContractor.contractorId })];
            case 4:
                contractor = _b.sent();
                if (!contractor)
                    return [3 /*break*/, 7];
                if (contractor.status != 'active')
                    return [3 /*break*/, 7];
                return [4 /*yield*/, contractorAvaliability_model_1.default.find({ contractorId: searchContractor.contractorId })];
            case 5:
                availability = _b.sent();
                if (availability.length < 1)
                    return [3 /*break*/, 7];
                rating = null;
                return [4 /*yield*/, contractorRating_model_1.default.findOne({ contractorId: searchContractor.contractorId })];
            case 6:
                contractorRating = _b.sent();
                if (contractorRating) {
                    rating = contractorRating;
                }
                obj = {
                    contractor: searchContractor,
                    rating: rating,
                    availability: availability
                };
                contractors.push(obj);
                _b.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 2];
            case 8:
                res.json({
                    contractors: contractors
                });
                return [3 /*break*/, 10];
            case 9:
                err_2 = _b.sent();
                // signup error
                console.log("error", err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.customerSearchForContractorController = customerSearchForContractorController;
//get contractors on skill /////////////
var customerGetAllContractorOnSkillController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, skill, errors, customer, customerId, contractorWithSkills, contractors, i, contractorWithSkill, contractoAvailabilitys, contractorProfile, bankDetail, rating, contractorRating, obj, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body;
                skill = req.query.skill;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.find({ skill: skill, verified: true })];
            case 1:
                contractorWithSkills = _b.sent();
                contractors = [];
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < contractorWithSkills.length)) return [3 /*break*/, 8];
                contractorWithSkill = contractorWithSkills[i];
                return [4 /*yield*/, contractorAvaliability_model_1.default.find({ contractorId: contractorWithSkill.contractorId })];
            case 3:
                contractoAvailabilitys = _b.sent();
                if (contractoAvailabilitys.length < 1)
                    return [3 /*break*/, 7];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorWithSkill.contractorId }).select('-password')];
            case 4:
                contractorProfile = _b.sent();
                if ((contractorProfile === null || contractorProfile === void 0 ? void 0 : contractorProfile.status) != 'active')
                    return [3 /*break*/, 7];
                return [4 /*yield*/, contractorBankDetail_model_1.default.findOne({ contractorId: contractorWithSkill.contractorId })];
            case 5:
                bankDetail = _b.sent();
                if (!bankDetail)
                    return [3 /*break*/, 7];
                rating = null;
                return [4 /*yield*/, contractorRating_model_1.default.findOne({ contractorId: contractorWithSkill.contractorId })];
            case 6:
                contractorRating = _b.sent();
                if (contractorRating) {
                    rating = contractorRating;
                }
                obj = {
                    contractorDetail: contractorWithSkill,
                    profile: contractorProfile,
                    rating: rating,
                    availability: contractoAvailabilitys
                };
                contractors.push(obj);
                _b.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 2];
            case 8:
                res.json({
                    contractors: contractors
                });
                return [3 /*break*/, 10];
            case 9:
                err_3 = _b.sent();
                // signup error
                console.log("erorr", err_3);
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.customerGetAllContractorOnSkillController = customerGetAllContractorOnSkillController;
//customer get single contractor contractors on skill /////////////
var customerGetSingleContractorOnSkillController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, skill, contractorId, files, errors, customer, customerId, contractorWithSkill, contractoAvailabilitys, contractorProfile, bankDetail, rating, contractorRating, artisan, err_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                _a = req.body;
                _b = req.query, skill = _b.skill, contractorId = _b.contractorId;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customer = req.customer;
                customerId = customer.id;
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ skill: skill, contractorId: contractorId, verified: true })];
            case 1:
                contractorWithSkill = _c.sent();
                if (!contractorWithSkill) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan with this skill do not exist" })];
                }
                return [4 /*yield*/, contractorAvaliability_model_1.default.find({ contractorId: contractorWithSkill.contractorId })];
            case 2:
                contractoAvailabilitys = _c.sent();
                if (contractoAvailabilitys.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan with this skill do not exist" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorWithSkill.contractorId }).select('-password')];
            case 3:
                contractorProfile = _c.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan with this skill do not exist" })];
                }
                if (contractorProfile.status != 'active') {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan with this skill do not exist" })];
                }
                return [4 /*yield*/, contractorBankDetail_model_1.default.findOne({ contractorId: contractorWithSkill.contractorId })];
            case 4:
                bankDetail = _c.sent();
                if (!bankDetail) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan with this skill do not exist" })];
                }
                rating = null;
                return [4 /*yield*/, contractorRating_model_1.default.findOne({ contractorId: contractorWithSkill.contractorId })];
            case 5:
                contractorRating = _c.sent();
                if (contractorRating) {
                    rating = contractorRating;
                }
                artisan = {
                    contractorDetail: contractorWithSkill,
                    profile: contractorProfile,
                    rating: rating,
                    availability: contractoAvailabilitys
                };
                res.json({
                    artisan: artisan
                });
                return [3 /*break*/, 7];
            case 6:
                err_4 = _c.sent();
                // signup error
                console.log("erorr", err_4);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.customerGetSingleContractorOnSkillController = customerGetSingleContractorOnSkillController;
