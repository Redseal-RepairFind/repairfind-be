"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.ProfileController = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var adminReg_model_1 = __importDefault(require("../../../database/admin/models/adminReg.model"));
var adminContractorDocumentTemplate_1 = require("../../../templates/adminEmail/adminContractorDocumentTemplate");
var contractorDocumentTemplate_1 = require("../../../templates/contractorEmail/contractorDocumentTemplate");
var base_abstract_1 = require("../../../abstracts/base.abstract");
var decorators_abstract_1 = require("../../../abstracts/decorators.abstract");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var certn_1 = require("../../../services/certn");
var services_1 = require("../../../services");
var ProfileHandler = /** @class */ (function (_super) {
    __extends(ProfileHandler, _super);
    function ProfileHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProfileHandler.prototype.createProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, name_1, gstNumber, gstType, location_1, backgrounCheckConsent, skill, website, experienceYear, about, email, phoneNumber, emergencyJobs, availableDays, profilePhoto, previousJobPhotos, previousJobVideos, profileType, firstName, lastName, errors, contractor, contractorId, constractor, certnToken, data, profile_1, htmlCon, html, adminsWithEmails, adminEmails, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _a = req.body, name_1 = _a.name, gstNumber = _a.gstNumber, gstType = _a.gstType, location_1 = _a.location, backgrounCheckConsent = _a.backgrounCheckConsent, skill = _a.skill, website = _a.website, experienceYear = _a.experienceYear, about = _a.about, email = _a.email, phoneNumber = _a.phoneNumber, emergencyJobs = _a.emergencyJobs, availableDays = _a.availableDays, profilePhoto = _a.profilePhoto, previousJobPhotos = _a.previousJobPhotos, previousJobVideos = _a.previousJobVideos, profileType = _a.profileType, firstName = _a.firstName, lastName = _a.lastName;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        contractor = req.contractor;
                        contractorId = contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
                    case 2:
                        constractor = _b.sent();
                        if (!constractor) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ message: "invalid credential" })];
                        }
                        certnToken = process.env.CERTN_KEY;
                        if (!certnToken) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json({ message: "Certn API Key is missing" })];
                        }
                        data = {
                            request_enhanced_identity_verification: true,
                            request_enhanced_criminal_record_check: true,
                            email: constractor.email
                        };
                        if (profileType == 'Employee') {
                            name_1 = "".concat(firstName, " ").concat(lastName);
                        }
                        profileType = contractor.accountType;
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, {
                                contractor: contractorId,
                                name: name_1,
                                gstNumber: gstNumber,
                                gstType: gstType,
                                location: location_1,
                                backgrounCheckConsent: backgrounCheckConsent,
                                skill: skill,
                                website: website,
                                experienceYear: experienceYear,
                                about: about,
                                email: email,
                                phoneNumber: phoneNumber,
                                emergencyJobs: emergencyJobs,
                                availableDays: availableDays,
                                profilePhoto: profilePhoto,
                                previousJobPhotos: previousJobPhotos,
                                previousJobVideos: previousJobVideos,
                                profileType: profileType
                            }, { upsert: true, new: true, setDefaultsOnInsert: true })
                            // Update the ContractorModel with the profile ID
                        ];
                    case 3:
                        profile_1 = _b.sent();
                        // Update the ContractorModel with the profile ID
                        contractor.profile = profile_1._id;
                        return [4 /*yield*/, contractor.save()];
                    case 4:
                        _b.sent();
                        (0, certn_1.initiateCertnInvite)(data).then(function (res) {
                            profile_1.certnId = res.applicant.id;
                            profile_1.save();
                            console.log('Certn invitation sent', profile_1.certnId);
                        });
                        htmlCon = (0, contractorDocumentTemplate_1.htmlContractorDocumentValidatinTemplate)(contractor.firstName);
                        services_1.EmailService.send(contractor.email, 'New Profile', htmlCon)
                            .then(function () { return console.log('Email sent successfully'); })
                            .catch(function (error) { return console.error('Error sending email:', error); });
                        html = (0, adminContractorDocumentTemplate_1.htmlContractorDocumentValidatinToAdminTemplate)(contractor.firstName);
                        return [4 /*yield*/, adminReg_model_1.default.find().select('email')];
                    case 5:
                        adminsWithEmails = _b.sent();
                        adminEmails = adminsWithEmails.map(function (admin) { return admin.email; });
                        services_1.EmailService.send(adminEmails, 'New Profile Registered', html, adminEmails)
                            .then(function () { return console.log('Emails sent successfully with CC'); })
                            .catch(function (error) { return console.error('Error sending emails:', error); });
                        res.json({
                            success: true,
                            message: "Profile created successfully",
                            data: profile_1
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _b.sent();
                        console.log("error", err_1);
                        res.status(500).json({ success: false, message: err_1.message });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractor, contractorId, profile, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        contractor = req.contractor;
                        contractorId = contractor.id;
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId }).populate({
                                path: 'contractor', // Specify the path to populate
                                model: 'contractors', // Specify the model to use for population
                            })
                                .exec()];
                    case 2:
                        profile = _a.sent();
                        ;
                        if (!profile) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Profile not found' })];
                        }
                        res.json({
                            success: true,
                            message: 'Profile fetched successfully',
                            data: profile,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.log('error', err_2);
                        res.status(500).json({ success: false, message: err_2.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.updateProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractor, contractorId, _a, name_2, website, experienceYear, about, email, phoneNumber, emergencyJobs, availableDays, profilePhoto, previousJobPhotos, previousJobVideos, profile, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        contractor = req.contractor;
                        contractorId = contractor.id;
                        _a = req.body, name_2 = _a.name, website = _a.website, experienceYear = _a.experienceYear, about = _a.about, email = _a.email, phoneNumber = _a.phoneNumber, emergencyJobs = _a.emergencyJobs, availableDays = _a.availableDays, profilePhoto = _a.profilePhoto, previousJobPhotos = _a.previousJobPhotos, previousJobVideos = _a.previousJobVideos;
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOneAndUpdate({ contractorId: contractorId }, {
                                name: name_2,
                                website: website,
                                experienceYear: experienceYear,
                                about: about,
                                email: email,
                                phoneNumber: phoneNumber,
                                emergencyJobs: emergencyJobs,
                                availableDays: availableDays,
                                profilePhoto: profilePhoto,
                                previousJobPhotos: previousJobPhotos,
                                previousJobVideos: previousJobVideos,
                            }, { new: true })];
                    case 2:
                        profile = _b.sent();
                        if (!profile) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Profile not found' })];
                        }
                        res.json({
                            success: true,
                            message: 'Profile updated successfully',
                            data: profile,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _b.sent();
                        console.log('error', err_3);
                        res.status(500).json({ success: false, message: err_3.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractorId, contractor, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId).populate('profile').exec()];
                    case 2:
                        contractor = _a.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                        }
                        res.json({
                            success: true,
                            message: 'Account fetched successfully',
                            data: contractor,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        console.log('error', err_4);
                        res.status(500).json({ success: false, message: err_4.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "createProfile", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "getProfile", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "updateProfile", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "getUser", null);
    return ProfileHandler;
}(base_abstract_1.Base));
var ProfileController = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (ProfileHandler.bind.apply(ProfileHandler, __spreadArray([void 0], args, false)))();
};
exports.ProfileController = ProfileController;
