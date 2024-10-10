"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var customer_interface_1 = require("../interface/customer.interface");
var stripe_customer_schema_1 = require("../../common/stripe_customer.schema");
var stripe_paymentmethod_schema_1 = require("../../common/stripe_paymentmethod.schema");
var mongoose_delete_1 = __importDefault(require("mongoose-delete"));
var contractorStatus_1 = require("../../../constants/contractorStatus");
var paypal_paymentmethod_schema_1 = require("../../common/paypal_paymentmethod.schema");
var CustomerLocationSchema = new mongoose_1.Schema({
    address: String,
    city: String,
    region: String,
    country: String,
    latitude: String,
    longitude: String,
});
var CustomerSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: false,
        verifiedAt: { type: Date, default: null },
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        code: {
            type: String
        },
        number: {
            type: String
        },
    },
    location: {
        type: CustomerLocationSchema,
    },
    profilePhoto: {
        type: Object,
        default: { url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png' }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
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
    status: {
        type: String,
        enum: Object.values(contractorStatus_1.customerStatus),
        default: contractorStatus_1.customerStatus.REVIEWING,
    },
    acceptTerms: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    provider: {
        type: String,
        enum: Object.values(customer_interface_1.CustomerAuthProviders),
        default: customer_interface_1.CustomerAuthProviders.PASSWORD
    },
    stripeCustomer: {
        type: stripe_customer_schema_1.StripeCustomerSchema,
    },
    stripePaymentMethods: {
        type: [stripe_paymentmethod_schema_1.StripePaymentMethodSchema],
    },
    paypalPaymentMethods: {
        type: [paypal_paymentmethod_schema_1.PaypalPaymentMethodSchema],
    },
    stripeAccount: {
        type: Object,
        default: null,
    },
    stripeIdentity: {
        type: Object,
    },
    currentTimezone: {
        type: String,
    },
    language: {
        type: String,
        default: 'en'
    },
    referralCode: {
        type: String,
        unique: true,
    },
    referral: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'referrals',
    },
}, {
    timestamps: true,
});
// Virtual fields
CustomerSchema.virtual('hasStripeIdentity').get(function () {
    return !!this.stripeIdentity; // Returns true if stripeIdentity exists, false otherwise
});
CustomerSchema.virtual('hasStripeCustomer').get(function () {
    return !!this.stripeCustomer; // Returns true if stripeCustomer exists, false otherwise
});
CustomerSchema.virtual('hasStripePaymentMethods').get(function () {
    return Array.isArray(this.stripePaymentMethods) && this.stripePaymentMethods.length > 0; // Returns true if stripePaymentMethods is an array with at least one element
});
CustomerSchema.virtual('name').get(function () {
    return "".concat(this.firstName, " ").concat(this.lastName);
});
CustomerSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.emailOtp;
        delete ret.passwordOtp;
        delete ret.phoneNumberOtp;
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
CustomerSchema.set('toObject', { virtuals: true });
CustomerSchema.plugin(mongoose_delete_1.default, { deletedBy: true, overrideMethods: 'all' });
var CustomerModel = (0, mongoose_1.model)("customers", CustomerSchema);
exports.default = CustomerModel;
