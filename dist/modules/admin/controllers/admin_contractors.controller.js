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
exports.AdminContractorDetail = exports.AdminChangeContractorAccountStatusController = exports.AdminGetSingleContractorJonDetailController = exports.AdminGetContractorGstDecliningController = exports.AdminGetContractorGstReviewingController = exports.AdminGetContractorGstApproveController = exports.AdminGetContractorGstPendingController = exports.AdminChangeContractorGstStatusController = exports.AdminGetSingleContractorDetailController = exports.getContractors = void 0;
var express_validator_1 = require("express-validator");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var job_model_1 = require("../../../database/common/job.model");
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
var invoices_shema_1 = require("../../../database/common/invoices.shema");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
//get contractor detail /////////////
var getContractors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId;
    return __generator(this, function (_b) {
        try {
            _a = req.query, page = _a.page, limit = _a.limit;
            errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
            }
            admin = req.admin;
            adminId = admin.id;
            return [2 /*return*/, res.json({ success: true, message: "Contractors retrieved", data: "" })];
        }
        catch (err) {
            // signup error
            res.status(500).json({ message: err.message });
        }
        return [2 /*return*/];
    });
}); };
exports.getContractors = getContractors;
//get  single contractor detail /////////////
var AdminGetSingleContractorDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, errors, admin, adminId, contractor, job, profile, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                contractorId = req.params.contractorId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })
                        .select('-password').populate('profile')];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid artisan ID" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.find({ contractor: contractor._id }).sort({ createdAt: -1 }).populate("customer")];
            case 2:
                job = _a.sent();
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({ contractor: contractor._id })];
            case 3:
                profile = _a.sent();
                res.json({
                    contractor: contractor,
                    job: job,
                    profile: profile
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleContractorDetailController = AdminGetSingleContractorDetailController;
//admin change contractor gst status  /////////////
var AdminChangeContractorGstStatusController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gstStatus, contractorId, reason, errors, adminId, admin, contractor, createdTime, err_2;
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
                err_2 = _b.sent();
                // signup error
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AdminChangeContractorGstStatusController = AdminChangeContractorGstStatusController;
//admin get contractor gst that is pending /////////////
var AdminGetContractorGstPendingController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, contractor, totalContractor, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, contractor_model_1.ContractorModel.find({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.PENDING
                    }).skip(skip)
                        .limit(limit)
                        .populate('profile')];
            case 1:
                contractor = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.PENDING
                    })];
            case 2:
                totalContractor = _b.sent();
                res.json({
                    currentPage: page,
                    totalContractor: totalContractor,
                    totalPages: Math.ceil(totalContractor / limit),
                    contractor: contractor
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
exports.AdminGetContractorGstPendingController = AdminGetContractorGstPendingController;
//admin get contractor gst that is approve /////////////
var AdminGetContractorGstApproveController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, contractor, totalContractor, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, contractor_model_1.ContractorModel.find({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.APPROVED
                    }).skip(skip)
                        .limit(limit)
                        .populate('profile')];
            case 1:
                contractor = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.APPROVED
                    })];
            case 2:
                totalContractor = _b.sent();
                res.json({
                    currentPage: page,
                    totalContractor: totalContractor,
                    totalPages: Math.ceil(totalContractor / limit),
                    contractor: contractor
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetContractorGstApproveController = AdminGetContractorGstApproveController;
//admin get contractor gst that is Reviewing /////////////
var AdminGetContractorGstReviewingController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, contractor, totalContractor, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, contractor_model_1.ContractorModel.find({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.REVIEWING
                    }).skip(skip)
                        .limit(limit)
                        .populate('profile')];
            case 1:
                contractor = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.REVIEWING
                    })];
            case 2:
                totalContractor = _b.sent();
                res.json({
                    currentPage: page,
                    totalContractor: totalContractor,
                    totalPages: Math.ceil(totalContractor / limit),
                    contractor: contractor
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetContractorGstReviewingController = AdminGetContractorGstReviewingController;
//admin get contractor gst that is Decline /////////////
var AdminGetContractorGstDecliningController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, errors, admin, adminId, skip, contractor, totalContractor, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                skip = (page - 1) * limit;
                return [4 /*yield*/, contractor_model_1.ContractorModel.find({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.DECLINED
                    }).skip(skip)
                        .limit(limit)
                        .populate('profile')];
            case 1:
                contractor = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.countDocuments({
                        "gstDetails.status": contractor_interface_1.GST_STATUS.DECLINED
                    })];
            case 2:
                totalContractor = _b.sent();
                res.json({
                    currentPage: page,
                    totalContractor: totalContractor,
                    totalPages: Math.ceil(totalContractor / limit),
                    contractor: contractor
                });
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                // signup error
                res.status(500).json({ message: err_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetContractorGstDecliningController = AdminGetContractorGstDecliningController;
//get  single contractor job detail /////////////
var AdminGetSingleContractorJonDetailController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, _a, page, limit, errors, admin, adminId, contractor, skip, jobsDetails, totalJob, jobs, i, jobsDetail, invoice, obj, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                contractorId = req.params.contractorId;
                _a = req.query, page = _a.page, limit = _a.limit;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                admin = req.admin;
                adminId = admin.id;
                page = page || 1;
                limit = limit || 50;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })
                        .select('-password').populate('profile')];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid artisan ID" })];
                }
                skip = (page - 1) * limit;
                return [4 /*yield*/, job_model_1.JobModel.find({ contractor: contractorId })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate(['customer', 'contractor', 'quotation'])];
            case 2:
                jobsDetails = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.countDocuments({ contractor: contractorId })];
            case 3:
                totalJob = _b.sent();
                jobs = [];
                i = 0;
                _b.label = 4;
            case 4:
                if (!(i < jobsDetails.length)) return [3 /*break*/, 7];
                jobsDetail = jobsDetails[i];
                return [4 /*yield*/, invoices_shema_1.InvoiceModel.findOne({ jobId: jobsDetail._id })];
            case 5:
                invoice = _b.sent();
                if (!invoice)
                    return [3 /*break*/, 6];
                obj = {
                    jobsDetail: jobsDetail,
                    invoice: invoice
                };
                jobs.push(obj);
                _b.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                res.json({
                    currentPage: page,
                    totalJob: totalJob,
                    totalPages: Math.ceil(totalJob / limit),
                    jobs: jobsDetails,
                });
                return [3 /*break*/, 9];
            case 8:
                err_7 = _b.sent();
                // signup error
                res.status(500).json({ message: err_7.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.AdminGetSingleContractorJonDetailController = AdminGetSingleContractorJonDetailController;
//admin change contractor account status  /////////////
var AdminChangeContractorAccountStatusController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_1, contractorId, errors, adminId, admin, contractor, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, status_1 = _a.status, contractorId = _a.contractorId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                adminId = req.admin.id;
                return [4 /*yield*/, admin_model_1.default.findOne({ _id: adminId })];
            case 1:
                admin = _b.sent();
                if (!admin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid admin ID" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 2:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Invalid contractor ID" })];
                }
                contractor.status = status_1;
                return [4 /*yield*/, contractor.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "Contractor account status successfully change to ".concat(status_1)
                });
                return [3 /*break*/, 5];
            case 4:
                err_8 = _b.sent();
                // signup error
                res.status(500).json({ message: err_8.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AdminChangeContractorAccountStatusController = AdminChangeContractorAccountStatusController;
exports.AdminContractorDetail = {
    getContractors: exports.getContractors,
    AdminGetSingleContractorDetailController: exports.AdminGetSingleContractorDetailController,
    AdminChangeContractorGstStatusController: exports.AdminChangeContractorGstStatusController,
    AdminGetContractorGstPendingController: exports.AdminGetContractorGstPendingController,
    AdminGetContractorGstReviewingController: exports.AdminGetContractorGstReviewingController,
    AdminGetContractorGstApproveController: exports.AdminGetContractorGstApproveController,
    AdminGetContractorGstDecliningController: exports.AdminGetContractorGstDecliningController,
    AdminGetSingleContractorJonDetailController: exports.AdminGetSingleContractorJonDetailController,
    AdminChangeContractorAccountStatusController: exports.AdminChangeContractorAccountStatusController
};
