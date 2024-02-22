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
exports.AdminValidateContractorDocsController = exports.AdminGetSingleContractorDocForValController = exports.AdminGetContractorDocForValController = void 0;
var express_validator_1 = require("express-validator");
var contractorDocumentValidate_model_1 = __importDefault(require("../../../database/contractor/models/contractorDocumentValidate.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var send_email_utility_1 = require("../../../utils/send_email_utility");
var adminToContractorDocValTem_1 = require("../../../templates/email/adminToContractorDocValTem");
//get all contractor document awiting for validation /////////////
var AdminGetContractorDocForValController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, admin, adminId, contractorDocs, pendingDocument, i, contractorDoc, contractorProfile, obj, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.find({ verified: false })];
            case 1:
                contractorDocs = _b.sent();
                pendingDocument = [];
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < contractorDocs.length)) return [3 /*break*/, 5];
                contractorDoc = contractorDocs[i];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorDoc.contractorId }).select('-password')];
            case 3:
                contractorProfile = _b.sent();
                obj = {
                    contractorDocument: contractorDoc,
                    contractorProfile: contractorProfile
                };
                pendingDocument.push(obj);
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                res.json({
                    pendingDocument: pendingDocument
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetContractorDocForValController = AdminGetContractorDocForValController;
//get single contractor document awiting for validation /////////////
var AdminGetSingleContractorDocForValController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorDocsId, errors, admin, adminId, contractorDoc, contractorProfile, pendingDocument, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                contractorDocsId = req.body.contractorDocsId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ _id: contractorDocsId, verified: false })];
            case 1:
                contractorDoc = _a.sent();
                if (!contractorDoc) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid contractor document ID" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorDoc.contractorId }).select('-password')];
            case 2:
                contractorProfile = _a.sent();
                pendingDocument = {
                    contractorDocument: contractorDoc,
                    contractorProfile: contractorProfile
                };
                res.json({
                    pendingDocument: pendingDocument
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleContractorDocForValController = AdminGetSingleContractorDocForValController;
//validate contractor document /////////////
var AdminValidateContractorDocsController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorDocsId, errors, admin, adminId, contractorDoc, contractor, html, emailData, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                contractorDocsId = req.body.contractorDocsId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ _id: contractorDocsId, verified: false })];
            case 1:
                contractorDoc = _a.sent();
                if (!contractorDoc) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid artisan document ID" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorDoc.contractorId })];
            case 2:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan do not exist" })];
                }
                if (contractorDoc.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "artisan document already verified" })];
                }
                contractorDoc.verified = true;
                return [4 /*yield*/, contractorDoc.save()
                    // contractor.documentVerification = true;
                ];
            case 3:
                _a.sent();
                // contractor.documentVerification = true;
                contractor.status = 'active';
                return [4 /*yield*/, contractor.save()];
            case 4:
                _a.sent();
                html = (0, adminToContractorDocValTem_1.adminToContractorAfterDocsValidSendEmailHtmlMailTemplate)(contractor.firstName);
                emailData = {
                    emailTo: admin.email,
                    subject: "Document validation",
                    html: html
                };
                return [4 /*yield*/, (0, send_email_utility_1.sendEmail)(emailData)];
            case 5:
                _a.sent();
                res.json({
                    message: "artisan document successfully verified"
                });
                return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.AdminValidateContractorDocsController = AdminValidateContractorDocsController;
