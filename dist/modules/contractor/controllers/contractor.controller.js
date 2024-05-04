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
exports.ContractorController = void 0;
var express_validator_1 = require("express-validator");
var bcrypt_1 = __importDefault(require("bcrypt"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var adminContractorDocumentTemplate_1 = require("../../../templates/adminEmail/adminContractorDocumentTemplate");
var contractorDocumentTemplate_1 = require("../../../templates/contractorEmail/contractorDocumentTemplate");
var base_abstract_1 = require("../../../abstracts/base.abstract");
var decorators_abstract_1 = require("../../../abstracts/decorators.abstract");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var services_1 = require("../../../services");
var stripe_1 = require("../../../services/stripe");
var contractor_devices_model_1 = __importDefault(require("../../../database/contractor/models/contractor_devices.model"));
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
var custom_errors_1 = require("../../../utils/custom.errors");
var ProfileHandler = /** @class */ (function (_super) {
    __extends(ProfileHandler, _super);
    function ProfileHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProfileHandler.prototype.createProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, location_1, backgroundCheckConsent, skill, website, experienceYear, about, email, phoneNumber, emergencyJobs, availableDays, profilePhoto, previousJobPhotos, previousJobVideos, contractorId, contractor_1, errors, payload, profile, contractorResponse, data, htmlCon, html, adminsWithEmails, adminEmails, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _a = req.body, location_1 = _a.location, backgroundCheckConsent = _a.backgroundCheckConsent, skill = _a.skill, website = _a.website, experienceYear = _a.experienceYear, about = _a.about, email = _a.email, phoneNumber = _a.phoneNumber, emergencyJobs = _a.emergencyJobs, availableDays = _a.availableDays, profilePhoto = _a.profilePhoto, previousJobPhotos = _a.previousJobPhotos, previousJobVideos = _a.previousJobVideos;
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor_1 = _b.sent();
                        if (!contractor_1) {
                            return [2 /*return*/, res.status(404).json({ message: "Contractor account not found" })];
                        }
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        payload = {};
                        console.log(contractor_1.accountType);
                        if ((contractor_1.accountType == contractor_interface_1.CONTRACTOR_TYPES.Company) || (contractor_1.accountType == contractor_interface_1.CONTRACTOR_TYPES.Individual)) {
                            payload = {
                                contractor: contractorId,
                                location: location_1,
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
                                backgroundCheckConsent: backgroundCheckConsent,
                            };
                        }
                        if (contractor_1.accountType == contractor_interface_1.CONTRACTOR_TYPES.Employee) {
                            payload = {
                                contractor: contractorId,
                                location: location_1,
                                backgroundCheckConsent: backgroundCheckConsent,
                            };
                        }
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, __assign({}, payload), { upsert: true, new: true, setDefaultsOnInsert: true })
                            // Update the ContractorModel with the profile ID
                        ];
                    case 3:
                        profile = _b.sent();
                        // Update the ContractorModel with the profile ID
                        contractor_1.profile = profile._id;
                        contractor_1.profilePhoto = profilePhoto;
                        return [4 /*yield*/, contractor_1.save()];
                    case 4:
                        _b.sent();
                        contractorResponse = __assign(__assign({}, contractor_1.toJSON()), { profile: profile });
                        if (contractor_1.accountType == contractor_interface_1.CONTRACTOR_TYPES.Individual) {
                            data = {
                                request_enhanced_identity_verification: true,
                                request_enhanced_criminal_record_check: true,
                                email: contractor_1.email
                            };
                            if (!contractor_1.certnId) {
                                services_1.CertnService.initiateCertnInvite(data).then(function (res) {
                                    contractor_1.certnId = res.applicant.id;
                                    contractor_1.save();
                                    console.log('Certn invitation sent', contractor_1.certnId);
                                });
                            }
                        }
                        htmlCon = (0, contractorDocumentTemplate_1.htmlContractorDocumentValidatinTemplate)(contractor_1.firstName);
                        services_1.EmailService.send(contractor_1.email, 'New Profile', htmlCon)
                            .then(function () { return console.log('Email sent successfully'); })
                            .catch(function (error) { return console.error('Error sending email:', error); });
                        html = (0, adminContractorDocumentTemplate_1.htmlContractorDocumentValidatinToAdminTemplate)(contractor_1.firstName);
                        return [4 /*yield*/, admin_model_1.default.find().select('email')];
                    case 5:
                        adminsWithEmails = _b.sent();
                        adminEmails = adminsWithEmails.map(function (admin) { return admin.email; });
                        services_1.EmailService.send(adminEmails, 'New Profile Registered', html, adminEmails)
                            .then(function () { return console.log('Emails sent successfully with CC'); })
                            .catch(function (error) { return console.error('Error sending emails:', error); });
                        res.json({
                            success: true,
                            message: "Profile created successfully",
                            data: contractorResponse
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
            var req, res, contractor, contractorId, _a, website, experienceYear, about, email, location_2, phoneNumber, emergencyJobs, availableDays, previousJobPhotos, previousJobVideos, profilePhoto, backgroundCheckConsent, skill, errors, profile, payload, contractorResponse, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        contractor = req.contractor;
                        contractorId = contractor.id;
                        _a = req.body, website = _a.website, experienceYear = _a.experienceYear, about = _a.about, email = _a.email, location_2 = _a.location, phoneNumber = _a.phoneNumber, emergencyJobs = _a.emergencyJobs, availableDays = _a.availableDays, previousJobPhotos = _a.previousJobPhotos, previousJobVideos = _a.previousJobVideos, profilePhoto = _a.profilePhoto, backgroundCheckConsent = _a.backgroundCheckConsent, skill = _a.skill;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({ contractor: contractorId })];
                    case 2:
                        profile = _b.sent();
                        if (!profile) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Profile not found' })];
                        }
                        payload = {};
                        if (contractor.accountType == contractor_interface_1.CONTRACTOR_TYPES.Company || contractor.accountType == contractor_interface_1.CONTRACTOR_TYPES.Individual) {
                            payload = {
                                contractor: contractorId,
                                location: location_2,
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
                                backgroundCheckConsent: backgroundCheckConsent,
                            };
                        }
                        if (contractor.accountType == contractor_interface_1.CONTRACTOR_TYPES.Employee) {
                            payload = {
                                contractor: contractorId,
                                location: location_2,
                                backgroundCheckConsent: backgroundCheckConsent,
                            };
                        }
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, __assign({}, payload), { new: true })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contractor.save()];
                    case 4:
                        _b.sent();
                        contractorResponse = __assign(__assign({}, contractor.toJSON()), { // Convert to plain JSON object
                            profile: profile });
                        res.json({
                            success: true,
                            message: 'Profile updated successfully',
                            data: contractorResponse,
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        err_3 = _b.sent();
                        console.log('error', err_3);
                        res.status(500).json({ success: false, message: err_3.message });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.upgradeEmployeeProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, next, contractor, contractorId, _a, gstDetails, website, experienceYear, about, email, location_3, phoneNumber, emergencyJobs, availableDays, previousJobPhotos, previousJobVideos, skill, errors, profile, contractorResponse, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        next = this.next;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        contractor = req.contractor;
                        contractorId = contractor.id;
                        _a = req.body, gstDetails = _a.gstDetails, website = _a.website, experienceYear = _a.experienceYear, about = _a.about, email = _a.email, location_3 = _a.location, phoneNumber = _a.phoneNumber, emergencyJobs = _a.emergencyJobs, availableDays = _a.availableDays, previousJobPhotos = _a.previousJobPhotos, previousJobVideos = _a.previousJobVideos, skill = _a.skill;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOneAndUpdate({ contractor: contractorId }, {
                                website: website,
                                experienceYear: experienceYear,
                                about: about,
                                location: location_3,
                                email: email,
                                phoneNumber: phoneNumber,
                                emergencyJobs: emergencyJobs,
                                availableDays: availableDays,
                                previousJobPhotos: previousJobPhotos,
                                previousJobVideos: previousJobVideos,
                                skill: skill,
                            }, { new: true })];
                    case 2:
                        profile = _b.sent();
                        contractor.accountType = contractor_interface_1.CONTRACTOR_TYPES.Individual;
                        contractor.gstDetails = gstDetails;
                        return [4 /*yield*/, contractor.save()];
                    case 3:
                        _b.sent();
                        contractorResponse = __assign(__assign({}, contractor.toJSON()), { // Convert to plain JSON object
                            profile: profile });
                        res.json({
                            success: true,
                            message: 'Profile upgraded successfully',
                            data: contractorResponse,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_4 = _b.sent();
                        console.log('error', err_4);
                        res.status(500).json({ success: false, message: err_4.message });
                        next(new custom_errors_1.BadRequestError('An error occured', err_4));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.updateAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractor, contractorId, account, _a, firstName, lastName, companyName, profilePhoto, phoneNumber, dateOfBirth, payload, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        contractor = req.contractor;
                        contractorId = contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        account = _b.sent();
                        if (!account) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Account not found' })];
                        }
                        _a = req.body, firstName = _a.firstName, lastName = _a.lastName, companyName = _a.companyName, profilePhoto = _a.profilePhoto, phoneNumber = _a.phoneNumber, dateOfBirth = _a.dateOfBirth;
                        payload = {};
                        if (account && account.accountType == 'Company') {
                            payload = { profilePhoto: profilePhoto, phoneNumber: phoneNumber, companyName: companyName };
                        }
                        if (account && account.accountType == 'Individual') {
                            payload = { profilePhoto: profilePhoto, phoneNumber: phoneNumber, firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth };
                        }
                        if (account && account.accountType == 'Employee') {
                            payload = { profilePhoto: profilePhoto, phoneNumber: phoneNumber, firstName: firstName, lastName: lastName, dateOfBirth: dateOfBirth };
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findOneAndUpdate({ _id: contractorId }, payload, { new: true })];
                    case 3:
                        _b.sent();
                        res.json({
                            success: true,
                            message: 'Account updated successfully',
                            data: account,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_5 = _b.sent();
                        console.log('error', err_5);
                        res.status(500).json({ success: false, message: err_5.message });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.getAccount = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractorId, includeStripeIdentity, includeStripeCustomer, includeStripePaymentMethods, includeStripeAccount, includedFields, contractor_2, quiz, contractorResponse, stripeAccount, data, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        contractorId = req.contractor.id;
                        includeStripeIdentity = false;
                        includeStripeCustomer = false;
                        includeStripePaymentMethods = false;
                        includeStripeAccount = false;
                        // Parse the query parameter "include" to determine which fields to include
                        if (req.query.include) {
                            includedFields = req.query.include.split(',');
                            includeStripeIdentity = includedFields.includes('stripeIdentity');
                            includeStripeCustomer = includedFields.includes('stripeCustomer');
                            includeStripePaymentMethods = includedFields.includes('stripePaymentMethods');
                            includeStripeAccount = includedFields.includes('stripeAccount');
                        }
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId).populate('profile')];
                    case 2:
                        contractor_2 = _b.sent();
                        if (!contractor_2) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Account not found' })];
                        }
                        return [4 /*yield*/, contractor_2.quiz];
                    case 3:
                        quiz = (_a = _b.sent()) !== null && _a !== void 0 ? _a : null;
                        contractorResponse = __assign(__assign({}, contractor_2.toJSON({ includeStripeIdentity: true, includeStripeCustomer: true, includeStripePaymentMethods: true, includeStripeAccount: true })), { // Convert to plain JSON object
                            quiz: quiz });
                        if (!contractor_2) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                        }
                        if (!!contractor_2.stripeAccount) return [3 /*break*/, 6];
                        return [4 /*yield*/, stripe_1.StripeService.account.createAccount({
                                userType: 'contractors',
                                userId: contractorId,
                                email: contractor_2.email
                            })];
                    case 4:
                        stripeAccount = _b.sent();
                        contractor_2.stripeAccount = {
                            id: stripeAccount.id,
                            type: stripeAccount.type,
                            details_submitted: stripeAccount.details_submitted,
                            tos_acceptance: stripeAccount.tos_acceptance,
                            payouts_enabled: stripeAccount.payouts_enabled,
                            charges_enabled: stripeAccount.charges_enabled,
                            country: stripeAccount.country,
                            external_accounts: stripeAccount.external_accounts,
                        };
                        if (contractor_2.accountType == contractor_interface_1.CONTRACTOR_TYPES.Individual) {
                            data = {
                                request_enhanced_identity_verification: true,
                                request_enhanced_criminal_record_check: true,
                                email: contractor_2.email
                            };
                            if (!contractor_2.certnId) {
                                services_1.CertnService.initiateCertnInvite(data).then(function (res) {
                                    contractor_2.certnId = res.applicant.id;
                                    console.log('Certn invitation sent', contractor_2.certnId);
                                });
                            }
                        }
                        return [4 /*yield*/, contractor_2.save()];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        //TODO: for now always update the meta data of stripe customer with this email address
                        if (contractor_2.stripeCustomer) {
                            stripe_1.StripeService.customer.updateCustomer(contractor_2.stripeCustomer.id, {
                                metadata: { userType: 'contractors', userId: contractor_2.id }
                            });
                        }
                        else {
                            stripe_1.StripeService.customer.createCustomer({
                                email: contractor_2.email,
                                metadata: {
                                    userType: 'contractors',
                                    userId: contractor_2.id,
                                },
                                //@ts-ignore
                                name: "".concat(contractor_2.name, " "),
                                phone: "".concat(contractor_2.phoneNumber.code).concat(contractor_2.phoneNumber.number, " "),
                            });
                        }
                        res.json({
                            success: true,
                            message: 'Account fetched successfully',
                            data: contractorResponse,
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        err_6 = _b.sent();
                        console.log('error', err_6);
                        res.status(500).json({ success: false, message: err_6.message });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.createStripeAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractorId, contractor, stripeAccountLink, stripeAccount, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, , 12]);
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _a.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                        }
                        stripeAccountLink = {};
                        if (!(!contractor.stripeAccount || !contractor.stripeAccount.id)) return [3 /*break*/, 6];
                        return [4 /*yield*/, stripe_1.StripeService.account.createAccount({
                                userType: 'contractors',
                                userId: contractorId,
                                email: contractor.email
                            })];
                    case 3:
                        stripeAccount = _a.sent();
                        contractor.stripeAccount = {
                            id: stripeAccount.id,
                            type: stripeAccount.type,
                            details_submitted: stripeAccount.details_submitted,
                            tos_acceptance: stripeAccount.tos_acceptance,
                            payouts_enabled: stripeAccount.payouts_enabled,
                            charges_enabled: stripeAccount.charges_enabled,
                            country: stripeAccount.country,
                            external_accounts: stripeAccount.external_accounts,
                        };
                        return [4 /*yield*/, contractor.save()
                            // create account onboarding link 
                            // @ts-ignore
                        ];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, stripe_1.StripeService.account.createAccountLink(contractor.stripeAccount.id)
                            //@ts-ignore
                        ];
                    case 5:
                        // create account onboarding link 
                        // @ts-ignore
                        stripeAccountLink = _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        if (!!contractor.stripeAccount.payouts_enabled) return [3 /*break*/, 8];
                        return [4 /*yield*/, stripe_1.StripeService.account.createAccountLink(contractor.stripeAccount.id)];
                    case 7:
                        //@ts-ignore
                        stripeAccountLink = _a.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, stripe_1.StripeService.account.createLoginLink(contractor.stripeAccount.id)];
                    case 9:
                        // should create account login link  here if account has already unboarded, but will need to check status shaaa
                        // @ts-ignore
                        stripeAccountLink = _a.sent();
                        _a.label = 10;
                    case 10:
                        res.json({
                            success: true,
                            message: 'Stripe connected account create successfully',
                            data: stripeAccountLink,
                        });
                        return [3 /*break*/, 12];
                    case 11:
                        err_7 = _a.sent();
                        console.log('error', err_7);
                        res.status(500).json({ success: false, message: err_7.message });
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.generateStripeAccountDashboardLink = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractorId, contractor, stripeAccountLink, stripeAccount, err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _a.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                        }
                        stripeAccountLink = {};
                        if (!(!contractor.stripeAccount || !contractor.stripeAccount.id)) return [3 /*break*/, 6];
                        return [4 /*yield*/, stripe_1.StripeService.account.createAccount({
                                userType: 'contractors',
                                userId: contractorId,
                                email: contractor.email
                            })];
                    case 3:
                        stripeAccount = _a.sent();
                        contractor.stripeAccount = {
                            id: stripeAccount.id,
                            type: stripeAccount.type,
                            details_submitted: stripeAccount.details_submitted,
                            tos_acceptance: stripeAccount.tos_acceptance,
                            payouts_enabled: stripeAccount.payouts_enabled,
                            charges_enabled: stripeAccount.charges_enabled,
                            country: stripeAccount.country,
                            external_accounts: stripeAccount.external_accounts,
                        };
                        return [4 /*yield*/, contractor.save()
                            // create account onboarding link 
                            // @ts-ignore
                        ];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, stripe_1.StripeService.account.createAccountLink(contractor.stripeAccount.id)];
                    case 5:
                        // create account onboarding link 
                        // @ts-ignore
                        stripeAccountLink = _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, stripe_1.StripeService.account.createLoginLink(contractor.stripeAccount.id)];
                    case 7:
                        // create account onboarding link 
                        // @ts-ignore
                        stripeAccountLink = _a.sent();
                        _a.label = 8;
                    case 8:
                        res.json({
                            success: true,
                            message: 'Stripe connected account login link created successfully',
                            data: stripeAccountLink,
                        });
                        return [3 /*break*/, 10];
                    case 9:
                        err_8 = _a.sent();
                        console.log('error', err_8);
                        res.status(500).json({ success: false, message: err_8.message });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.updateBankDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, institutionName, transitNumber, institutionNumber, accountNumber, errors, contractorId, contractor, profile, contractorResponse, err_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        _a = req.body, institutionName = _a.institutionName, transitNumber = _a.transitNumber, institutionNumber = _a.institutionNumber, accountNumber = _a.accountNumber;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        contractorId = req.contractor.id;
                        contractor = req.contractor;
                        return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
                    case 2:
                        profile = _b.sent();
                        if (!profile) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor profile not found' })];
                        }
                        // Update the bankDetails subdocument
                        profile.bankDetails = {
                            institutionName: institutionName,
                            transitNumber: transitNumber,
                            institutionNumber: institutionNumber,
                            accountNumber: accountNumber,
                        };
                        // Save the updated contractor profile
                        return [4 /*yield*/, profile.save()];
                    case 3:
                        // Save the updated contractor profile
                        _b.sent();
                        contractorResponse = __assign(__assign({}, contractor.toJSON()), { // Convert to plain JSON object
                            profile: profile });
                        res.json({
                            success: true,
                            message: 'Contractor profile bank details updated successfully',
                            data: contractorResponse,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_9 = _b.sent();
                        res.status(500).json({ success: false, message: err_9.message });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.addGstDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, gstName, gstNumber, gstType, backgroundCheckConsent, gstCertificate, errors, contractorId, contractor, err_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        _a = req.body, gstName = _a.gstName, gstNumber = _a.gstNumber, gstType = _a.gstType, backgroundCheckConsent = _a.backgroundCheckConsent, gstCertificate = _a.gstCertificate;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _b.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor  not found' })];
                        }
                        // check if gst has already been approved or is reviewing
                        if (contractor.gstDetails) {
                            if (contractor.gstDetails.status == contractor_interface_1.GST_STATUS.APPROVED) {
                                return [2 /*return*/, res.status(400).json({ success: false, message: 'GST has already been approved' })];
                            }
                            if (contractor.gstDetails.status == contractor_interface_1.GST_STATUS.REVIEWING) {
                                return [2 /*return*/, res.status(400).json({ success: false, message: 'GST is curretnly been reviewed' })];
                            }
                        }
                        // Update the bankDetails subdocument
                        contractor.gstDetails = {
                            gstName: gstName,
                            gstNumber: gstNumber,
                            gstCertificate: gstCertificate,
                            gstType: gstType,
                            backgroundCheckConsent: backgroundCheckConsent,
                            status: contractor_interface_1.GST_STATUS.PENDING,
                        };
                        // Save the updated contractor profile
                        return [4 /*yield*/, contractor.save()];
                    case 3:
                        // Save the updated contractor profile
                        _b.sent();
                        res.json({
                            success: true,
                            message: 'Contractor Gst  details added successfully',
                            data: contractor,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_10 = _b.sent();
                        res.status(500).json({ success: false, message: err_10.message });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.addCompanyDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, _a, companyLogo, companyStaffId, errors, contractorId, contractor, err_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        _a = req.body, companyLogo = _a.companyLogo, companyStaffId = _a.companyStaffId;
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _b.sent();
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor  not found' })];
                        }
                        // check if gst has already been approved or is reviewing
                        if (contractor.companyDetails) {
                            if (contractor.companyDetails.status == contractor_interface_1.COMPANY_STATUS.APPROVED) {
                                return [2 /*return*/, res.status(400).json({ success: false, message: 'Company details has already been approved' })];
                            }
                            if (contractor.companyDetails.status == contractor_interface_1.COMPANY_STATUS.REVIEWING) {
                                return [2 /*return*/, res.status(400).json({ success: false, message: 'Company details are curretnly been reviewed' })];
                            }
                        }
                        // Update the bankDetails subdocument
                        contractor.companyDetails = {
                            companyLogo: companyLogo,
                            companyStaffId: companyStaffId,
                            status: contractor_interface_1.COMPANY_STATUS.PENDING,
                        };
                        // Save the updated contractor profile
                        return [4 /*yield*/, contractor.save()];
                    case 3:
                        // Save the updated contractor profile
                        _b.sent();
                        res.json({
                            success: true,
                            message: 'Contractor company details added successfully',
                            data: contractor,
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        err_11 = _b.sent();
                        res.status(500).json({ success: false, message: err_11.message });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.changePassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, errors, _a, currentPassword, newPassword, contractorId, contractor, isPasswordValid, hashedPassword, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _b.sent();
                        // Check if the user exists
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found' })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.compare(currentPassword, contractor.password)];
                    case 3:
                        isPasswordValid = _b.sent();
                        if (!isPasswordValid) {
                            return [2 /*return*/, res.status(401).json({ success: false, message: 'Current password is incorrect' })];
                        }
                        return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
                    case 4:
                        hashedPassword = _b.sent();
                        // Update the user's password
                        contractor.password = hashedPassword;
                        return [4 /*yield*/, contractor.save()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, res.json({ success: true, message: 'Password changed successfully' })];
                    case 6:
                        error_1 = _b.sent();
                        console.error('Error changing password:', error_1);
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal Server Error' })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.createIdentitySession = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, errors, _c, currentPassword, newPassword, contractorId, contractor, verificationSession, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 6]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        _c = req.body, currentPassword = _c.currentPassword, newPassword = _c.newPassword;
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _d.sent();
                        // Check if the user exists
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found' })];
                        }
                        return [4 /*yield*/, stripe_1.StripeService.identity.createVerificationSession({
                                userType: 'contractors',
                                userId: contractorId,
                                email: contractor.email
                            })
                            // Update the user's password
                            // contractor.password = 'hashedPassword';
                        ];
                    case 3:
                        verificationSession = _d.sent();
                        // Update the user's password
                        // contractor.password = 'hashedPassword';
                        return [4 /*yield*/, contractor.save()];
                    case 4:
                        // Update the user's password
                        // contractor.password = 'hashedPassword';
                        _d.sent();
                        return [2 /*return*/, res.json({ success: true, message: 'Verification session created', data: verificationSession })];
                    case 5:
                        error_2 = _d.sent();
                        console.error('Error creating stripe verification session:', error_2);
                        return [2 /*return*/, res.status((_a = error_2.code) !== null && _a !== void 0 ? _a : 500).json({ success: false, message: (_b = error_2.message) !== null && _b !== void 0 ? _b : 'Internal Server Error' })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.createOrUpdateDevice = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, errors, _b, deviceId, deviceType, deviceToken, contractorId, contractor, device, contractorDevice, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 5, , 6]);
                        errors = (0, express_validator_1.validationResult)(req);
                        if (!errors.isEmpty()) {
                            return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                        }
                        _b = req.body, deviceId = _b.deviceId, deviceType = _b.deviceType, deviceToken = _b.deviceToken;
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _c.sent();
                        // Check if the user exists
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'User not found' })];
                        }
                        return [4 /*yield*/, contractor_devices_model_1.default.find({ deviceId: deviceId, deviceToken: deviceToken })];
                    case 3:
                        device = _c.sent();
                        if (device) {
                            //return res.status(404).json({ success: false, message: 'Device already exits' });
                        }
                        return [4 /*yield*/, contractor_devices_model_1.default.findOneAndUpdate({ contractor: contractorId, deviceToken: deviceToken }, { deviceToken: deviceToken, deviceType: deviceType }, { new: true, upsert: true })];
                    case 4:
                        contractorDevice = _c.sent();
                        return [2 /*return*/, res.json({ success: true, message: 'Contractor device updated', data: contractorDevice })];
                    case 5:
                        error_3 = _c.sent();
                        console.error('Error creating stripe verification session:', error_3);
                        return [2 /*return*/, res.status(500).json({ success: false, message: (_a = error_3.message) !== null && _a !== void 0 ? _a : 'Internal Server Error' })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ProfileHandler.prototype.myDevices = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var req, res, contractorId, contractor, devices, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        req = this.req;
                        res = this.res;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        contractorId = req.contractor.id;
                        return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
                    case 2:
                        contractor = _c.sent();
                        // Check if the user exists
                        if (!contractor) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                        }
                        return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: contractorId })];
                    case 3:
                        devices = _c.sent();
                        return [2 /*return*/, res.json({ success: true, message: 'Contractor deviced retrieved', data: devices })];
                    case 4:
                        error_4 = _c.sent();
                        console.error('Error retrieving contractor devices:', error_4);
                        return [2 /*return*/, res.status((_a = error_4.code) !== null && _a !== void 0 ? _a : 500).json({ success: false, message: (_b = error_4.message) !== null && _b !== void 0 ? _b : 'Internal Server Error' })];
                    case 5: return [2 /*return*/];
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
    ], ProfileHandler.prototype, "upgradeEmployeeProfile", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "updateAccount", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "getAccount", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "createStripeAccount", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "generateStripeAccountDashboardLink", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "updateBankDetails", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "addGstDetails", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "addCompanyDetails", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "changePassword", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "createIdentitySession", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "createOrUpdateDevice", null);
    __decorate([
        (0, decorators_abstract_1.handleAsyncError)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ProfileHandler.prototype, "myDevices", null);
    return ProfileHandler;
}(base_abstract_1.Base));
var ContractorController = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return new (ProfileHandler.bind.apply(ProfileHandler, __spreadArray([void 0], args, false)))();
};
exports.ContractorController = ContractorController;
