"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractorHttpRequest = void 0;
var contractor_signup_request_1 = require("./contractor_signup.request");
var create_profile_request_1 = require("./create_profile.request");
var request_1 = require("./request");
exports.ContractorHttpRequest = {
    CreateProfileRequest: create_profile_request_1.CreateProfileRequest,
    CreateContractorRequest: contractor_signup_request_1.CreateContractorRequest,
    EmailVerificationRequest: request_1.EmailVerificationRequest,
    LoginRequest: request_1.LoginRequest,
    ResendEmailRequest: request_1.ResendEmailRequest,
    PasswordResetRequest: request_1.PasswordResetRequest
};
