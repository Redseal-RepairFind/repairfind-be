"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var upload_utility_1 = require("../../../utils/upload.utility");
var admin_job_controller_1 = require("../controllers/admin_job.controller");
var admin_skill_controller_1 = require("../controllers/admin_skill.controller");
var adminForgotPassword_1 = require("../controllers/adminForgotPassword");
var adminGetContractorDetail_controller_1 = require("../controllers/adminGetContractorDetail.controller");
var adminGetCustomerDetail_contractor_1 = require("../controllers/adminGetCustomerDetail.contractor");
var adminNotification_controller_1 = require("../controllers/adminNotification.controller");
var adminReg_controller_1 = require("../controllers/adminReg.controller");
var appDetails_Controller_1 = require("../controllers/appDetails.Controller");
var averageRevenue_controller_1 = require("../controllers/averageRevenue.controller");
var contractor_controller_1 = require("../controllers/contractor.controller");
var conversation_controller_1 = require("../controllers/conversation.controller");
var dispute_controller_1 = require("../controllers/dispute.controller");
var emergency_controller_1 = require("../controllers/emergency.controller");
// import {  AdminJobController, } from "../controllers/job.controller";
var payout_controller_1 = require("../controllers/payout.controller");
var permission_controller_1 = require("../controllers/permission.controller");
var quiz_controller_1 = require("../controllers/quiz.controller");
var transaction_controller_1 = require("../controllers/transaction.controller");
var adminRoleChecker_middleware_1 = require("../middlewares/adminRoleChecker.middleware");
var adminValidate_middleware_1 = require("../middlewares/adminValidate.middleware");
var express = require("express");
var router = express.Router();
//done authecation
router.post("/signup", adminValidate_middleware_1.validateSignupParams, adminReg_controller_1.adminSignUpController); // admin signup
router.post("/email/verification", adminValidate_middleware_1.validatAdminEmailverificationParams, adminReg_controller_1.adminVerifiedEmailController); // admin email verification
router.post("/resend/email", adminValidate_middleware_1.validateAdminForgotPasswordParams, adminReg_controller_1.adminResendEmailController); // admin resend email
router.post("/signin", adminValidate_middleware_1.validateAdminLoginParams, adminReg_controller_1.AdminSignInController); // admin login
router.post("/forgot/password", adminValidate_middleware_1.validateAdminForgotPasswordParams, adminForgotPassword_1.AdminEmailForgotPasswordController); // admin forgot password
router.post("/reset/password", adminValidate_middleware_1.validateAdminResetPasswprdParams, adminForgotPassword_1.AdminEmailResetPasswordController); // admin reset password
//don staff
router.post("/staff", adminValidate_middleware_1.Validations.AddStaffParams, adminRoleChecker_middleware_1.checkAdminRole, adminReg_controller_1.AddStaffController); // super admin add staff
router.post("/staff/status", adminValidate_middleware_1.validateSuperAdmiCchangeStatusParams, adminRoleChecker_middleware_1.checkAdminRole, adminReg_controller_1.SuperAdminChangeStaffStatusController); // super admin change staff status
router.get("/staffs", adminRoleChecker_middleware_1.checkAdminRole, adminReg_controller_1.SuperAdminGetAllAdminController); // super get the list of staff
router.post("/staff/permission", adminValidate_middleware_1.Validations.AddPermissionParams, adminRoleChecker_middleware_1.checkAdminRole, adminReg_controller_1.SuperAdminAddPermissionToStaffController); // super add permission to staff
router.post("/staff/permission/remove", adminValidate_middleware_1.Validations.AddPermissionParams, adminRoleChecker_middleware_1.checkAdminRole, adminReg_controller_1.SuperAdminRemovePermissionFromStaffController); // super remove permission from staff
// done permission
router.post("/permission", adminValidate_middleware_1.Validations.PermissionCreationParam, adminRoleChecker_middleware_1.checkAdminRole, permission_controller_1.Permission.PermissionCreationController); // super admin create permission
router.get("/permissions", adminRoleChecker_middleware_1.checkAdminRole, permission_controller_1.Permission.GetPermissionController); // super admin get all permission
router.post("/edit/permission", adminValidate_middleware_1.Validations.EditPermissionParams, adminRoleChecker_middleware_1.checkAdminRole, permission_controller_1.Permission.EditPermissionController); // super admin edit permission
//don contractor
router.get("/contractor/detail", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminGetContractorDetailController); // admin get contractor detail
router.get("/contractor/detail/:contractorId", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminGetSingleContractorDetailController); // admin get single contractor detail
router.post("/validate/contractor/gst", adminValidate_middleware_1.validateContractorChangeStatusValidationParams, adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminChangeContractorGstStatusController); // admin change contractor gst
router.get("/contractor/detail/pending/gst", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminGetContractorGstPendingController); // admin get contractor detail with gst status pending
router.get("/contractor/detail/approve/gst", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminGetContractorGstApproveController); // admin get contractor detail with gst status approve
router.get("/contractor/detail/decline/gst", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminGetContractorGstDecliningController); // admin get contractor detail with gst status Decline
router.get("/contractor/detail/review/gst", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminGetContractorGstReviewingController); // admin get contractor detail with gst status Reviewing
router.get("/contractor/job/detail/:contractorId", adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminGetSingleContractorJonDetailController); // admin get single contractor job detail
router.post("/contractor/account/status", adminValidate_middleware_1.Validations.ContractorChangeStatusParams, adminRoleChecker_middleware_1.checkAdminRole, adminGetContractorDetail_controller_1.AdminContractorDetail.AdminChangeContractorAccountStatusController); // admin change contractor account status
//done
router.get("/customer/detail", adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminGetCustomerDetailController); // admin get customer detail
router.get("/customer/detail/:customerId", adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminGetSingleCustomerDetailController); // admin get single customer detail
router.get("/customer/job/detail/:customerId", adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminGetSingleCustomerJobDetailController); // admin get single customer  job detail
router.post("/customer/account/status", adminValidate_middleware_1.Validations.CustomerChangeStatusParams, adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminChangeCustomerAccountStatusController); // admin change customer account status
//done skill
router.post("/skills", adminValidate_middleware_1.validateAddSkillParams, adminRoleChecker_middleware_1.checkAdminRole, admin_skill_controller_1.AdminSkillController.AddNew); // admin add skill
// router.post("/skill/bulk", validateAddSkillParams, checkAdminRole, AdminSkillController ); // admin add skilll
router.get("/skills", adminRoleChecker_middleware_1.checkAdminRole, admin_skill_controller_1.AdminSkillController.GetSkills); // admin get all skill
// done job
// router.get("/jobs/detail", checkAdminRole, AdminJobController.AdminGetJobsrDetailController ); 
// router.get("/jobs/detail/:jobId", checkAdminRole, AdminJobController.AdminGetSingleJobsrDetailController ); 
// router.get("/total_job", checkAdminRole, AdminJobController.AdminGetTotalJobsrController); 
// router.get("/app_detail", checkAdminRole, AdminGetAppDetailController ); 
// router.get("/invoice/detail/:jobId", checkAdminRole, AdminJobController.AdminGetInvoiceSingleJobsrDetailController ); 
// jobsairon
router.get("/jobs", adminRoleChecker_middleware_1.checkAdminRole, admin_job_controller_1.AdminJobController.getJobs);
router.get("/jobs/stats", adminRoleChecker_middleware_1.checkAdminRole, admin_job_controller_1.AdminJobController.getJobStats);
router.get("/jobs/:jobId", adminRoleChecker_middleware_1.checkAdminRole, admin_job_controller_1.AdminJobController.getSingleJob);
router.get("/app_detail", adminRoleChecker_middleware_1.checkAdminRole, appDetails_Controller_1.AdminGetAppDetailController);
// router.get("/invoice/detail/:jobId", checkAdminRole, AdminJobController.AdminGetInvoiceSingleJobsrDetailController ); 
//done transaction
router.get("/transactions", adminRoleChecker_middleware_1.checkAdminRole, transaction_controller_1.TransactionDetailController.AdminGetTransactionDetailController); // admin get transaction detail
router.get("/transaction/:transactionId", adminRoleChecker_middleware_1.checkAdminRole, transaction_controller_1.TransactionDetailController.AdminGetSingleTransactionDetailController); // admin get single transaction detail
//done emergency
router.get("/emergecy/active", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.ermergency.AdminGetActiveEmergencyJobController); // admin get active emergency
router.get("/emergecy/new", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.ermergency.AdminGeNewEmergencyJobController); // admin get new emergency
router.get("/emergecy/resolve", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.ermergency.AdminGetResolveEmergencyJobController); // admin get resolve emergency
router.get("/emergecy/:emergencyId", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.ermergency.AdminGetSingleEmergencyJobController); // admin get single emergency
router.post("/emergecy/accept", adminValidate_middleware_1.validateEmergecyIdParams, adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.ermergency.AdminAcceptEmergencyJobController); // admin accept emergecy
router.post("/emergecy/resolved", adminValidate_middleware_1.validateResolvedEmergecyIdParams, adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.ermergency.AdminResolvedEmergencyJobController); // admin resolved emergecy
//done dispute
router.get("/dispute", adminValidate_middleware_1.Validations.DisputeStatusParams, adminRoleChecker_middleware_1.checkAdminRole, dispute_controller_1.dispute.AdminJobDisputeByStatusController); // admin get dispute by status
router.get("/dispute/:disputeId", adminRoleChecker_middleware_1.checkAdminRole, dispute_controller_1.dispute.AdminGetSingleJobDisputeController); // admin get single dispute
router.post("/dispute/accept", adminValidate_middleware_1.Validations.AcceptDisputeParams, adminRoleChecker_middleware_1.checkAdminRole, dispute_controller_1.dispute.AdminAcceptJobDisputeController); // admin accept dispute
router.get("/dispute/admin", adminValidate_middleware_1.Validations.DisputeStatusParams, adminRoleChecker_middleware_1.checkAdminRole, dispute_controller_1.dispute.AdminGetJobDisputForAdminController); // admin get dispute for himself
router.post("/dispute/settle", adminValidate_middleware_1.Validations.SettleDisputeParams, adminRoleChecker_middleware_1.checkAdminRole, dispute_controller_1.dispute.AdminSettleJobDisputeController); // admin settle dispute
//done conversation
router.post("/conversation", adminValidate_middleware_1.Validations.StartCoversaionParams, adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversation.startConversation); // admin start conversation
router.get("/conversation", adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversation.getConversations); // admin get conversation 
router.get("/conversation/:conversationId", adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversation.getSingleConversation); // admin get single conversation 
router.get("/conversation/meaasge/:conversationId", adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversation.getConversationMessages); // admin get  conversation message
router.post("/conversation/meaasge/:conversationId", adminValidate_middleware_1.Validations.sendMessageParams, adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversation.sendMessage); // admin send message
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
// //////// //// ///// //// //// //// //// //// //// ///// //
// QUIZ
router.post("/quizzes", adminValidate_middleware_1.createQuizParams, adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.CreateQuiz); // admin create quiz
router.get("/quizzes", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.getAllQuizzes); // admin get quizes
router.get("/random-quiz", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.getRandomQuiz); // admin add question
// router.post("/admin_add_question", validateAddQuestionParams, checkAdminRole, AdminQuizController.AddQuestion ); // admin add question
router.get("/question", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.GetAllQuestions); // admin get all question
router.get("/question/:questionId", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.GetSingleQuestion); // admin get single question
router.post("/question/edit", adminValidate_middleware_1.validateEditQuestionParams, adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.EditQuestion); // admin edit question
router.post("/question/delete", adminValidate_middleware_1.validateDeleteQuestionValidationParams, adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.DeleteQuestion); // admin delete question
// CONTRACTOR
router.post("/contractors/:contractorId/attach-stripe-account", contractor_controller_1.AdminContractorController.attachStripeAccount); //
router.post("/contractors/:contractorId/remove-stripe-account", contractor_controller_1.AdminContractorController.removeStripeAccount); //
exports.default = router;
