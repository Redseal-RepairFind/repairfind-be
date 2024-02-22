"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var upload_utility_1 = require("../../../utils/upload.utility");
var customerForgotPassword_controller_1 = require("../controllers/customerForgotPassword.controller");
var customerJob_controller_1 = require("../controllers/customerJob.controller");
var customerNotification_controller_1 = require("../controllers/customerNotification.controller");
var customerPayment_controller_1 = require("../controllers/customerPayment.controller");
var customerReg_controller_1 = require("../controllers/customerReg.controller");
var lookForContractor_controller_1 = require("../controllers/lookForContractor.controller");
var ratingContractor_controller_1 = require("../controllers/ratingContractor.controller");
var customerRoleChecker_middleware_1 = require("../middleware/customerRoleChecker.middleware");
var requestValidate_middleware_1 = require("../middleware/requestValidate.middleware");
var express = require("express");
var router = express.Router();
router.post("/signup", requestValidate_middleware_1.validateSignupParams, customerReg_controller_1.customerSignUpController); // customer signup
router.post("/email-verification", requestValidate_middleware_1.validatecustomerEmailverificationParams, customerReg_controller_1.customerVerifiedEmailController); // customer verified email
router.post("/resend-email-verification", requestValidate_middleware_1.validatecustomerForgotPasswordParams, customerReg_controller_1.CustomerResendEmailController); // customer resend email
router.post("/login", requestValidate_middleware_1.validatecustomeLoginParams, customerReg_controller_1.customerSignInController); // customer login
router.post("/forgot-password", requestValidate_middleware_1.validatecustomerForgotPasswordParams, customerForgotPassword_controller_1.customerEmailForgotPasswordController); // customer forgot passwor
router.post("/reset-password", requestValidate_middleware_1.validatecustomerResetPasswprdParams, customerForgotPassword_controller_1.customerEmailResetPasswordController); // customer reset password
router.post("/update-profile", customerRoleChecker_middleware_1.checkCustomerRole, upload_utility_1.memoryUpload.single('profileImg'), customerReg_controller_1.CustomerUpdateProfileController); // customer update is profile
router.get("/get_popular_contractor", customerRoleChecker_middleware_1.checkCustomerRole, lookForContractor_controller_1.customerGetPopularContractorController); // customer get popular contractor
router.get("/search_contractor", customerRoleChecker_middleware_1.checkCustomerRole, lookForContractor_controller_1.customerSearchForContractorController); // customer search contractor
router.get("/get_all_contractor_on_skill", requestValidate_middleware_1.validateContractorSearckParams, customerRoleChecker_middleware_1.checkCustomerRole, lookForContractor_controller_1.customerGetAllContractorOnSkillController); // customer get all contractor on a skill
router.get("/customer_get_single_contractor", requestValidate_middleware_1.validateCustomerGetContractorParams, customerRoleChecker_middleware_1.checkCustomerRole, lookForContractor_controller_1.customerGetSingleContractorOnSkillController); // customer get single contractor on a skill
router.post("/customer_send_job", customerRoleChecker_middleware_1.checkCustomerRole, upload_utility_1.memoryUpload.any(), customerJob_controller_1.customerSendJobToContractorController); // customer send job request
router.get("/customer_get_job_request", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerJobRequestSentToContractorController); // customer get job that he send request
router.get("/customer_get_job_qoutation", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetJobQoutationController); // customer get job that qoutation was sent
router.post("/customer_accept_and_pay", customerRoleChecker_middleware_1.checkCustomerRole, requestValidate_middleware_1.validateAcceptAndPayParams, customerJob_controller_1.customerAcceptAndPayForJobController); // customer accept and pay
router.get("/customer_get_job_qoutation_payment_open", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetJobQoutationPaymentOpenController); // customer get job that qoutation payment is open
router.post("/customer_comfirm_payment", customerRoleChecker_middleware_1.checkCustomerRole, requestValidate_middleware_1.validateComfirmPaymentParams, customerJob_controller_1.customerVerififyPaymentForJobController); // customer comfirm payment
router.get("/customer_get_job_qoutation_payment_comfirm_and_job_in_progress", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetJobQoutationPaymentConfirmAndJobInProgressController); // customer get job that qoutation payment is comfirm and job in progress
router.get("/customer_get_job_rejected", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetJobRejectedontroller); // customer get job requested rejected
router.get("/customer_get_job_complete_by_contractor", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetComletedByContractorController); // get jon comleted by contractoe
router.post("/customer_comfirm_job", customerRoleChecker_middleware_1.checkCustomerRole, requestValidate_middleware_1.validateAcceptAndPayParams, customerJob_controller_1.customerComfirmedJobJobController); // customer comfirm job completed by contractor
router.get("/customer_get_job_comfirm", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetComfirmJobController); // customer get job comfirm
router.post("/customer_complain_job", customerRoleChecker_middleware_1.checkCustomerRole, requestValidate_middleware_1.validateAcceptAndPayParams, customerJob_controller_1.customerComplaintedJobJobController); // customer complain about job completed by contractor
router.get("/customer_get_job_complain", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetComplainJobController); // customer get job complain
router.get("/customer_get_jobs_history", customerRoleChecker_middleware_1.checkCustomerRole, customerJob_controller_1.customerGetAllSetJobController); // customer get all  job history
router.post("/customer_pay_inspection_fees_checkout", customerRoleChecker_middleware_1.checkCustomerRole, upload_utility_1.memoryUpload.any(), customerPayment_controller_1.customerInpectionMonneyCheckoutContractorController); // customer pay for inspection
router.post("/customer_comfirm_inspection_inspection_fees", customerRoleChecker_middleware_1.checkCustomerRole, requestValidate_middleware_1.validateComfirmInspectionPaymentParams, customerPayment_controller_1.customerComfirmInpectionMonneyCheckoutContractorController); // customer comfirm inspection money
router.get("/customer_get_inspection_payment_open", customerRoleChecker_middleware_1.checkCustomerRole, customerPayment_controller_1.customerGetJobInspectionPaymentOpenController); // customer get inspection payment open
router.post("/webhook", customerPayment_controller_1.webhook); // web hook
router.get("/get_all_notification", customerRoleChecker_middleware_1.checkCustomerRole, customerNotification_controller_1.customerGetNotificationrController); // customer get all notification
router.post("/view_unseen_notification", customerRoleChecker_middleware_1.checkCustomerRole, customerNotification_controller_1.customerViewNotificationrController); // customer view unseen notification
router.get("/get_unseen_notification", customerRoleChecker_middleware_1.checkCustomerRole, customerNotification_controller_1.customerUnseenNotificationrController); // customer get total number of unseen notification
router.post("/rate_contarctor", customerRoleChecker_middleware_1.checkCustomerRole, requestValidate_middleware_1.validateCustomerRateContractorParams, ratingContractor_controller_1.customerRateContractorController); // customer rate contractor
router.get("/customer_rating_detail", customerRoleChecker_middleware_1.checkCustomerRole, ratingContractor_controller_1.customerRatingDetailController); // customer rating detail
exports.default = router;
