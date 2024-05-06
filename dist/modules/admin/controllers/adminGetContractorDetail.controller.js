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
exports.AdminContractorDetail = exports.AdminGetContractorGstPendingController = exports.AdminChangeContractorGstStatusController = exports.AdminGetSingleContractorDetailController = exports.AdminGetContractorDetailController = void 0;
var express_validator_1 = require("express-validator");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
//get contractor detail /////////////
var AdminGetContractorDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, contractors, totalContractor, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
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
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments()
                    // const artisans = [];
                    // for (let i = 0; i < contractors.length; i++) {
                    //   const contractor = contractors[i];
                    //   const document = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id});
                    //   const availability = await ContractorAvailabilityModel.find({contractorId: contractor._id});
                    //   const jobRequests = await JobModel.find({contractorId: contractor._id}).sort({ createdAt: -1 })
                    //   let rating = null;
                    //   const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
                    //   if (contractorRating) {
                    //     rating = contractorRating
                    //   }
                    //   let jobRequested = []
                    //   for (let i = 0; i < jobRequests.length; i++) {
                    //     const jobRequest = jobRequests[i];
                    //     const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
                    //     const obj = {
                    //       job: jobRequest,
                    //       customer
                    //     }
                    //     jobRequested.push(obj)
                    //   }
                    //   const objTwo = {
                    //       contractorProfile: contractor,
                    //       rating,
                    //       document,
                    //       availability,
                    //       jobHistory: jobRequested
                    //   };
                    //   artisans.push(objTwo)
                    // }
                ];
            case 2:
                totalContractor = _b.sent();
                // const artisans = [];
                // for (let i = 0; i < contractors.length; i++) {
                //   const contractor = contractors[i];
                //   const document = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id});
                //   const availability = await ContractorAvailabilityModel.find({contractorId: contractor._id});
                //   const jobRequests = await JobModel.find({contractorId: contractor._id}).sort({ createdAt: -1 })
                //   let rating = null;
                //   const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
                //   if (contractorRating) {
                //     rating = contractorRating
                //   }
                //   let jobRequested = []
                //   for (let i = 0; i < jobRequests.length; i++) {
                //     const jobRequest = jobRequests[i];
                //     const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
                //     const obj = {
                //       job: jobRequest,
                //       customer
                //     }
                //     jobRequested.push(obj)
                //   }
                //   const objTwo = {
                //       contractorProfile: contractor,
                //       rating,
                //       document,
                //       availability,
                //       jobHistory: jobRequested
                //   };
                //   artisans.push(objTwo)
                // }
                res.json({
                    currentPage: page,
                    totalContractor: totalContractor,
                    totalPages: Math.ceil(totalContractor / limit),
                    contractors: contractors,
                    // totalContractor, 
                    // artisans
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetContractorDetailController = AdminGetContractorDetailController;
//get  single contractor detail /////////////
var AdminGetSingleContractorDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, errors, admin, adminId, contractor, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                contractorId = req.params.contractorId;
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
                // const document = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id});
                // const availability = await ContractorAvailabilityModel.find({contractorId: contractor._id});
                // const jobRequests = await JobModel.find({contractorId: contractor._id}).sort({ createdAt: -1 })
                // let rating = null;
                // const contractorRating = await ContractorRatingModel.findOne({contractorId: contractor._id})
                // if (contractorRating) {
                //   rating = contractorRating
                // }
                // let jobRequested = []
                // for (let i = 0; i < jobRequests.length; i++) {
                //   const jobRequest = jobRequests[i];
                //   const customer = await CustomerRegModel.findOne({_id: jobRequest.customerId}).select('-password');
                //   const obj = {
                //     job: jobRequest,
                //     customer
                //   }
                //   jobRequested.push(obj)
                // }
                // const objTwo = {
                //     contractorProfile: contractor,
                //     rating,
                //     document,
                //     availability,
                //     jobHistory: jobRequested
                // };
                res.json({
                    contractor: contractor,
                    // artisan: objTwo
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleContractorDetailController = AdminGetSingleContractorDetailController;
//admin change contractor gst status  /////////////
var AdminChangeContractorGstStatusController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gstStatus, contractorId, reason, errors, adminId, admin, contractor, createdTime, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, gstStatus = _a.gstStatus, contractorId = _a.contractorId, reason = _a.reason;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                reason = reason || '';
                adminId = req.admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                admin = _b.sent();
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid admin ID" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 2:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid contractor ID" })];
                }
                // const superAdmin = await AdminRegModel.findOne({superAdmin: true})
                // if (!superAdmin) {
                //   return res
                //     .status(401)
                //     .json({ message: "no super admin found" });
                // }
                // contractor.gstDetails.gstOtp = otp;
                // contractor.gstDetails.gstOtpStatus = GST_OTP_STATUS.REQUEST;
                // contractor.gstDetails.gstOtpTime = createdTime;
                // contractor.gstDetails.gstOtpRquestBy = admin._id;
                // contractor.gstDetails.gstOtpRquestType = gstStatus;
                if (reason === '' && gstStatus === contractor_interface_1.GST_STATUS.DECLINED) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "please provide reason for declinig contractor" })];
                }
                createdTime = new Date();
                contractor.gstDetails.status = gstStatus;
                contractor.gstDetails.approvedBy = adminId;
                contractor.gstDetails.approvedAt = createdTime;
                contractor.gstDetails.statusReason = reason;
                return [4 /*yield*/, contractor.save()
                    // const html = htmlAdminRquestGstStatuChangeTemplate(admin.firstName, contractor.firstName, contractor.email, otp, gstStatus);
                    // let emailData = {
                    //     emailTo: superAdmin.email,
                    //     subject: "GST Status Change Requst",
                    //     html
                    // };
                    // sendEmail(emailData);
                ];
            case 3:
                _b.sent();
                // const html = htmlAdminRquestGstStatuChangeTemplate(admin.firstName, contractor.firstName, contractor.email, otp, gstStatus);
                // let emailData = {
                //     emailTo: superAdmin.email,
                //     subject: "GST Status Change Requst",
                //     html
                // };
                // sendEmail(emailData);
                res.json({
                    message: "contractor gst status successfully change to ".concat(gstStatus)
                });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _b.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AdminChangeContractorGstStatusController = AdminChangeContractorGstStatusController;
//admin get contractor gst that is pending /////////////
var AdminGetContractorGstPendingController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, errors, admin, adminId, contractor, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.find({
                        "gstDetails.status": "PENDING"
                    })];
            case 1:
                contractor = _b.sent();
                res.json({
                    contractor: contractor
                });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetContractorGstPendingController = AdminGetContractorGstPendingController;
exports.AdminContractorDetail = {
    AdminGetContractorDetailController: exports.AdminGetContractorDetailController,
    AdminGetSingleContractorDetailController: exports.AdminGetSingleContractorDetailController,
    AdminChangeContractorGstStatusController: exports.AdminChangeContractorGstStatusController,
    AdminGetContractorGstPendingController: exports.AdminGetContractorGstPendingController,
};
