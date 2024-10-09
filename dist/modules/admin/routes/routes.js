"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin_job_controller_1 = require("../controllers/admin_job.controller");
var admin_skill_controller_1 = require("../controllers/admin_skill.controller");
var admin_contractors_controller_1 = require("../controllers/admin_contractors.controller");
var adminGetCustomerDetail_contractor_1 = require("../controllers/adminGetCustomerDetail.contractor");
var admin_notification_controller_1 = require("../controllers/admin_notification.controller");
var appDetails_Controller_1 = require("../controllers/appDetails.Controller");
var averageRevenue_controller_1 = require("../controllers/averageRevenue.controller");
var conversation_controller_1 = require("../controllers/conversation.controller");
var admin_disputes_controller_1 = require("../controllers/admin_disputes.controller");
var emergency_controller_1 = require("../controllers/emergency.controller");
var payout_controller_1 = require("../controllers/payout.controller");
var permission_controller_1 = require("../controllers/permission.controller");
var quiz_controller_1 = require("../controllers/quiz.controller");
var transaction_controller_1 = require("../controllers/transaction.controller");
var adminRoleChecker_middleware_1 = require("../middlewares/adminRoleChecker.middleware");
var admin_validations_middleware_1 = require("../middlewares/admin_validations.middleware");
var admin_auth_controller_1 = require("../controllers/admin_auth.controller");
var admin_staff_controller_1 = require("../controllers/admin_staff.controller");
var admin_analytics_controller_1 = require("../controllers/admin_analytics.controller");
var app_version_controller_1 = require("../controllers/app_version.controller");
var admin_report_controller_1 = require("../controllers/admin_report.controller");
var promotion_controller_1 = require("../controllers/promotion.controller");
var express = require("express");
var router = express.Router();
//refactored authecation
router.post("/signup", admin_validations_middleware_1.validateSignupParams, admin_auth_controller_1.AdminAuthController.signUp);
router.post("/email/verification", admin_validations_middleware_1.validatAdminEmailverificationParams, admin_auth_controller_1.AdminAuthController.verifyEmail);
router.post("/resend/email", admin_validations_middleware_1.validateAdminForgotPasswordParams, admin_auth_controller_1.AdminAuthController.resendEmail);
router.post("/signin", admin_validations_middleware_1.validateAdminLoginParams, admin_auth_controller_1.AdminAuthController.signIn);
router.post("/forgot/password", admin_validations_middleware_1.validateAdminForgotPasswordParams, admin_auth_controller_1.AdminAuthController.forgotPassword);
router.post("/reset/password", admin_validations_middleware_1.validateAdminResetPasswprdParams, admin_auth_controller_1.AdminAuthController.resetPassword);
router.post("/change-password", admin_validations_middleware_1.validateAdminChangePasswordParams, admin_auth_controller_1.AdminAuthController.changePassword);
router.get("/analytics", adminRoleChecker_middleware_1.checkAdminRole, admin_analytics_controller_1.AdminAnalyticsController.getStats);
//don staff
router.post("/staffs", admin_validations_middleware_1.Validations.AddStaffParams, adminRoleChecker_middleware_1.checkAdminRole, admin_staff_controller_1.AdminStaffController.addStaff);
router.post("/staffs/status", admin_validations_middleware_1.validateSuperAdmiCchangeStatusParams, adminRoleChecker_middleware_1.checkAdminRole, admin_staff_controller_1.AdminStaffController.changeStaffStatus);
router.get("/staffs", adminRoleChecker_middleware_1.checkAdminRole, admin_staff_controller_1.AdminStaffController.getAdminStaffs);
router.post("/staffs/permission", admin_validations_middleware_1.Validations.AddPermissionParams, adminRoleChecker_middleware_1.checkAdminRole, admin_staff_controller_1.AdminStaffController.addPermissionToStaff);
router.post("/staffs/permission/remove", admin_validations_middleware_1.Validations.AddPermissionParams, adminRoleChecker_middleware_1.checkAdminRole, admin_staff_controller_1.AdminStaffController.removePermissionFromStaff);
// done permission
router.post("/permissions", admin_validations_middleware_1.Validations.PermissionCreationParam, adminRoleChecker_middleware_1.checkAdminRole, permission_controller_1.AdminPermissionController.addSinglePermission); // super admin create permission
router.post("/permissions/add-bulk", adminRoleChecker_middleware_1.checkAdminRole, permission_controller_1.AdminPermissionController.addBulkPermission); // super admin create permission
router.get("/permissions", adminRoleChecker_middleware_1.checkAdminRole, permission_controller_1.AdminPermissionController.getPermissions); // super admin get all permission
router.patch("/permissions/:permissionId", admin_validations_middleware_1.Validations.EditPermissionParams, adminRoleChecker_middleware_1.checkAdminRole, permission_controller_1.AdminPermissionController.updatePermission); // super admin edit permission
// App Versions
router.post("/app-versions", admin_validations_middleware_1.Validations.validateAppVersionCreation, adminRoleChecker_middleware_1.checkAdminRole, app_version_controller_1.AppVersionController.addAppVersion);
router.get("/app-versions", adminRoleChecker_middleware_1.checkAdminRole, app_version_controller_1.AppVersionController.getAppVersions);
router.get("/app-versions/:id", adminRoleChecker_middleware_1.checkAdminRole, app_version_controller_1.AppVersionController.getAppVersionById);
router.patch("/app-versions/:id", admin_validations_middleware_1.Validations.validateAppVersionUpdate, adminRoleChecker_middleware_1.checkAdminRole, app_version_controller_1.AppVersionController.updateAppVersion);
router.delete("/app-versions/:id", adminRoleChecker_middleware_1.checkAdminRole, app_version_controller_1.AppVersionController.deleteAppVersion);
// User Reports
router.get("/abuse-reports", adminRoleChecker_middleware_1.checkAdminRole, admin_report_controller_1.AdminReportController.getAllReports);
router.get("/abuse-reports/:id", adminRoleChecker_middleware_1.checkAdminRole, admin_report_controller_1.AdminReportController.getReportById);
router.patch("/abuse-reports/:id", admin_validations_middleware_1.Validations.validateAppVersionUpdate, adminRoleChecker_middleware_1.checkAdminRole, admin_report_controller_1.AdminReportController.updateReport);
//refactored contractor
router.get("/contractors", adminRoleChecker_middleware_1.checkAdminRole, admin_contractors_controller_1.AdminContractorController.exploreContractors); // admin get contractor detail
router.get("/contractors/:contractorId", adminRoleChecker_middleware_1.checkAdminRole, admin_contractors_controller_1.AdminContractorController.getSingleContractor); // admin get single contractor detail
router.get("/contractors/:contractorId/jobs", adminRoleChecker_middleware_1.checkAdminRole, admin_contractors_controller_1.AdminContractorController.getJobHistory); // admin get single contractor detail
router.get("/contractors/:contractorId/jobs/:jobId", adminRoleChecker_middleware_1.checkAdminRole, admin_contractors_controller_1.AdminContractorController.getSingleJob); // admin get single contractor detail
router.patch("/contractors/:contractorId/gst", admin_validations_middleware_1.Validations.updateGstDetails, adminRoleChecker_middleware_1.checkAdminRole, admin_contractors_controller_1.AdminContractorController.updateGstDetails); // admin change contractor gst
router.patch("/contractors/:contractorId/status", admin_validations_middleware_1.Validations.updateAccount, adminRoleChecker_middleware_1.checkAdminRole, admin_contractors_controller_1.AdminContractorController.updateAccountStatus); // admin change contractor gst
router.post("/contractors/:contractorId/sendmail", admin_validations_middleware_1.Validations.sendCustomEmail, adminRoleChecker_middleware_1.checkAdminRole, admin_contractors_controller_1.AdminContractorController.sendCustomEmail); // admin change contractor gst
//done
router.get("/customer/detail", adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminGetCustomerDetailController); // admin get customer detail
router.get("/customer/detail/:customerId", adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminGetSingleCustomerDetailController); // admin get single customer detail
router.get("/customer/job/detail/:customerId", adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminGetSingleCustomerJobDetailController); // admin get single customer  job detail
router.post("/customer/account/status", admin_validations_middleware_1.Validations.CustomerChangeStatusParams, adminRoleChecker_middleware_1.checkAdminRole, adminGetCustomerDetail_contractor_1.AdminCustomerController.AdminChangeCustomerAccountStatusController); // admin change customer account status
//done skill
router.post("/skills", admin_validations_middleware_1.validateAddSkillParams, adminRoleChecker_middleware_1.checkAdminRole, admin_skill_controller_1.AdminSkillController.AddNew); // admin add skill
router.post("/skills/bulk", adminRoleChecker_middleware_1.checkAdminRole, admin_skill_controller_1.AdminSkillController.AddMultipleSkills); // admin add skilll
router.get("/skills", adminRoleChecker_middleware_1.checkAdminRole, admin_skill_controller_1.AdminSkillController.GetSkills); // admin get all skill
// refactored aaron
router.get("/jobs", adminRoleChecker_middleware_1.checkAdminRole, admin_job_controller_1.AdminJobController.getJobs);
router.get("/jobs/stats", adminRoleChecker_middleware_1.checkAdminRole, admin_job_controller_1.AdminJobController.getJobStats);
router.get("/jobs/:jobId", adminRoleChecker_middleware_1.checkAdminRole, admin_job_controller_1.AdminJobController.getSingleJob);
router.get("/app_detail", adminRoleChecker_middleware_1.checkAdminRole, appDetails_Controller_1.AdminGetAppDetailController);
// router.get("/invoice/detail/:jobId", checkAdminRole, AdminJobController.AdminGetInvoiceSingleJobsrDetailController ); 
//done transaction
router.get("/transactions", adminRoleChecker_middleware_1.checkAdminRole, transaction_controller_1.TransactionDetailController.AdminGetTransactionDetailController);
router.get("/transaction/:transactionId", adminRoleChecker_middleware_1.checkAdminRole, transaction_controller_1.TransactionDetailController.AdminGetSingleTransactionDetailController);
//refactored emergency
router.get("/emergencies", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.AdminEmergencyController.getEmergencies);
router.post("/emergencies/:emergencyId/accept", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.AdminEmergencyController.acceptEmergency);
router.post("/emergencies/:emergencyId/resolve", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.AdminEmergencyController.resolveEmergency);
router.get("/emergencies/:emergencyId", adminRoleChecker_middleware_1.checkAdminRole, emergency_controller_1.AdminEmergencyController.getSingleEmergency);
//refactored disputes
router.get("/disputes", adminRoleChecker_middleware_1.checkAdminRole, admin_disputes_controller_1.AdminDisputeController.getJobDisputes);
router.get("/disputes/:disputeId", adminRoleChecker_middleware_1.checkAdminRole, admin_disputes_controller_1.AdminDisputeController.getSingleDispute);
router.post("/disputes/:disputeId/accept", adminRoleChecker_middleware_1.checkAdminRole, admin_disputes_controller_1.AdminDisputeController.acceptDispute);
router.post("/disputes/:disputeId/settle", admin_validations_middleware_1.Validations.SettleDisputeParams, adminRoleChecker_middleware_1.checkAdminRole, admin_disputes_controller_1.AdminDisputeController.settleDispute);
router.post("/disputes/:disputeId/refund-customer", adminRoleChecker_middleware_1.checkAdminRole, admin_disputes_controller_1.AdminDisputeController.createDisputeRefund);
router.post("/disputes/:disputeId/refund-contractor", adminRoleChecker_middleware_1.checkAdminRole, admin_disputes_controller_1.AdminDisputeController.markJobAsComplete);
router.post("/disputes/:disputeId/enable-revisit", adminRoleChecker_middleware_1.checkAdminRole, admin_disputes_controller_1.AdminDisputeController.enableRevisit);
//refactored conversation
router.post("/conversations", admin_validations_middleware_1.Validations.StartCoversaionParams, adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversationController.startConversation); // admin start conversation
router.get("/conversations", adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversationController.getConversations); // admin get conversation 
router.get("/conversations/:conversationId", adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversationController.getSingleConversation); // admin get single conversation 
router.get("/conversations/:conversationId/messages", adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversationController.getConversationMessages); // admin get  conversation message
router.post("/conversations/:conversationId/messages", admin_validations_middleware_1.Validations.sendMessageParams, adminRoleChecker_middleware_1.checkAdminRole, conversation_controller_1.AdminConversationController.sendMessage); // admin send message
// Notifications
router.get('/notifications', adminRoleChecker_middleware_1.checkAdminRole, admin_notification_controller_1.AdminNotificationController.getNotifications);
router.get('/notifications/alerts', adminRoleChecker_middleware_1.checkAdminRole, admin_notification_controller_1.AdminNotificationController.redAlerts);
router.get('/notifications/:notificationId', adminRoleChecker_middleware_1.checkAdminRole, admin_notification_controller_1.AdminNotificationController.getSingleNotification);
router.post('/notifications/mark-all-read', adminRoleChecker_middleware_1.checkAdminRole, admin_notification_controller_1.AdminNotificationController.markAllNotificationsAsRead);
router.post('/notifications/:notificationId', adminRoleChecker_middleware_1.checkAdminRole, admin_notification_controller_1.AdminNotificationController.getSingleNotification);
router.get("/get_revenue_par_day", admin_validations_middleware_1.validateRevenueDateParams, adminRoleChecker_middleware_1.checkAdminRole, averageRevenue_controller_1.AdminGetRevenueAnalysisControlleer); // admin get total number of unseen notification
router.get("/get_all_pending_payout", adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminGetPendingPayoutDetailController); // admin get all pending payout
router.get("/get_all_completed_payout", adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminGetCompletedPayoutDetailController); // admin get all completed payout
router.get("/get_single_payout", admin_validations_middleware_1.validatePayoutIDParams, adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminGetSinglePayoutDetailController); // admin get single payout
router.post("/pay_contractor", admin_validations_middleware_1.validatePayoutIDPayContractorParams, adminRoleChecker_middleware_1.checkAdminRole, payout_controller_1.AdminPayContractorController); // admin paycontractor
// QUIZ
router.post("/quizzes", admin_validations_middleware_1.createQuizParams, adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.CreateQuiz); // admin create quiz
router.get("/quizzes", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.getAllQuizzes); // admin get quizes
router.post("/quizzes/:quizId/add-question", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.addSingleQuestion); // admin get all question
router.get("/quizzes/:quizId", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.getSingleQuiz); // admin get all question
router.get("/random-quiz", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.getRandomQuiz); // admin add question
router.get("/questions", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.GetAllQuestions); // admin get all question
router.get("/questions/:questionId", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.GetSingleQuestion); // admin get single question
router.patch("/questions/:questionId", admin_validations_middleware_1.validateEditQuestionParams, adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.EditQuestion); // admin edit question
router.delete("/questions/:questionId", adminRoleChecker_middleware_1.checkAdminRole, quiz_controller_1.AdminQuizController.DeleteQuestion); // admin delete question
// CONTRACTOR
router.post("/contractors/:contractorId/attach-stripe-account", admin_contractors_controller_1.AdminContractorController.attachStripeAccount); //
router.post("/contractors/:contractorId/remove-stripe-account", admin_contractors_controller_1.AdminContractorController.removeStripeAccount); //
router.post("/contractors/:contractorId/attach-certn-details", admin_contractors_controller_1.AdminContractorController.attachCertnDetails); //
// App Versions
router.post("/promotions", admin_validations_middleware_1.Validations.validatePromotionCreation, adminRoleChecker_middleware_1.checkAdminRole, promotion_controller_1.PromotionController.addPromotion);
router.get("/promotions", adminRoleChecker_middleware_1.checkAdminRole, promotion_controller_1.PromotionController.getPromotions);
router.get("/promotions/:id", adminRoleChecker_middleware_1.checkAdminRole, promotion_controller_1.PromotionController.getSinglePromotion);
router.patch("/promotions/:id", admin_validations_middleware_1.Validations.validatePromotionUpdate, adminRoleChecker_middleware_1.checkAdminRole, promotion_controller_1.PromotionController.updatePromotion);
router.delete("/promotions/:id", adminRoleChecker_middleware_1.checkAdminRole, promotion_controller_1.PromotionController.deletePromotion);
exports.default = router;
