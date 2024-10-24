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
exports.ContractorModel = void 0;
var mongoose_1 = require("mongoose");
var contractor_interface_1 = require("../interface/contractor.interface");
// import { contractorStatus } from "../../../constants/contractorStatus";
var contractor_quiz_model_1 = __importDefault(require("./contractor_quiz.model"));
var stripe_customer_schema_1 = require("../../common/stripe_customer.schema");
var stripe_account_schema_1 = require("../../common/stripe_account.schema");
var stripe_paymentmethod_schema_1 = require("../../common/stripe_paymentmethod.schema");
var question_model_1 = __importDefault(require("../../admin/models/question.model"));
var mongoose_delete_1 = __importDefault(require("mongoose-delete"));
var job_quotation_model_1 = require("../../common/job_quotation.model");
var job_model_1 = require("../../common/job.model");
var GstDetailSchema = new mongoose_1.Schema({
    gstName: String,
    gstNumber: String,
    gstType: String,
    backgroundCheckConsent: String,
    status: { type: String, enum: Object.values(contractor_interface_1.GST_STATUS), default: contractor_interface_1.GST_STATUS.PENDING },
    approvedBy: mongoose_1.Schema.Types.ObjectId,
    approvedAt: Date,
    recentRemark: String,
    gstCertificate: String,
    statusReason: String,
});
var CompanyDetailSchema = new mongoose_1.Schema({
    companyLogo: String,
    companyStaffId: String, //url
    status: { type: String, enum: Object.values(contractor_interface_1.COMPANY_STATUS), default: contractor_interface_1.COMPANY_STATUS.PENDING },
    approvedBy: mongoose_1.Schema.Types.ObjectId,
    approvedAt: Date,
    recentRemark: String,
});
var CertnDetailSchema = new mongoose_1.Schema({
    created: String,
    modified: String,
    is_submitted: Boolean,
    applicant_type: String,
    check_executions: [
        {
            id: String,
            check_name: String,
            status: String,
        },
    ],
    result: String,
    result_label: String,
    report_status: String,
    applicant_account: {
        id: String,
        email: String,
        email_verified: Boolean,
        phone_number: String,
    },
    application: {
        created: String,
        modified: String,
        id: String,
        applicant: {
            id: String,
            status: String,
            email: String,
            phone_number: String,
            application_url: String,
            report_url: String,
        },
        owner: {
            id: String,
            email: String,
        },
    },
    adjudication_status: String,
    adjudication_status_label: String,
    is_favourite: Boolean,
    reliability_risk: String,
    workplace_misconduct: String,
    early_termination: String,
    applicant_result_summary: String,
    social_result_summary: String,
    identity_verified_summary: String,
    status: String,
    status_label: String,
});
var ContractorSchema = new mongoose_1.Schema({
    profile: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "contractor_profiles",
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    companyName: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(contractor_interface_1.CONTRACTOR_STATUS),
        default: contractor_interface_1.CONTRACTOR_STATUS.APPROVED,
    },
    acceptTerms: {
        type: Boolean
    },
    accountType: {
        type: String,
        enum: Object.values(contractor_interface_1.CONTRACTOR_TYPES),
    },
    profilePhoto: {
        type: Object,
        default: { url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png' }
    },
    phoneNumber: {
        code: { type: String },
        number: { type: String, unique: true, },
        verifiedAt: { type: Date, default: null },
    },
    passwordOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
    stripeCustomer: {
        type: stripe_customer_schema_1.StripeCustomerSchema,
        default: null
    },
    stripeIdentity: {
        type: Object,
        default: null,
    },
    stripeAccount: {
        type: stripe_account_schema_1.StripeAccountSchema,
    },
    stripePaymentMethods: {
        type: [stripe_paymentmethod_schema_1.StripePaymentMethodSchema],
    },
    gstDetails: {
        type: GstDetailSchema
    },
    companyDetails: {
        type: CompanyDetailSchema
    },
    certnId: {
        type: String,
    },
    certnDetails: {
        type: CertnDetailSchema
    },
    reviews: [{ review: { type: mongoose_1.Schema.Types.ObjectId, ref: 'reviews' }, averageRating: Number }],
    stats: {
        formattedResponseTime: { type: mongoose_1.Schema.Types.Mixed },
        responseTime: { type: mongoose_1.Schema.Types.Mixed },
        jobsCompleted: { type: mongoose_1.Schema.Types.Mixed },
        jobsCanceled: { type: mongoose_1.Schema.Types.Mixed },
        jobsPending: { type: mongoose_1.Schema.Types.Mixed },
        jobsTotal: { type: mongoose_1.Schema.Types.Mixed }
    },
    badge: {
        label: { type: String, default: contractor_interface_1.CONTRACTOR_BADGE.PROSPECT },
        icon: { type: String, default: null },
    },
    onboarding: {
        hasStripeAccount: { default: false, type: Boolean },
        hasStripeIdentity: { default: false, type: Boolean },
        stripeIdentityStatus: { default: 'unverified', type: String },
        hasStripePaymentMethods: { default: false, type: Boolean },
        hasStripeCustomer: { default: false, type: Boolean },
        hasProfile: { default: false, type: Boolean },
        hasGstDetails: { default: false, type: Boolean },
        hasCompanyDetails: { default: false, type: Boolean },
        hasPassedQuiz: { default: false, type: Boolean },
        stage: { default: { status: 1, label: 'stripeIdentity' }, type: Object },
    },
    currentTimezone: { type: String, default: "America/Los_Angeles" },
    language: {
        type: String,
        default: 'en'
    },
    referralCode: {
        type: String,
    },
    referral: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'referrals',
    },
}, {
    timestamps: true,
});
// ContractorSchema.index(
//   { referralCode: 1 },
//   { unique: true, partialFilterExpression: { referralCode: { $ne: null } } }
// );
ContractorSchema.virtual('stripeIdentityStatus').get(function () {
    //@ts-ignore
    return this.stripeIdentity ? this.stripeIdentity.status : 'unverified';
});
ContractorSchema.virtual('stripeAccountStatus').get(function () {
    var _a, _b;
    var stripeAccount = this.stripeAccount;
    var detailsSubmitted = (stripeAccount === null || stripeAccount === void 0 ? void 0 : stripeAccount.details_submitted) || false;
    var payoutsEnabled = (stripeAccount === null || stripeAccount === void 0 ? void 0 : stripeAccount.payouts_enabled) || false;
    var chargesEnabled = (stripeAccount === null || stripeAccount === void 0 ? void 0 : stripeAccount.charges_enabled) || false;
    var transfersEnabled = ((_a = stripeAccount === null || stripeAccount === void 0 ? void 0 : stripeAccount.capabilities) === null || _a === void 0 ? void 0 : _a.transfers) === 'active' || false;
    var cardPaymentsEnabled = ((_b = stripeAccount === null || stripeAccount === void 0 ? void 0 : stripeAccount.capabilities) === null || _b === void 0 ? void 0 : _b.card_payments) === 'active' || false;
    var status = (detailsSubmitted && payoutsEnabled && chargesEnabled && transfersEnabled && cardPaymentsEnabled) ? 'active' : 'inactive';
    return stripeAccount ? {
        details_submitted: detailsSubmitted,
        payouts_enabled: payoutsEnabled,
        charges_enabled: chargesEnabled,
        transfers_enabled: transfersEnabled,
        card_payments_enabled: cardPaymentsEnabled,
        status: status
    } : {
        details_submitted: detailsSubmitted,
        payouts_enabled: payoutsEnabled,
        charges_enabled: chargesEnabled,
        transfers_enabled: transfersEnabled,
        card_payments_enabled: cardPaymentsEnabled,
        status: status
    };
});
ContractorSchema.virtual('accountStatus').get(function () {
    var hasProfile = !!this.profile;
    var hasStripeIdentity = !!this.stripeIdentity && this.stripeIdentity.status === 'verified';
    var hasCertnApproval = !!this.certnDetails && this.certnDetails.report_status === 'COMPLETE';
    // Admin-level statuses that override everything else
    var adminBadStatus = [contractor_interface_1.CONTRACTOR_STATUS.SUSPENDED, contractor_interface_1.CONTRACTOR_STATUS.BLACKLISTED, contractor_interface_1.CONTRACTOR_STATUS.REVIEWING].includes(this.status);
    // Return the admin status if the contractor is in one of the adminBadStatus categories
    if (adminBadStatus) {
        return this.status;
    }
    // Return APPROVED if profile, Stripe identity, and Certn approval are in good standing
    if (hasProfile && hasStripeIdentity && hasCertnApproval) {
        return contractor_interface_1.CONTRACTOR_STATUS.APPROVED;
    }
    // Default to REVIEWING if the contractor does not meet the conditions for APPROVED
    return contractor_interface_1.CONTRACTOR_STATUS.REVIEWING;
});
ContractorSchema.virtual('certnStatus').get(function () {
    var certnDetails = this.certnDetails;
    var status = 'NOT_STARTED';
    if (certnDetails) {
        if (!certnDetails.is_submitted) {
            status = 'NOT_SUBMITTED';
        }
        else {
            status = 'COMPLETE';
            for (var _i = 0, _a = certnDetails.check_executions; _i < _a.length; _i++) {
                var execution = _a[_i];
                if (execution.status == 'IN_PROGRESS') {
                    status = 'IN_PROGRESS';
                    break; // No need to continue, we already found a IN_PROGRESS check
                }
                if (execution.status == 'FAILED') {
                    status = 'FAILED';
                    break;
                }
            }
        }
    }
    // temp fix until app is updated
    // if(status === 'COMPLETE'){
    //   status = 'COMPLETED'
    // }
    return status;
});
ContractorSchema.virtual('certnReport').get(function () {
    var certnDetails = this.certnDetails;
    var status = 'NOT_STARTED';
    var action = 'NONE';
    if (certnDetails) {
        if (!certnDetails.is_submitted) {
            status = 'NOT_SUBMITTED';
        }
        else {
            status = 'COMPLETE';
            for (var _i = 0, _a = certnDetails.check_executions; _i < _a.length; _i++) {
                var execution = _a[_i];
                status = certnDetails.report_status;
                if (execution.status == 'IN_PROGRESS') {
                    status = 'IN_PROGRESS';
                    break; // No need to continue, we already found a failed check
                }
                if (execution.status == 'FAILED') {
                    status = 'FAILED';
                    break; // No need to continue, we already found a failed check
                }
            }
        }
        action = certnDetails.application.applicant.application_url;
    }
    // temp fix until app is updated
    // if(status === 'COMPLETE'){
    //   status = 'COMPLETED'
    // }
    return { status: status, action: action };
});
ContractorSchema.virtual('rating').get(function () {
    // Access reviews using `this.get('reviews')`
    var reviews = this.get('reviews') || [];
    var totalRating = reviews.reduce(function (acc, review) { return acc + review.averageRating; }, 0);
    return reviews.length > 0 ? totalRating / reviews.length : 0;
});
ContractorSchema.virtual('reviewCount').get(function () {
    var reviews = this.get('reviews') || [];
    return reviews.length;
});
ContractorSchema.methods.getOnboarding = function () {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var hasStripeAccount, hasStripeCustomer, hasStripePaymentMethods, hasStripeIdentity, stripeIdentityStatus, hasProfile, hasGstDetails, hasCompanyDetails, hasPassedQuiz, latestQuiz, questions, totalQuestions, totalCorrect, percentageCorrect, stage;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    hasStripeAccount = !!this.stripeAccount;
                    hasStripeCustomer = !!this.stripeCustomer;
                    hasStripePaymentMethods = Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0;
                    hasStripeIdentity = !!this.stripeIdentity && this.stripeIdentity.status == 'verified';
                    stripeIdentityStatus = 'requires_input';
                    if (hasStripeIdentity && this.stripeIdentity.last_verification_report) {
                        stripeIdentityStatus = (_c = (_b = (_a = this.stripeIdentity) === null || _a === void 0 ? void 0 : _a.last_verification_report) === null || _b === void 0 ? void 0 : _b.document) === null || _c === void 0 ? void 0 : _c.status;
                    }
                    hasProfile = !!this.profile;
                    hasGstDetails = !!this.gstDetails;
                    hasCompanyDetails = !!this.companyDetails;
                    hasPassedQuiz = false;
                    return [4 /*yield*/, contractor_quiz_model_1.default.findOne({ contractor: this._id }).sort({ createdAt: -1 })];
                case 1:
                    latestQuiz = _d.sent();
                    if (!latestQuiz) return [3 /*break*/, 3];
                    return [4 /*yield*/, question_model_1.default.find({ quiz: latestQuiz.quiz })];
                case 2:
                    questions = _d.sent();
                    totalQuestions = 10;
                    totalCorrect = latestQuiz.response.filter(function (response) { return response.correct; }).length;
                    percentageCorrect = (totalCorrect / totalQuestions) * 100;
                    hasPassedQuiz = (percentageCorrect >= 70);
                    _d.label = 3;
                case 3:
                    stage = { status: 1, label: 'stripeIdentity' };
                    if (this.accountType == 'Company') {
                        if (stage.status == 1 && hasStripeIdentity && stripeIdentityStatus == 'verified')
                            stage = { status: 2, label: 'companyDetails' };
                        if (stage.status == 2 && hasCompanyDetails)
                            stage = { status: 3, label: 'profile' }; // 
                        if (stage.status == 3 && hasProfile)
                            stage = { status: 4, label: 'gstDetails' };
                        if (stage.status == 4 && hasGstDetails)
                            stage = { status: 5, label: 'quiz' };
                        if (stage.status == 5 && hasPassedQuiz)
                            stage = { status: 6, label: 'stripeAccount' };
                        if (stage.status == 6 && hasStripeAccount)
                            stage = { status: 7, label: 'done' };
                    }
                    if (this.accountType == 'Individual') {
                        if (stage.status == 1 && hasStripeIdentity && stripeIdentityStatus == 'verified')
                            stage = { status: 2, label: 'profle' };
                        if (stage.status == 2 && hasProfile)
                            stage = { status: 3, label: 'quiz' };
                        // if (stage.status == 3 && hasGstDetails) stage = {status: 4, label: 'quiz'} 
                        if (stage.status == 3 && hasPassedQuiz)
                            stage = { status: 4, label: 'done' };
                        // if (stage.status == 4 && hasStripeAccount) stage = { status: 5, label: 'done' }
                    }
                    if (this.accountType == 'Employee') {
                        if (stage.status == 1 && hasStripeIdentity && stripeIdentityStatus == 'verified')
                            stage = { status: 2, label: 'profle' };
                        if (stage.status == 2 && hasProfile)
                            stage = { status: 3, label: 'quiz' };
                        if (stage.status == 3 && hasPassedQuiz)
                            stage = { status: 4, label: 'done' };
                    }
                    return [2 /*return*/, {
                            hasStripeAccount: hasStripeAccount,
                            hasStripeIdentity: hasStripeIdentity,
                            stripeIdentityStatus: stripeIdentityStatus,
                            hasStripePaymentMethods: hasStripePaymentMethods,
                            hasStripeCustomer: hasStripeCustomer,
                            hasProfile: hasProfile,
                            hasGstDetails: hasGstDetails,
                            hasCompanyDetails: hasCompanyDetails,
                            hasPassedQuiz: hasPassedQuiz,
                            stage: stage,
                        }];
            }
        });
    });
};
// Instance method to get formatted response time
ContractorSchema.methods.getStats = function (contractor) {
    if (contractor === void 0) { contractor = null; }
    return __awaiter(this, void 0, void 0, function () {
        var contractorId, quotations, totalResponseTime, count, responseTime, formattedResponseTime, jobsCompleted, jobsCanceled, jobsPending, jobsTotal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contractorId = contractor !== null && contractor !== void 0 ? contractor : this._id;
                    return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId })];
                case 1:
                    quotations = _a.sent();
                    totalResponseTime = 0;
                    count = 0;
                    quotations.forEach(function (quotation) {
                        totalResponseTime += quotation.responseTime;
                        count++;
                    });
                    responseTime = totalResponseTime / count;
                    formattedResponseTime = '';
                    if (!responseTime) {
                        formattedResponseTime = "Not available";
                    }
                    else if (responseTime <= 2 * 60) {
                        formattedResponseTime = "Less than 2 mins";
                    }
                    else if (responseTime <= 10 * 60) {
                        formattedResponseTime = "Within 10 mins";
                    }
                    else if (responseTime <= 60 * 60) {
                        formattedResponseTime = "".concat(Math.round(responseTime / (60)), " mins");
                    }
                    else if (responseTime <= 2 * 60 * 60) {
                        formattedResponseTime = "Greater than 2 hours";
                    }
                    else if (responseTime <= 24 * 60 * 60) {
                        formattedResponseTime = "".concat(Math.round(responseTime / (60 * 60)), " hours");
                    }
                    else if (responseTime <= 48 * 60 * 60) {
                        formattedResponseTime = "Greater than 1 day";
                    }
                    else {
                        formattedResponseTime = "More than 2 days";
                    }
                    return [4 /*yield*/, job_model_1.JobModel.countDocuments({ contractor: contractorId, status: job_model_1.JOB_STATUS.COMPLETED })];
                case 2:
                    jobsCompleted = _a.sent();
                    return [4 /*yield*/, job_model_1.JobModel.countDocuments({ contractor: contractorId, status: job_model_1.JOB_STATUS.CANCELED })];
                case 3:
                    jobsCanceled = _a.sent();
                    return [4 /*yield*/, job_model_1.JobModel.countDocuments({ contractor: contractorId, status: job_model_1.JOB_STATUS.PENDING })];
                case 4:
                    jobsPending = _a.sent();
                    return [4 /*yield*/, job_model_1.JobModel.countDocuments({ contractor: contractorId })];
                case 5:
                    jobsTotal = _a.sent();
                    return [2 /*return*/, { formattedResponseTime: formattedResponseTime, responseTime: responseTime, jobsCompleted: jobsCompleted, jobsCanceled: jobsCanceled, jobsPending: jobsPending, jobsTotal: jobsTotal }];
            }
        });
    });
};
ContractorSchema.virtual('quiz').get(function () {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var latestQuiz;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contractor_quiz_model_1.default.findOne({ contractor: this._id }).sort({ createdAt: -1 })];
                case 1:
                    latestQuiz = _b.sent();
                    return [4 /*yield*/, (latestQuiz === null || latestQuiz === void 0 ? void 0 : latestQuiz.result)];
                case 2: return [2 /*return*/, (_a = _b.sent()) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
});
ContractorSchema.virtual('name').get(function () {
    if (this.accountType == contractor_interface_1.CONTRACTOR_TYPES.Individual || this.accountType == contractor_interface_1.CONTRACTOR_TYPES.Employee) {
        return "".concat(this.firstName, " ").concat(this.lastName);
    }
    else if (this.accountType == contractor_interface_1.CONTRACTOR_TYPES.Company) {
        return this.companyName;
    }
});
ContractorSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passwordOtp;
        // Check if the options include virtuals, if not, delete the fields
        // Check if the options include virtuals, if not, delete the stripeIdentity field
        //@ts-ignore
        if (!options.includeStripeIdentity) {
            delete ret.stripeIdentity;
        }
        //@ts-ignore
        if (!options.includeStripePaymentMethods) {
            delete ret.stripePaymentMethods;
        }
        //@ts-ignore
        if (!options.includeStripeCustomer) {
            delete ret.stripeCustomer;
        }
        //@ts-ignore
        if (!options.includeStripeAccount) {
            delete ret.stripeAccount;
        }
        //@ts-ignore
        if (!options.includeReviews) {
            delete ret.reviews;
        }
        if (!ret.profilePhoto || !ret.profilePhoto.url) {
            ret.profilePhoto = {
                url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
            };
        }
        if (ret.accountType == contractor_interface_1.CONTRACTOR_TYPES.Company && ret.companyDetails && ret.companyDetails.companyLogo) {
            ret.profilePhoto = {
                url: ret.companyDetails.companyLogo
            };
        }
        //@ts-ignore
        ret.name = doc.name;
        return ret;
    },
    virtuals: true
});
// ["updateOne", "findByIdAndUpdate", "findOneAndUpdate"]
ContractorSchema.pre('findOneAndUpdate', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var filterQuery, update, profilePhoto, documentBeforeUpdate, previousProfilePhoto, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    filterQuery = this.getQuery();
                    update = this.getUpdate();
                    if (!(update && '$set' in update && typeof update.$set === 'object' && update.$set !== null)) return [3 /*break*/, 2];
                    profilePhoto = update.profilePhoto;
                    if (!profilePhoto) return [3 /*break*/, 2];
                    return [4 /*yield*/, exports.ContractorModel.findOne(filterQuery).exec()];
                case 1:
                    documentBeforeUpdate = _a.sent();
                    previousProfilePhoto = documentBeforeUpdate === null || documentBeforeUpdate === void 0 ? void 0 : documentBeforeUpdate.profilePhoto;
                    if (previousProfilePhoto) {
                        //use JOB here 
                        // await deleteObjectFromS3(previousProfilePhoto.url as string)
                    }
                    console.log('Previous Profile Photo:', previousProfilePhoto);
                    console.log('Updated Profile Photo:', profilePhoto);
                    _a.label = 2;
                case 2:
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    next(error_1); // Type assertion to Error
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
ContractorSchema.plugin(mongoose_delete_1.default, { deletedBy: true, overrideMethods: 'all' });
ContractorSchema.set('toObject', { virtuals: true });
exports.ContractorModel = (0, mongoose_1.model)("contractors", ContractorSchema);
