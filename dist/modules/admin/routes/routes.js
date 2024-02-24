"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var upload_utility_1 = require("../../../utils/upload.utility");
var adminAddSkill_controller_1 = require("../controllers/adminAddSkill.controller");
var adminContractorDocVal_controller_1 = require("../controllers/adminContractorDocVal.controller");
var adminForgotPassword_1 = require("../controllers/adminForgotPassword");
var adminGetContractorDetail_controller_1 = require("../controllers/adminGetContractorDetail.controller");
var adminGetCustomerDetail_contractor_1 = require("../controllers/adminGetCustomerDetail.contractor");
var adminNotification_controller_1 = require("../controllers/adminNotification.controller");
var adminReg_controller_1 = require("../controllers/adminReg.controller");
var appDetails_Controller_1 = require("../controllers/appDetails.Controller");
var averageRevenue_controller_1 = require("../controllers/averageRevenue.controller");
var job_controller_1 = require("../controllers/job.controller");
var payout_controller_1 = require("../controllers/payout.controller");
var question_controller_1 = require("../controllers/question.controller");
var transaction_controller_1 = require("../controllers/transaction.controller");
var adminRoleChecker_middleware_1 = require("../middlewares/adminRoleChecker.middleware");
var adminValidate_middleware_1 = require("../middlewares/adminValidate.middleware");
var express = require("express");
var router = express.Router();
router.post("/admin_signup", adminValidate_middleware_1.validateSignupParams, adminReg_controller_1.adminSignUpController); // admin signup
router.post("/admin_email_verification", adminValidate_middleware_1.validatAdminEmailverificationParams, adminReg_controller_1.adminVerifiedEmailController); // admin email verification
router.post("/admin_resend_email", adminValidate_middleware_1.validateAdminForgotPasswordParams, adminReg_controller_1.adminResendEmailController); // admin resend email
router.post("/admin_signin", adminValidate_middleware_1.validateAdminLoginParams, adminReg_controller_1.AdminSignInController); // admin login
router.post("/admin_forgot_password", adminValidate_middleware_1.validateAdminForgotPasswordParams, adminForgotPassword_1.AdminEmailForgotPasswordController); // admin forgot password
router.post("/admin_reset_password", adminValidate_middleware_1.validateAdminResetPasswprdParams, adminForgotPassword_1.AdminEmailResetPasswordController); // admin reset password
router.get("/super_admin_get_list_of_admin", adminRoleChecker_middleware_1.checkAdminRole, adminReg_controller_1.SuperAdminGetAllAdminController); // super get the list of admin
router.post("/super_admin_validate_other_admin", adminValidate_middleware_1.validateSuperAdminValidationParams, adminRoleChecker_middleware_1.checkAdminRole, adminReg_controller_1.SuperAdminValidateOtherAdminController); // super admin validate other admin
router.get("/admin_get_contractor_detail", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminGetContractorDetailController); // admin get contractor detail
router.get("/admin_get_single_contractor_detail", adminValidate_middleware_1.validateContractorIdValidationParams, adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminGetSingleContractorDetailController); // admin get single contractor detail
router.post("/admin_change_contractor_status", adminValidate_middleware_1.validateContractorChangeStatusValidationParams, adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminChangeContractorContractorDetailController); // admin change contractor status
router.get("/admin_get_customer_detail", adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminGetCustomerDetailController); // admin get customer detail
router.get("/admin_get_single_customer_detail", adminValidate_middleware_1.validateCustomerIdValidationParams, adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminGetSingleCustomerDetailController); // admin get single customer detail
router.get("/admin_get_contractor_document", adminRoleChecker_middleware_1.checkAdminRole, adminContractorDocVal_controller_1.AdminGetContractorDocForValController); // admin get contractor pending document for validation
router.get("/admin_get_single_contractor_document", adminValidate_middleware_1.validateContractoDocumentIdValidationParams, adminRoleChecker_middleware_1.checkAdminRole, adminContractorDocVal_controller_1.AdminGetSingleContractorDocForValController); // admin get single contractor pending document for validation
router.post("/admin_validate_contractor_document", adminValidate_middleware_1.validateContractoDocumentIdValidationParams, adminRoleChecker_middleware_1.checkAdminRole, adminContractorDocVal_controller_1.AdminValidateContractorDocsController); // admin get validate contractor document 
router.post("/admin_add_skill", adminValidate_middleware_1.validateAddSkillParams, adminRoleChecker_middleware_1.checkAdminRole, adminAddSkill_controller_1.AdminAddNewSkillController); // admin add skilll
router.get("/admin_get_skill", adminRoleChecker_middleware_1.checkAdminRole, adminAddSkill_controller_1.AdminGetSkillController); // admin get all skill
router.get("/admin_get_jobs_detail", adminRoleChecker_middleware_1.checkAdminRole, job_controller_1.AdminGetJobsrDetailController); // admin get job detail
router.get("/admin_get_single_job_detail", adminValidate_middleware_1.validateJobIdValidationParams, adminRoleChecker_middleware_1.checkAdminRole, job_controller_1.AdminGetSingleJobsrDetailController); // admin get single job detail
router.get("/admin_get_total_job", adminRoleChecker_middleware_1.checkAdminRole, job_controller_1.AdminGetTotalJobsrController); // admin get total job
router.get("/admin_get_transaction_detail", adminRoleChecker_middleware_1.checkAdminRole, transaction_controller_1.AdminGetTransactionDetailController); // admin get transaction detail
router.get("/admin_get_single_transaction_detail", adminValidate_middleware_1.validateTRansactionIdValidationParams, adminRoleChecker_middleware_1.checkAdminRole, transaction_controller_1.AdminGetSingleTransactionDetailController); // admin get single transaction detail
router.post("/admin_add_question", adminValidate_middleware_1.validateAddQuestionParams, adminRoleChecker_middleware_1.checkAdminRole, question_controller_1.AdminAddQuestionlController); // admin add question
router.post("/quiz", adminValidate_middleware_1.createQuizParams, adminRoleChecker_middleware_1.checkAdminRole, question_controller_1.AdminQuizController.CreateQuiz); // admin add question
router.get("/quiz", adminValidate_middleware_1.createQuizParams, adminRoleChecker_middleware_1.checkAdminRole, question_controller_1.AdminQuizController.getAllQuizzes); // admin add question
router.get("/admin_get_all_question", adminRoleChecker_middleware_1.checkAdminRole, question_controller_1.AdminGetAllQuestionController); // admin get all question
router.get("/admin_get_single_question", adminValidate_middleware_1.validateQuestionIdValidationParams, adminRoleChecker_middleware_1.checkAdminRole, question_controller_1.AdminGetSingleQuestionController); // admin get single question
router.post("/admin_edit_question", adminValidate_middleware_1.validateEditQuestionParams, adminRoleChecker_middleware_1.checkAdminRole, question_controller_1.AdminEditQuestionlController); // admin edit question
router.post("/admin_delete_question", adminValidate_middleware_1.validateDeleteQuestionValidationParams, adminRoleChecker_middleware_1.checkAdminRole, question_controller_1.AdminDeleteQuestionlController); // admin delete question
router.get("/app_detail", adminRoleChecker_middleware_1.checkAdminRole, appDetails_Controller_1.AdminGetAppDetailController); // admin get app detail
router.post("/update_profile", adminRoleChecker_middleware_1.checkAdminRole, upload_utility_1.memoryUpload.single('profileImg'), adminReg_controller_1.adminUpdateBioController); // admin update profile
router.get("/get_all_notification", adminRoleChecker_middleware_1.checkAdminRole, adminNotification_controller_1.adminGetNotificationrController); // admin get all notification
router.post("/view_unseen_notification", adminRoleChecker_middleware_1.checkAdminRole, adminNotification_controller_1.adminViewNotificationrController); // admin view unseen notification
router.get("/get_unseen_notification", adminRoleChecker_middleware_1.checkAdminRole, adminNotification_controller_1.adminUnseenNotificationrController); // admin get total number of unseen notification
router.get("/get_revenue_par_day", adminValidate_middleware_1.validateRevenueDateParams, adminRoleChecker_middleware_1.checkAdminRole, averageRevenue_controller_1.AdminGetRevenueAnalysisControlleer); // admin get total number of unseen notification
router.get("/get_all_pending_payout", adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminGetPendingPayoutDetailController); // admin get all pending payout
router.get("/get_all_completed_payout", adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminGetCompletedPayoutDetailController); // admin get all completed payout
router.get("/get_single_payout", adminValidate_middleware_1.validatePayoutIDParams, adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminGetSinglePayoutDetailController); // admin get single payout
router.post("/pay_contractor", adminValidate_middleware_1.validatePayoutIDPayContractorParams, adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminPayContractorController); // admin paycontractor
//no work just testing email
router.post("/send_email", averageRevenue_controller_1.AdminsendEmailsControlleer); // admin get total number of unseen notification
exports.default = router;
