"use strict";
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
exports.AdminContractorController = exports.issueCoupon = exports.attachCertnId = exports.attachCertnDetails = exports.attachStripeAccount = exports.removeStripeAccount = exports.AdminChangeContractorAccountStatusController = exports.updateAccountStatus = exports.sendCustomEmail = exports.updateGstDetails = exports.getSingleJob = exports.getJobHistory = exports.getSingleContractor = exports.exploreContractors = void 0;
var express_validator_1 = require("express-validator");
var admin_model_1 = __importDefault(require("../../../database/admin/models/admin.model"));
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var job_model_1 = require("../../../database/common/job.model");
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
var api_feature_1 = require("../../../utils/api.feature");
var stripe_1 = require("../../../services/stripe");
var interface_dto_util_1 = require("../../../utils/interface_dto.util");
var custom_errors_1 = require("../../../utils/custom.errors");
var mongoose_1 = __importDefault(require("mongoose")); // Import Document type from mongoose
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var job_dispute_model_1 = require("../../../database/common/job_dispute.model");
var generic_email_1 = require("../../../templates/common/generic_email");
var services_1 = require("../../../services");
var promotion_schema_1 = require("../../../database/common/promotion.schema");
var coupon_schema_1 = require("../../../database/common/coupon.schema");
var couponCodeGenerator_1 = require("../../../utils/couponCodeGenerator");
var exploreContractors = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryFilter, dateFilter, start, end, _a, data, filter, contractorsData, reviewing, suspended, approved, blacklisted, total, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                queryFilter = {};
                // Date filter logic
                if (req.query.startDate) {
                    dateFilter = {};
                    start = new Date(req.query.startDate);
                    start.setUTCHours(0, 0, 0, 0);
                    dateFilter.$gte = start;
                    end = new Date(req.query.endDate ? req.query.endDate : req.query.startDate);
                    end.setUTCHours(23, 59, 59, 999);
                    dateFilter.$lte = end;
                    // Apply the date filter to createdAt
                    queryFilter.createdAt = dateFilter;
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(contractor_model_1.ContractorModel.find(queryFilter).populate('profile'), req.query, ['getOnboarding'])];
            case 1:
                _a = _b.sent(), data = _a.data, filter = _a.filter;
                contractorsData = [];
                if (!(req.query.startDate || req.query.endDate)) return [3 /*break*/, 2];
                contractorsData = data === null || data === void 0 ? void 0 : data.data;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, contractor_model_1.ContractorModel.find()];
            case 3:
                contractorsData = _b.sent(); // Fetch all contractors if no filter
                _b.label = 4;
            case 4:
                reviewing = contractorsData.filter(function (contractor) { return contractor.accountStatus === contractor_interface_1.CONTRACTOR_STATUS.REVIEWING; }).length;
                suspended = contractorsData.filter(function (contractor) { return contractor.accountStatus === contractor_interface_1.CONTRACTOR_STATUS.SUSPENDED; }).length;
                approved = contractorsData.filter(function (contractor) { return contractor.accountStatus === contractor_interface_1.CONTRACTOR_STATUS.APPROVED; }).length;
                blacklisted = contractorsData.filter(function (contractor) { return contractor.accountStatus === contractor_interface_1.CONTRACTOR_STATUS.BLACKLISTED; }).length;
                total = contractorsData.length;
                // Send response
                res.status(200).json({
                    success: true,
                    data: __assign(__assign({}, data), { stats: {
                            total: total,
                            reviewing: reviewing,
                            suspended: suspended,
                            approved: approved,
                            blacklisted: blacklisted
                        } })
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                console.error("Error fetching contractors:", err_1);
                res.status(400).json({ message: 'Something went wrong' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.exploreContractors = exploreContractors;
//get  single contractor detail /////////////
var getSingleContractor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, errors, admin, adminId, contractor, job, _a, quiz, _b, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
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
                contractor = _c.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Contractor not found" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.find({ contractor: contractor._id }).sort({ createdAt: -1 }).populate("customer", "profile")];
            case 2:
                job = _c.sent();
                _a = contractor;
                return [4 /*yield*/, contractor.getOnboarding()];
            case 3:
                _a.onboarding = _c.sent();
                return [4 /*yield*/, contractor.quiz];
            case 4:
                quiz = _c.sent();
                _b = contractor;
                return [4 /*yield*/, contractor.getStats()];
            case 5:
                _b.stats = _c.sent();
                return [2 /*return*/, res.json({ status: false, message: "Contractor retrieved", contractor: contractor })];
            case 6:
                err_2 = _c.sent();
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getSingleContractor = getSingleContractor;
var getJobHistory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, _a, type, _b, page, _c, limit, _d, sort, customerId, quotations, jobIds, _e, data, error, error_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                contractorId = req.params.contractorId;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 6, , 7]);
                _a = req.query, type = _a.type, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, customerId = _a.customerId;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId }).select('job').lean()];
            case 2:
                quotations = _f.sent();
                jobIds = quotations.map(function (quotation) { return quotation.job; });
                if (customerId) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                    }
                    req.query.customer = customerId;
                    delete req.query.customerId;
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find({
                        $or: [
                            { _id: { $in: jobIds } }, // Match jobs specified in jobIds
                            { contractor: contractorId }, // Match jobs with contractorId
                            { 'assignment.contractor': contractorId }
                        ]
                    }).distinct('_id'), req.query)];
            case 3:
                _e = _f.sent(), data = _e.data, error = _e.error;
                if (!data) return [3 /*break*/, 5];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!job.isAssigned) return [3 /*break*/, 2];
                                    _a = job;
                                    return [4 /*yield*/, job.getMyQuotation(job.contractor)];
                                case 1:
                                    _a.myQuotation = _c.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    _b = job;
                                    return [4 /*yield*/, job.getMyQuotation(contractorId)];
                                case 3:
                                    _b.myQuotation = _c.sent();
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                // Map through each job and attach myQuotation if contractor has applied 
                _f.sent();
                _f.label = 5;
            case 5:
                if (error) {
                    return [2 /*return*/, next(new custom_errors_1.BadRequestError('Unknown error occurred', error))];
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _f.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_1))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getJobHistory = getJobHistory;
var getSingleJob = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, jobId, job, responseData, _a, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                contractorId = req.params.id;
                jobId = req.params.jobId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({
                        $or: [
                            { contractor: contractorId },
                            { 'assignment.contractor': contractorId }
                        ], _id: jobId
                    }).populate(['contractor', 'contract', 'customer', 'assignment.contractor'])];
            case 1:
                job = _c.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                responseData = __assign({}, job.toJSON());
                _a = responseData;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ job: job.id })];
            case 2:
                _a.dispute = _c.sent();
                _b = responseData;
                return [4 /*yield*/, job.getJobDay()
                    // If the job exists, return it as a response
                ];
            case 3:
                _b.jobDay = _c.sent();
                // If the job exists, return it as a response
                res.json({ success: true, message: 'Job retrieved', data: responseData });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred ', error_2))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getSingleJob = getSingleJob;
var updateGstDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gstStatus, gstName, gstNumber, gstType, backgroundCheckConsent, status_1, gstCertificate, _b, reason, contractorId, adminId, errors, contractor, createdTime, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, gstStatus = _a.gstStatus, gstName = _a.gstName, gstNumber = _a.gstNumber, gstType = _a.gstType, backgroundCheckConsent = _a.backgroundCheckConsent, status_1 = _a.status, gstCertificate = _a.gstCertificate, _b = _a.reason, reason = _b === void 0 ? "Not Specified" : _b;
                contractorId = req.params.contractorId;
                adminId = req.admin.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                if (!mongoose_1.default.isValidObjectId(contractorId)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Invalid contractor Id supplied" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _c.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ message: "Contractor not found" })];
                }
                if (reason === '' && gstStatus === contractor_interface_1.GST_STATUS.DECLINED) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "please provide reason for declining contractor" })];
                }
                createdTime = new Date();
                contractor.gstDetails.status = gstStatus;
                contractor.gstDetails.approvedBy = adminId;
                contractor.gstDetails.approvedAt = createdTime;
                contractor.gstDetails.statusReason = reason;
                contractor.gstDetails.gstName = gstName !== null && gstName !== void 0 ? gstName : contractor.gstDetails.gstName;
                contractor.gstDetails.gstType = gstType !== null && gstType !== void 0 ? gstType : contractor.gstDetails.gstType;
                contractor.gstDetails.gstCertificate = gstCertificate !== null && gstCertificate !== void 0 ? gstCertificate : contractor.gstDetails.gstCertificate;
                contractor.gstDetails.backgroundCheckConsent = backgroundCheckConsent !== null && backgroundCheckConsent !== void 0 ? backgroundCheckConsent : contractor.gstDetails.backgroundCheckConsent;
                return [4 /*yield*/, contractor.save()
                    // TODO: Send email to contractor
                ];
            case 2:
                _c.sent();
                // TODO: Send email to contractor
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Contractor gst status successfully changed to ".concat(gstStatus)
                    })];
            case 3:
                err_3 = _c.sent();
                // signup error
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateGstDetails = updateGstDetails;
var sendCustomEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, subject, htmlContent, contractorId, adminId, errors, contractor, emailSubject, emailContent, html, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, subject = _a.subject, htmlContent = _a.htmlContent;
                contractorId = req.params.contractorId;
                adminId = req.admin.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                if (!mongoose_1.default.isValidObjectId(contractorId)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Invalid contractor Id supplied" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Contractor not found" })];
                }
                emailSubject = subject;
                emailContent = htmlContent;
                html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                services_1.EmailService.send(contractor.email, emailSubject, html);
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Email sent successfully changed to ".concat(contractor.email)
                    })];
            case 2:
                err_4 = _b.sent();
                // signup error
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendCustomEmail = sendCustomEmail;
var updateAccountStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_2, contractorId, adminId, errors, contractor, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                status_2 = req.body.status;
                contractorId = req.params.contractorId;
                adminId = req.admin.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Validation error occurred", errors: errors.array() })];
                }
                if (!mongoose_1.default.isValidObjectId(contractorId)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Invalid contractor Id supplied" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Contractor not found" })];
                }
                contractor.gstDetails.status = status_2;
                return [4 /*yield*/, contractor.save()
                    // TODO: Send email to contractor
                ];
            case 2:
                _a.sent();
                // TODO: Send email to contractor
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Contractor status successfully changed to ".concat(status_2)
                    })];
            case 3:
                err_5 = _a.sent();
                // signup error
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateAccountStatus = updateAccountStatus;
var AdminChangeContractorAccountStatusController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_3, contractorId, errors, adminId, admin, contractor, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, status_3 = _a.status, contractorId = _a.contractorId;
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
                contractor.status = status_3;
                return [4 /*yield*/, contractor.save()];
            case 3:
                _b.sent();
                res.json({
                    message: "Contractor account status successfully change to ".concat(status_3)
                });
                return [3 /*break*/, 5];
            case 4:
                err_6 = _b.sent();
                // signup error
                res.status(500).json({ message: err_6.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.AdminChangeContractorAccountStatusController = AdminChangeContractorAccountStatusController;
var removeStripeAccount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, contractor, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                contractorId = req.params.contractorId;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                //@ts-ignore
                contractor.stripeAccount = null;
                return [4 /*yield*/, contractor.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.json({ success: true, message: 'Stripe account  removed', data: contractor })];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error removing stripe account', error_3))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.removeStripeAccount = removeStripeAccount;
var attachStripeAccount = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var stripeAccountId, contractorId, contractor, account, stripeAccount, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                stripeAccountId = req.body.stripeAccountId;
                contractorId = req.params.contractorId;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                return [4 /*yield*/, stripe_1.StripeService.account.getAccount(stripeAccountId)];
            case 2:
                account = _a.sent();
                stripeAccount = (0, interface_dto_util_1.castPayloadToDTO)(account, account);
                contractor.stripeAccount = stripeAccount;
                return [4 /*yield*/, contractor.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, res.json({ success: true, message: 'Stripe account  attached', data: contractor })];
            case 4:
                error_4 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error attaching stripe account: ".concat(error_4.message), error_4))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.attachStripeAccount = attachStripeAccount;
var attachCertnDetails = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, certnDetails, contractorEmail, contractorId, contractor, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, certnDetails = _a.certnDetails, contractorEmail = _a.contractorEmail;
                contractorId = req.params.contractorId;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: contractorEmail })];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                // Attach certnDetails to the contractor
                return [4 /*yield*/, contractor_model_1.ContractorModel.findByIdAndUpdate(contractor.id, {
                        certnId: certnDetails.application.applicant.id,
                        certnDetails: certnDetails
                    })];
            case 2:
                // Attach certnDetails to the contractor
                _b.sent();
                services_1.NotificationService.sendNotification({
                    user: contractor.id,
                    userType: 'contractors',
                    title: 'Background Check Complete',
                    type: 'BACKGROUND_CHECK', //
                    message: "Your background check with CERTN is now complete",
                    heading: { name: "Repairfind", image: 'https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png' },
                    payload: {}
                }, { push: true, socket: true, database: true });
                // Respond with success message
                return [2 /*return*/, res.json({ success: true, message: 'Certn details attached', data: contractor })];
            case 3:
                error_5 = _b.sent();
                // Handle any errors that occur
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error attaching certn details: ".concat(error_5.message), error_5))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.attachCertnDetails = attachCertnDetails;
// Attach Certn Id and let the cron job retrieve the result and notify
var attachCertnId = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, certnId, contractorEmail, contractor, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, certnId = _a.certnId, contractorEmail = _a.contractorEmail;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ email: contractorEmail })];
            case 1:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                // Attach certnDetails to the contractor
                return [4 /*yield*/, contractor_model_1.ContractorModel.findByIdAndUpdate(contractor.id, {
                        certnId: certnId,
                    })
                    // Respond with success message
                ];
            case 2:
                // Attach certnDetails to the contractor
                _b.sent();
                // Respond with success message
                return [2 /*return*/, res.json({ success: true, message: 'Certn details attached', data: contractor })];
            case 3:
                error_6 = _b.sent();
                // Handle any errors that occur
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error attaching certn details: ".concat(error_6.message), error_6))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.attachCertnId = attachCertnId;
var issueCoupon = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var promotionId, contractorId, promotion, newUserCoupon, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                promotionId = req.body.promotionId;
                contractorId = req.params.contractorId;
                return [4 /*yield*/, promotion_schema_1.PromotionModel.findById(promotionId)];
            case 1:
                promotion = _a.sent();
                if (!promotion) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Promotion not found' })];
                }
                // Check if the promotion is active
                if (promotion.status !== promotion_schema_1.PROMOTION_STATUS.ACTIVE) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Promotion is not active' })];
                }
                newUserCoupon = new coupon_schema_1.CouponModel({
                    promotion: promotion._id, // Attach promotion ID
                    name: promotion.name,
                    code: (0, couponCodeGenerator_1.generateCouponCode)(7), // generate coupon code here
                    user: contractorId,
                    userType: 'contractors',
                    valueType: promotion.valueType,
                    value: promotion.value,
                    applicableAtCheckout: true,
                    expiryDate: promotion.endDate,
                    status: 'active'
                });
                // Save the new coupon
                return [4 /*yield*/, newUserCoupon.save()];
            case 2:
                // Save the new coupon
                _a.sent();
                // Respond with success message
                return [2 /*return*/, res.json({ success: true, message: 'Promotion attached to user as coupon', data: newUserCoupon })];
            case 3:
                error_7 = _a.sent();
                // Handle any errors that occur
                return [2 /*return*/, next(new custom_errors_1.InternalServerError("Error attaching promotion to user coupon: ".concat(error_7.message), error_7))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.issueCoupon = issueCoupon;
exports.AdminContractorController = {
    exploreContractors: exports.exploreContractors,
    removeStripeAccount: exports.removeStripeAccount,
    attachStripeAccount: exports.attachStripeAccount,
    getSingleContractor: exports.getSingleContractor,
    getJobHistory: exports.getJobHistory,
    getSingleJob: exports.getSingleJob,
    updateGstDetails: exports.updateGstDetails,
    updateAccountStatus: exports.updateAccountStatus,
    sendCustomEmail: exports.sendCustomEmail,
    attachCertnDetails: exports.attachCertnDetails,
    attachCertnId: exports.attachCertnId,
    issueCoupon: exports.issueCoupon
};
