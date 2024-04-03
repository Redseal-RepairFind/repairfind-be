"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var customer_interface_1 = require("../interface/customer.interface");
var stripe_customer_schema_1 = require("../../common/stripe_customer.schema");
var CustomerSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
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
        type: String,
        default: "",
    },
    profilePhoto: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
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
        type: [Object],
    },
    stripeAccount: {
        type: Object,
        default: null,
    },
    stripeIdentity: {
        type: Object,
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
CustomerSchema.set('toObject', { virtuals: true });
var CustomerModel = (0, mongoose_1.model)("customers", CustomerSchema);
exports.default = CustomerModel;
