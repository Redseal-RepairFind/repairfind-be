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
var contractorStatus_1 = require("../../../constants/contractorStatus");
var contractor_quiz_model_1 = __importDefault(require("./contractor_quiz.model"));
var stripe_customer_schema_1 = require("../../common/stripe_customer.schema");
var stripe_account_schema_1 = require("../../common/stripe_account.schema");
var stripe_paymentmethod_schema_1 = require("../../common/stripe_paymentmethod.schema");
var question_model_1 = __importDefault(require("../../admin/models/question.model"));
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
        enum: Object.values(contractorStatus_1.contractorStatus),
        default: contractorStatus_1.contractorStatus.REVIEWING,
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
        default: {
            url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
        }
    },
    phoneNumber: {
        code: {
            type: String
        },
        number: {
            type: String
        },
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
    phoneNumberOtp: {
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
        default: Date.now,
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
    onboarding: {
        hasStripeAccount: { default: false, type: Boolean },
        hasStripeIdentity: { default: false, type: Boolean },
        hasStripePaymentMethods: { default: false, type: Boolean },
        hasStripeCustomer: { default: false, type: Boolean },
        hasProfile: { default: false, type: Boolean },
        hasGstDetails: { default: false, type: Boolean },
        hasCompanyDetails: { default: false, type: Boolean },
        hasPassedQuiz: { default: false, type: Boolean },
        stage: { default: 1, type: Number },
    }
}, {
    timestamps: true,
});
ContractorSchema.virtual('stripeIdentityStatus').get(function () {
    //@ts-ignore
    return this.stripeIdentity ? this.stripeIdentity.status : 'unverified';
});
ContractorSchema.virtual('stripeAccountStatus').get(function () {
    var _a, _b, _c, _d;
    var stripeAccount = this.stripeAccount;
    return stripeAccount ? {
        details_submitted: stripeAccount.details_submitted,
        payouts_enabled: stripeAccount.payouts_enabled,
        charges_enabled: stripeAccount.charges_enabled,
        transfers_enabled: (_b = (_a = stripeAccount === null || stripeAccount === void 0 ? void 0 : stripeAccount.capabilities) === null || _a === void 0 ? void 0 : _a.transfers) !== null && _b !== void 0 ? _b : 'inactive',
        card_payments_enabled: (_d = (_c = stripeAccount === null || stripeAccount === void 0 ? void 0 : stripeAccount.capabilities) === null || _c === void 0 ? void 0 : _c.card_payments) !== null && _d !== void 0 ? _d : 'inactive',
    } : null;
});
ContractorSchema.virtual('certnStatus').get(function () {
    var certnDetails = this.certnDetails;
    var status = 'NOT_STARTED';
    if (certnDetails) {
        if (!certnDetails.is_submitted) {
            status = 'NOT_SUBMITTED';
        }
        else {
            status = certnDetails.status;
        }
    }
    return status;
    // return certnDetails ? {
    //   result: certnDetails.result,
    //   report_status: certnDetails.report_status,
    //   adjudication_status: certnDetails.adjudication_status,
    //   check_executions: certnDetails.check_executions,
    //   is_submitted: certnDetails.is_submitted,
    //   application_url: certnDetails.application.applicant.application_url,
    //   report_url: certnDetails.application.applicant.report_url,
    //   modified: certnDetails.modified,
    //   identity_verified_summary: certnDetails.identity_verified_summary,
    //   status: certnDetails.status,
    //   status_label: certnDetails.status_label,
});
ContractorSchema.methods.getOnboarding = function () {
    return __awaiter(this, void 0, void 0, function () {
        var hasStripeAccount, hasStripeCustomer, hasStripePaymentMethods, hasStripeIdentity, hasProfile, hasGstDetails, hasCompanyDetails, hasPassedQuiz, latestQuiz, questions, totalQuestions, totalCorrect, percentageCorrect, stage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hasStripeAccount = !!this.stripeAccount;
                    hasStripeCustomer = !!this.stripeCustomer;
                    hasStripePaymentMethods = Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0;
                    hasStripeIdentity = !!this.stripeIdentity;
                    hasProfile = !!this.profile;
                    hasGstDetails = !!this.gstDetails;
                    hasCompanyDetails = !!this.companyDetails;
                    hasPassedQuiz = false;
                    return [4 /*yield*/, contractor_quiz_model_1.default.findOne({ contractor: this._id }).sort({ createdAt: -1 })];
                case 1:
                    latestQuiz = _a.sent();
                    if (!latestQuiz) return [3 /*break*/, 3];
                    return [4 /*yield*/, question_model_1.default.find({ quiz: latestQuiz.quiz })];
                case 2:
                    questions = _a.sent();
                    totalQuestions = questions.length;
                    totalCorrect = latestQuiz.response.filter(function (response) { return response.correct; }).length;
                    percentageCorrect = (totalCorrect / totalQuestions) * 100;
                    hasPassedQuiz = (percentageCorrect >= 70);
                    _a.label = 3;
                case 3:
                    stage = 1 //{status: 1, label: 'stripeIdentity'};
                    ;
                    if (this.accountType == 'Company') {
                        if (stage == 1 && hasStripeIdentity)
                            stage = 2; // {status: 2, label: 'companyDetails'} 
                        if (stage == 2 && hasCompanyDetails)
                            stage = 3; //{status: 3, label: 'profile'} // 
                        if (stage == 3 && hasProfile)
                            stage = 4; //{status: 4, label: 'gstDetails'}
                        if (stage == 4 && hasGstDetails)
                            stage = 5; //{status: 5, label: 'quiz'}
                        if (stage == 5 && hasPassedQuiz)
                            stage = 6; //{status: 5, label: 'done'}
                    }
                    if (this.accountType == 'Individual') {
                        if (stage == 1 && hasStripeIdentity)
                            stage = 2; //{status: 2, label: 'profle'} 
                        if (stage == 2 && hasProfile)
                            stage = 3; //{status: 3, label: 'gstDetails'} 
                        if (stage == 3 && hasGstDetails)
                            stage = 4; //{status: 4, label: 'quiz'} 
                        if (stage == 4 && hasPassedQuiz)
                            stage = 5; //{status: 5, label: 'done'}
                    }
                    if (this.accountType == 'Employee') {
                        if (stage == 1 && hasStripeIdentity)
                            stage = 2; //{status: 2, label: 'profle'} 
                        if (stage == 2 && hasProfile)
                            stage = 3; //{status: 3, label: 'quiz'} 
                        if (stage == 3 && hasPassedQuiz)
                            stage = 4; //{status: 3, label: 'done'} 
                    }
                    return [2 /*return*/, {
                            hasStripeAccount: hasStripeAccount,
                            hasStripeIdentity: hasStripeIdentity,
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
// ContractorSchema.virtual('onboarding').get(function (this: IContractor) {
//   const hasStripeAccount = !!this.stripeAccount;
//   const hasStripeCustomer = !!this.stripeCustomer;
//   const hasStripePaymentMethods = Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0
//   const hasStripeIdentity = !!this.stripeIdentity;
//   const hasProfile = !!this.profile;
//   const hasGstDetails = !!this.gstDetails;
//   const hasCompanyDetails = !!this.companyDetails;
//   const latestQuiz: any =  ContractorQuizModel.findOne({ contractor: this._id }).sort({ createdAt: -1 });
//   const hasPassedQuiz = latestQuiz?.result
//   let stage: any = {status: 0, label: 'account'};
//   if(this) stage = {status: 1, label: 'stripeIdentity'}
//   if(this.accountType == 'Company'){
//     if(hasStripeIdentity) stage = {status: 2, label: 'companyDetails'} 
//     if(hasCompanyDetails) stage = {status: 3, label: 'profile'} // 
//     if(hasProfile) stage =  {status: 4, label: 'gstDetails'}
//     if(hasGstDetails) stage = {status: 5, label: 'done'}
//   }
//   if(this.accountType == 'Individual'){
//     if(hasStripeIdentity) stage = {status: 2, label: 'profle'} 
//     if(hasProfile) stage = {status: 3, label: 'gstDetails'} 
//     if(hasGstDetails) stage = {status: 4, label: 'done'} 
//   }
//   if(this.accountType == 'Employee'){
//     if(hasStripeIdentity) stage = {status: 2, label: 'profle'} 
//     if(hasProfile) stage = {status: 3, label: 'done'} 
//   }
//   return {
//     hasStripeAccount,
//     hasStripeIdentity,
//     hasStripePaymentMethods,
//     hasStripeCustomer,
//     hasProfile,
//     hasGstDetails,
//     hasCompanyDetails,
//     stage
//   }
// });
ContractorSchema.virtual('quiz').get(function () {
    return __awaiter(this, void 0, void 0, function () {
        var latestQuiz;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contractor_quiz_model_1.default.findOne({ contractor: this._id }).sort({ createdAt: -1 })];
                case 1:
                    latestQuiz = _a.sent();
                    return [4 /*yield*/, (latestQuiz === null || latestQuiz === void 0 ? void 0 : latestQuiz.result)];
                case 2: return [2 /*return*/, _a.sent()];
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
        if (!ret.profilePhoto || !ret.profilePhoto.url) {
            ret.profilePhoto = {
                url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
            };
        }
        //@ts-ignore
        ret.name = doc.name;
        return ret;
    },
    virtuals: true
});
ContractorSchema.set('toObject', { virtuals: true });
exports.ContractorModel = (0, mongoose_1.model)("contractors", ContractorSchema);
