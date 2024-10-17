"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var admin_interface_1 = require("../interface/admin.interface");
var AdminSchema = new mongoose_1.Schema({
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
    hasWeakPassword: {
        type: Boolean,
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
        type: String,
    },
    superAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    validation: {
        type: Boolean,
        required: true,
        default: false,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
        }
    },
    permissions: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'PermissionModel'
        }],
    status: {
        type: String,
        enum: Object.values(admin_interface_1.AdminStatus),
        required: true,
        default: admin_interface_1.AdminStatus.PENDING,
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
}, {
    timestamps: true,
});
AdminSchema.virtual('name').get(function () {
    return "".concat(this.firstName, " ").concat(this.lastName);
});
var AdminModel = (0, mongoose_1.model)("admins", AdminSchema);
exports.default = AdminModel;
