"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var customer_auth_controller_1 = require("../controllers/customer_auth.controller");
var customerRoleChecker_middleware_1 = require("../middleware/customerRoleChecker.middleware");
var requests_1 = require("../requests");
var customer_controller_1 = require("../controllers/customer.controller");
var customer_stripe_controller_1 = require("../controllers/customer_stripe.controller");
var express = require("express");
var router = express.Router();
// Auth
router.post("/signup", requests_1.CustomerHttpRequest.signupParams, customer_auth_controller_1.CustomerAuthController.signUp); // customer signup
router.post("/login", requests_1.CustomerHttpRequest.loginParams, customer_auth_controller_1.CustomerAuthController.signIn); // customer signup
router.post("/email-verification", requests_1.CustomerHttpRequest.emailVerificationParams, customer_auth_controller_1.CustomerAuthController.verifyEmail); // customer verified email
router.post("/resend-email-verification", requests_1.CustomerHttpRequest.forgotPasswordParams, customer_auth_controller_1.CustomerAuthController.resendEmail); // customer resend email
router.post("/forgot-password", requests_1.CustomerHttpRequest.forgotPasswordParams, customer_auth_controller_1.CustomerAuthController.forgotPassword); // customer forgot passwor
router.post("/reset-password", requests_1.CustomerHttpRequest.resetPasswordParams, customer_auth_controller_1.CustomerAuthController.resetPassword); // customer reset password
router.post("/reset-password-verification", requests_1.CustomerHttpRequest.verifyPasswordOtpParams, customer_auth_controller_1.CustomerAuthController.verifyResetPasswordOtp); // verify password reset opt
router.post("/google-signon", requests_1.CustomerHttpRequest.verifySocialSignon, customer_auth_controller_1.CustomerAuthController.googleSignon); // verify password reset opt
router.post("/facebook-signon", requests_1.CustomerHttpRequest.verifySocialSignon, customer_auth_controller_1.CustomerAuthController.facebookSignon); // verify password reset opt
//  Account
router.patch("/me", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.updateAccount); // customer update account
router.get("/me", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.getAccount); // 
router.post("/me/change-password", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.changePasswordParams, customer_controller_1.CustomerController.changePassword);
router.post("/me/devices", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.UpdateOrDeviceParams, customer_controller_1.CustomerController.updateOrCreateDevice);
router.get("/me/devices", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.myDevices);
router.post("/stripe-account", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.createAccount);
router.post("/stripe-session", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createStripeSessionParams, customer_stripe_controller_1.CustomerStripeController.createSession);
router.post("/stripe-setupintent", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.createSetupIntent);
exports.default = router;
