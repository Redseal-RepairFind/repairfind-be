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
exports.ContractorModel = exports.CONTRACTOR_TYPES = void 0;
// @ts-nocheck
var mongoose_1 = require("mongoose");
var constants_1 = require("../../../constants");
var contractorStatus_1 = require("../../../constants/contractorStatus");
var contractor_quiz_model_1 = __importDefault(require("./contractor_quiz.model"));
var stripe_customer_schema_1 = require("../../common/stripe_customer.schema");
var CONTRACTOR_TYPES;
(function (CONTRACTOR_TYPES) {
    CONTRACTOR_TYPES["INDIVIDUAL"] = "Individual";
    CONTRACTOR_TYPES["EMPLOYEE"] = "Employee";
    CONTRACTOR_TYPES["COMPANY"] = "Company";
})(CONTRACTOR_TYPES || (exports.CONTRACTOR_TYPES = CONTRACTOR_TYPES = {}));
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
        enum: Object.values(constants_1.contractorAccountTypes),
    },
    profilePhoto: {
        type: Object,
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
    stripePaymentMethods: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
});
// Rest of your schema
ContractorSchema.virtual('hasStripeIdentity').get(function () {
    return !!this.stripeIdentity; // Returns true if stripeIdentity exists, false otherwise
});
ContractorSchema.virtual('hasStripeCustomer').get(function () {
    return !!this.stripeCustomer; // Returns true if stripeCustomer exists, false otherwise
});
ContractorSchema.virtual('hasStripePaymentMethods').get(function () {
    return Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0; // Returns true if stripePaymentMethods is an array with at least one element
});
ContractorSchema.virtual('stripeIdentityStatus').get(function () {
    return this.stripeIdentity ? this.stripeIdentity.status : 'unverified';
});
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
    if (this.accountType === CONTRACTOR_TYPES.INDIVIDUAL || this.accountType === CONTRACTOR_TYPES.EMPLOYEE) {
        return "".concat(this.firstName, " ").concat(this.lastName);
    }
    else if (this.accountType === CONTRACTOR_TYPES.COMPANY) {
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
        if (!options.includeStripeIdentity) {
            delete ret.stripeIdentity;
        }
        if (!options.includeStripePaymentMethods) {
            delete ret.stripePaymentMethods;
        }
        if (!options.includeStripeCustomer) {
            delete ret.stripeCustomer;
        }
        ret.name = doc.name;
        return ret;
    },
    virtuals: true
});
ContractorSchema.set('toObject', { virtuals: true });
exports.ContractorModel = (0, mongoose_1.model)("contractors", ContractorSchema);
