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
exports.contractorEditAvailabilityController = exports.contractorDeleteAvailabilityController = exports.contractorSetNotAvailabilityController = exports.contractorSetAvailabilityController = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractorAvaliability_model_1 = __importDefault(require("../../../database/contractor/models/contractorAvaliability.model"));
//contractor set avaibility /////////////
var contractorSetAvailabilityController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, from, to, days, sos, files, errors, contractor, contractorId, contractorExist, checkNumberOfavailabilty, i, day, checkNumberOfavailabilty_1, newAvailable, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                _a = req.body, from = _a.from, to = _a.to, days = _a.days, sos = _a.sos;
                files = req.files;
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
                return [4 /*yield*/, contractorAvaliability_model_1.default.countDocuments({ contractorId: contractorId })];
            case 2:
                checkNumberOfavailabilty = _b.sent();
                if (checkNumberOfavailabilty >= 7) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "maximun number of availability reach" })];
                }
                i = 0;
                _b.label = 3;
            case 3:
                if (!(i < days.length)) return [3 /*break*/, 7];
                day = days[i];
                return [4 /*yield*/, contractorAvaliability_model_1.default.countDocuments({ contractorId: contractorId })];
            case 4:
                checkNumberOfavailabilty_1 = _b.sent();
                if (checkNumberOfavailabilty_1 >= 7)
                    return [3 /*break*/, 7];
                newAvailable = new contractorAvaliability_model_1.default({
                    contractorId: contractorId,
                    avialable: "yes",
                    time: {
                        from: from,
                        to: to,
                        sos: sos,
                        day: day
                    }
                });
                return [4 /*yield*/, newAvailable.save()];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 3];
            case 7:
                res.json({
                    message: "availability successfully set",
                });
                return [3 /*break*/, 9];
            case 8:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.contractorSetAvailabilityController = contractorSetAvailabilityController;
//contractor set not avaibility /////////////
var contractorSetNotAvailabilityController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, from, to, days, files, errors, contractor, contractorId, contractorExist, i, day, newNotAvailable, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, from = _a.from, to = _a.to, days = _a.days;
                files = req.files;
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
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < days.length)) return [3 /*break*/, 5];
                day = days[i];
                newNotAvailable = new contractorAvaliability_model_1.default({
                    contractorId: contractorId,
                    avialable: "no",
                    time: {
                        from: from,
                        to: to,
                        sos: false,
                        day: day
                    }
                });
                return [4 /*yield*/, newNotAvailable.save()];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                res.json({
                    message: "not availability successfully set",
                });
                return [3 /*break*/, 7];
            case 6:
                err_2 = _b.sent();
                // signup error
                console.log(err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.contractorSetNotAvailabilityController = contractorSetNotAvailabilityController;
//contractor delete availability /////////////
var contractorDeleteAvailabilityController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var avaibilityId, files, errors, contractor, contractorId, contractorExist, deleteAvailable, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                avaibilityId = req.body.avaibilityId;
                files = req.files;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractor = req.contractor;
                contractorId = contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractorExist = _a.sent();
                if (!contractorExist) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, contractorAvaliability_model_1.default.findOneAndDelete({ _id: avaibilityId }, { new: true })];
            case 2:
                deleteAvailable = _a.sent();
                if (!deleteAvailable) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect availability ID" })];
                }
                res.json({
                    message: "availability successfully remove",
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                // signup error
                console.log(err_3);
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.contractorDeleteAvailabilityController = contractorDeleteAvailabilityController;
//contractor edit availability /////////////
var contractorEditAvailabilityController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, avaibilityId, avialable, from, to, sos, day, files, errors, contractor, contractorId, contractorExist, availability, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, avaibilityId = _a.avaibilityId, avialable = _a.avialable, from = _a.from, to = _a.to, sos = _a.sos, day = _a.day;
                files = req.files;
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
                return [4 /*yield*/, contractorAvaliability_model_1.default.findOne({ _id: avaibilityId })];
            case 2:
                availability = _b.sent();
                if (!availability) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect availability ID" })];
                }
                availability.avialable = avialable;
                availability.time.from = from;
                availability.time.to = to;
                availability.time.sos = sos;
                availability.time.day = day;
                return [4 /*yield*/, availability.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "availability successfully updated",
                });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _b.sent();
                // signup error
                console.log(err_4);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.contractorEditAvailabilityController = contractorEditAvailabilityController;
