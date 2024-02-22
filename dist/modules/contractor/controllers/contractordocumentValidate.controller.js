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
exports.getAllSkillController = exports.contractorComfirmCertnValidationController = exports.contractorAddDocumentController = void 0;
var express_validator_1 = require("express-validator");
var upload_utility_1 = require("../../../utils/upload.utility");
var uuid_1 = require("uuid");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractorDocumentValidate_model_1 = __importDefault(require("../../../database/contractor/models/contractorDocumentValidate.model"));
var send_email_utility_1 = require("../../../utils/send_email_utility");
var adminReg_model_1 = __importDefault(require("../../../database/admin/models/adminReg.model"));
var skill_model_1 = __importDefault(require("../../../database/admin/models/skill.model"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var adminNotification_model_1 = __importDefault(require("../../../database/admin/models/adminNotification.model"));
var adminContractorDocumentTemplate_1 = require("../../../templates/adminEmail/adminContractorDocumentTemplate");
var contractorDocumentTemplate_1 = require("../../../templates/contractorEmail/contractorDocumentTemplate");
//contractor add or validate document /////////////
var contractorAddDocumentController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, phoneNumber, businessName, 
    //gst,
    tradeTicket, state, postalCode, city, skill, website, 
    //validId,
    yearExpirence, files, errors, contractor, contractorId, contractorExist, checkDocument, certnToken, filenameOne, documentOne, profile, data, options, certn, certnData, updateProfile, newDocument, htmlCon, emailData, html, admins, i, admin, emailData_1, saveDocument, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, phoneNumber = _a.phoneNumber, businessName = _a.businessName, tradeTicket = _a.tradeTicket, state = _a.state, postalCode = _a.postalCode, city = _a.city, skill = _a.skill, website = _a.website, yearExpirence = _a.yearExpirence;
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
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ contractorId: contractorId })];
            case 2:
                checkDocument = _b.sent();
                if (checkDocument) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "document already exist" })];
                }
                if (!files) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "files are missing" })];
                }
                if (files.length > 1 || files.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "files must be one, profile" })];
                }
                if (files[0].fieldname != 'profile') {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "the first file must be profile" })];
                }
                certnToken = process.env.CERTN_KEY;
                if (!certnToken) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Certn API Key is missing" })];
                }
                console.log(3);
                filenameOne = (0, uuid_1.v4)();
                return [4 /*yield*/, (0, upload_utility_1.uploadToS3)(files[0].buffer, "".concat(filenameOne, ".jpg"))];
            case 3:
                documentOne = _b.sent();
                profile = documentOne === null || documentOne === void 0 ? void 0 : documentOne.Location;
                data = {
                    request_enhanced_identity_verification: true,
                    request_enhanced_criminal_record_check: true,
                    email: contractorExist.email
                };
                options = {
                    method: "POST",
                    headers: {
                        'Authorization': "Bearer ".concat(certnToken),
                        "Content-Type": "application/json",
                        // "Authorization": `Bearer ${certnToken}`
                    },
                    body: JSON.stringify(data),
                };
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.certn.co/hr/v1/applications/invite/", options)];
            case 4:
                certn = _b.sent();
                console.log(4);
                return [4 /*yield*/, certn.json()];
            case 5:
                certnData = _b.sent();
                if (certnData.applicant.status != 'Pending') {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "unable to initialize certn invite" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOneAndUpdate({ _id: contractorId }, { profileImage: profile }, { new: true })];
            case 6:
                updateProfile = _b.sent();
                newDocument = new contractorDocumentValidate_model_1.default({
                    contractorId: contractorId,
                    phoneNumber: phoneNumber,
                    businessName: businessName,
                    //gst,
                    tradeTicket: tradeTicket,
                    state: state,
                    postalCode: postalCode,
                    city: city,
                    skill: skill,
                    website: website,
                    //validId,
                    yearExpirence: yearExpirence,
                    nationIdImage: '',
                    verified: false,
                    certnId: certnData.applicant.id
                });
                htmlCon = (0, contractorDocumentTemplate_1.htmlContractorDocumentValidatinTemplate)(contractorExist.firstName);
                emailData = {
                    emailTo: contractorExist.email,
                    subject: "Document validation from artisan",
                    html: htmlCon
                };
                (0, send_email_utility_1.sendEmail)(emailData);
                html = (0, adminContractorDocumentTemplate_1.htmlContractorDocumentValidatinToAdminTemplate)(contractorExist.firstName);
                return [4 /*yield*/, adminReg_model_1.default.find()];
            case 7:
                admins = _b.sent();
                for (i = 0; i < admins.length; i++) {
                    admin = admins[i];
                    if (admin.validation) {
                        emailData_1 = {
                            emailTo: admin.email,
                            subject: "Document validation from artisan",
                            html: html
                        };
                        (0, send_email_utility_1.sendEmail)(emailData_1);
                    }
                }
                return [4 /*yield*/, newDocument.save()];
            case 8:
                saveDocument = _b.sent();
                res.json({
                    message: "document successfully submit, check your email to continue rest validation",
                    saveDocument: saveDocument
                });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                // signup error
                console.log("error", err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.contractorAddDocumentController = contractorAddDocumentController;
//contractor comfirm certn validation /////////////
var contractorComfirmCertnValidationController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, contractor, contractorId, contractorExist, checkDocument, certnToken, options, certn, certnData, adminNoti, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
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
                return [4 /*yield*/, contractorDocumentValidate_model_1.default.findOne({ contractorId: contractorId })];
            case 2:
                checkDocument = _b.sent();
                if (!checkDocument) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "you haven't submited document yet" })];
                }
                if (checkDocument.verified) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "document already verified" })];
                }
                certnToken = process.env.CERTN_KEY;
                if (!certnToken) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Certn API Key is missing" })];
                }
                options = {
                    method: "GET",
                    headers: {
                        'Authorization': "Bearer ".concat(certnToken),
                        "Content-Type": "application/json",
                    },
                };
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.certn.co/hr/v1/applicants/".concat(checkDocument.certnId), options)
                    //const certn = await fetch(`https://api.certn.co/hr/v1/applicants/ae9df329-58e4-4d36-b3a9-ae3505aec1c0`, options)
                ];
            case 3:
                certn = _b.sent();
                return [4 /*yield*/, certn.json()];
            case 4:
                certnData = _b.sent();
                if (certnData.status == "Pending") {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "you haven't finished certn verification" })];
                }
                if (certnData.status != "Returned") {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "you haven't submited document yet" })];
                }
                if (certnData.information.status != "Completed") {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "your information is not complete or verified by certn" })];
                }
                if (certnData.international_criminal_record_check_result.status != "NONE") {
                    return [2 /*return*/, res
                            .status(401)
                            .json({
                            message: "your have criminal record",
                            criminal_records: certnData.international_criminal_record_check_result.international_criminal_record_checks
                        })];
                }
                checkDocument.verified = true;
                // contractorExist.documentVerification = true;
                contractorExist.status = "active";
                return [4 /*yield*/, checkDocument.save()];
            case 5:
                _b.sent();
                return [4 /*yield*/, contractorExist.save()
                    // admin notification 
                ];
            case 6:
                _b.sent();
                adminNoti = new adminNotification_model_1.default({
                    title: "Contractor’s Personal Information Submitted",
                    message: "".concat(contractorExist.firstName, " has successfully submitted his background check and has been verified"),
                    status: "unseen"
                });
                return [4 /*yield*/, adminNoti.save()];
            case 7:
                _b.sent();
                res.json({
                    message: "document successfully verified,",
                });
                return [3 /*break*/, 9];
            case 8:
                err_2 = _b.sent();
                // signup error
                console.log("error", err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.contractorComfirmCertnValidationController = contractorComfirmCertnValidationController;
// get all skill/////////////
var getAllSkillController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, skills, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, skill_model_1.default.find()];
            case 1:
                skills = _b.sent();
                res.json({
                    skills: skills
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllSkillController = getAllSkillController;
