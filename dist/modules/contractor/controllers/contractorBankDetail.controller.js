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
exports.contractorGetBankDetailController = exports.contractorEnterBankdetailController = void 0;
var express_validator_1 = require("express-validator");
var contractorBankDetail_model_1 = __importDefault(require("../../../database/contractor/models/contractorBankDetail.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
//contractor enter bank detail/////////////
var contractorEnterBankdetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, financialInstitution, accountNumber, transitNumber, financialInstitutionNumber, errors, contractor, contractorId, contractorExist, checkBackDetail, newBankDetail, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, financialInstitution = _a.financialInstitution, accountNumber = _a.accountNumber, transitNumber = _a.transitNumber, financialInstitutionNumber = _a.financialInstitutionNumber;
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
                return [4 /*yield*/, contractorBankDetail_model_1.default.findOne({ contractorId: contractorId })];
            case 2:
                checkBackDetail = _b.sent();
                if (checkBackDetail) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "bank detail already exist" })];
                }
                newBankDetail = new contractorBankDetail_model_1.default({
                    contractorId: contractorId,
                    financialInstitution: financialInstitution,
                    accountNumber: accountNumber,
                    transitNumber: transitNumber,
                    financialInstitutionNumber: financialInstitutionNumber
                });
                return [4 /*yield*/, newBankDetail.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "bank detail sucessfully save"
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.contractorEnterBankdetailController = contractorEnterBankdetailController;
//contractor get bank detail/////////////
var contractorGetBankDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, backDetail, err_2;
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
                return [4 /*yield*/, contractorBankDetail_model_1.default.findOne({ contractorId: contractorId })];
            case 2:
                backDetail = _b.sent();
                if (!backDetail) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect credential" })];
                }
                res.json({
                    backDetail: backDetail
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
exports.contractorGetBankDetailController = contractorGetBankDetailController;
