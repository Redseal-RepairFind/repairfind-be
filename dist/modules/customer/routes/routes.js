"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var customer_auth_controller_1 = require("../controllers/customer_auth.controller");
var customerRoleChecker_middleware_1 = require("../middleware/customerRoleChecker.middleware");
var requests_1 = require("../requests");
var customer_controller_1 = require("../controllers/customer.controller");
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
router.post("/me/change-password", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.changePasswordParams, customer_controller_1.CustomerController.changePassword); // customer update is profile
// router.get("/get_popular_contractor", checkCustomerRole, customerGetPopularContractorController ); // customer get popular contractor
// router.get("/search_contractor", checkCustomerRole, customerSearchForContractorController ); // customer search contractor
// router.get("/get_all_contractor_on_skill", validateContractorSearckParams, checkCustomerRole, customerGetAllContractorOnSkillController ); // customer get all contractor on a skill
// router.get("/customer_get_single_contractor", validateCustomerGetContractorParams, checkCustomerRole, customerGetSingleContractorOnSkillController ); // customer get single contractor on a skill
// router.post("/customer_send_job",checkCustomerRole, memoryUpload.any(), customerSendJobToContractorController ); // customer send job request
// router.get("/customer_get_job_request",checkCustomerRole, customerJobRequestSentToContractorController ); // customer get job that he send request
// router.get("/customer_get_job_qoutation", checkCustomerRole, customerGetJobQoutationController ); // customer get job that qoutation was sent
// router.post("/customer_accept_and_pay", checkCustomerRole, validateAcceptAndPayParams, customerAcceptAndPayForJobController ); // customer accept and pay
// router.get("/customer_get_job_qoutation_payment_open", checkCustomerRole, customerGetJobQoutationPaymentOpenController ); // customer get job that qoutation payment is open
// router.post("/customer_comfirm_payment", checkCustomerRole, validateComfirmPaymentParams, customerVerififyPaymentForJobController ); // customer comfirm payment
// router.get("/customer_get_job_qoutation_payment_comfirm_and_job_in_progress", checkCustomerRole, customerGetJobQoutationPaymentConfirmAndJobInProgressController ); // customer get job that qoutation payment is comfirm and job in progress
// router.get("/customer_get_job_rejected", checkCustomerRole, customerGetJobRejectedontroller ); // customer get job requested rejected
// router.get("/customer_get_job_complete_by_contractor", checkCustomerRole, customerGetComletedByContractorController ); // get jon comleted by contractoe
// router.post("/customer_comfirm_job", checkCustomerRole, validateAcceptAndPayParams, customerComfirmedJobJobController ); // customer comfirm job completed by contractor
// router.get("/customer_get_job_comfirm", checkCustomerRole, customerGetComfirmJobController ); // customer get job comfirm
// router.post("/customer_complain_job", checkCustomerRole, validateAcceptAndPayParams, customerComplaintedJobJobController ); // customer complain about job completed by contractor
// router.get("/customer_get_job_complain", checkCustomerRole, customerGetComplainJobController ); // customer get job complain
// router.get("/customer_get_jobs_history",checkCustomerRole, customerGetAllSetJobController ); // customer get all  job history
// router.post("/customer_pay_inspection_fees_checkout", checkCustomerRole, memoryUpload.any(),  customerInpectionMonneyCheckoutContractorController ); // customer pay for inspection
// router.post("/customer_comfirm_inspection_inspection_fees", checkCustomerRole, validateComfirmInspectionPaymentParams, customerComfirmInpectionMonneyCheckoutContractorController ); // customer comfirm inspection money
// router.get("/customer_get_inspection_payment_open", checkCustomerRole, customerGetJobInspectionPaymentOpenController ); // customer get inspection payment open
// router.post("/webhook", webhook ); // web hook
// router.get("/get_all_notification", checkCustomerRole,  customerGetNotificationrController ); // customer get all notification
// router.post("/view_unseen_notification", checkCustomerRole,  customerViewNotificationrController ); // customer view unseen notification
// router.get("/get_unseen_notification", checkCustomerRole,  customerUnseenNotificationrController  ); // customer get total number of unseen notification
// router.post("/rate_contarctor", checkCustomerRole, validateCustomerRateContractorParams,  customerRateContractorController  ); // customer rate contractor
// router.get("/customer_rating_detail", checkCustomerRole,  customerRatingDetailController  ); // customer rating detail
exports.default = router;
