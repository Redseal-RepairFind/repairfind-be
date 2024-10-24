import { AdminJobController } from "../controllers/admin_job.controller";
import { AdminSkillController } from "../controllers/admin_skill.controller";
import { AdminContractorController } from "../controllers/admin_contractors.controller";
import { AdminCustomerController } from "../controllers/admin_customer.controller";
import { AdminNotificationController } from "../controllers/admin_notification.controller";
import { AdminGetAppDetailController } from "../controllers/appDetails.Controller";
import { AdminGetRevenueAnalysisControlleer } from "../controllers/averageRevenue.controller";
import { AdminConversationController } from "../controllers/conversation.controller";
import { AdminDisputeController } from "../controllers/admin_disputes.controller";
import { AdminEmergencyController } from "../controllers/emergency.controller";
import { AdminGetCompletedPayoutDetailController, AdminGetPendingPayoutDetailController, AdminGetSinglePayoutDetailController, AdminPayContractorController } from "../controllers/payout.controller";
import { AdminPermissionController } from "../controllers/permission.controller";
import { AdminQuizController } from "../controllers/quiz.controller";
import { TransactionDetailController } from "../controllers/transaction.controller";
import { checkAdminRole } from "../middlewares/adminRoleChecker.middleware";
import { Validations, createQuizParams, validatAdminEmailverificationParams, validateAddSkillParams, validateAdminChangePasswordParams, validateAdminForgotPasswordParams, validateAdminLoginParams, validateAdminResetPasswprdParams, validateEditQuestionParams, validatePayoutIDParams, validatePayoutIDPayContractorParams, validateRevenueDateParams, validateSignupParams, validateSuperAdmiCchangeStatusParams } from "../middlewares/admin_validations.middleware";
import { AdminAuthController } from "../controllers/admin_auth.controller";
import { AdminStaffController } from "../controllers/admin_staff.controller";
import { AdminAnalyticsController } from "../controllers/admin_analytics.controller";
import { AppVersionController } from "../controllers/app_version.controller";
import { AdminReportController } from "../controllers/admin_report.controller";
import { PromotionController } from "../controllers/promotion.controller";

const express = require("express");
const router = express.Router();


//refactored authecation
router.post("/signup", validateSignupParams, AdminAuthController.signUp);
router.post("/email/verification", validatAdminEmailverificationParams, AdminAuthController.verifyEmail);
router.post("/resend/email", validateAdminForgotPasswordParams, AdminAuthController.resendEmail);
router.post("/signin", validateAdminLoginParams, AdminAuthController.signIn);
router.post("/forgot/password", validateAdminForgotPasswordParams, AdminAuthController.forgotPassword);
router.post("/reset/password", validateAdminResetPasswprdParams, AdminAuthController.resetPassword);
router.post("/change-password", validateAdminChangePasswordParams, AdminAuthController.changePassword);


router.get("/analytics", checkAdminRole, AdminAnalyticsController.getStats);


//don staff
router.post("/staffs", Validations.AddStaffParams, checkAdminRole, AdminStaffController.addStaff);
router.post("/staffs/status", validateSuperAdmiCchangeStatusParams, checkAdminRole, AdminStaffController.changeStaffStatus);
router.get("/staffs", checkAdminRole, AdminStaffController.getAdminStaffs);
router.post("/staffs/permission", Validations.AddPermissionParams, checkAdminRole, AdminStaffController.addPermissionToStaff);
router.post("/staffs/permission/remove", Validations.AddPermissionParams, checkAdminRole, AdminStaffController.removePermissionFromStaff);



// done permission
router.post("/permissions", Validations.PermissionCreationParam, checkAdminRole, AdminPermissionController.addSinglePermission); // super admin create permission
router.post("/permissions/add-bulk", checkAdminRole, AdminPermissionController.addBulkPermission); // super admin create permission
router.get("/permissions", checkAdminRole, AdminPermissionController.getPermissions); // super admin get all permission
router.patch("/permissions/:permissionId", Validations.EditPermissionParams, checkAdminRole, AdminPermissionController.updatePermission); // super admin edit permission

// App Versions
router.post("/app-versions", Validations.validateAppVersionCreation, checkAdminRole, AppVersionController.addAppVersion);
router.get("/app-versions", checkAdminRole, AppVersionController.getAppVersions);
router.get("/app-versions/:id", checkAdminRole, AppVersionController.getAppVersionById);
router.patch("/app-versions/:id", Validations.validateAppVersionUpdate, checkAdminRole, AppVersionController.updateAppVersion);
router.delete("/app-versions/:id", checkAdminRole, AppVersionController.deleteAppVersion);



// User Reports
router.get("/abuse-reports", checkAdminRole, AdminReportController.getAllReports);
router.get("/abuse-reports/:id", checkAdminRole, AdminReportController.getReportById);
router.patch("/abuse-reports/:id", Validations.validateAppVersionUpdate, checkAdminRole, AdminReportController.updateReport);




// CONTRACTOR
router.get("/contractors", checkAdminRole, AdminContractorController.exploreContractors); // admin get contractor detail
router.get("/contractors/:contractorId", checkAdminRole, AdminContractorController.getSingleContractor); // admin get single contractor detail
router.get("/contractors/:contractorId/jobs", checkAdminRole, AdminContractorController.getJobHistory); // admin get single contractor detail
router.get("/contractors/:contractorId/jobs/:jobId", checkAdminRole, AdminContractorController.getSingleJob); // admin get single contractor detail
router.patch("/contractors/:contractorId/gst", Validations.updateGstDetails, checkAdminRole, AdminContractorController.updateGstDetails); // admin change contractor gst
router.patch("/contractors/:contractorId/status", Validations.updateAccount, checkAdminRole, AdminContractorController.updateAccountStatus); // admin change contractor gst
router.post("/contractors/:contractorId/sendmail", Validations.sendCustomEmail, checkAdminRole, AdminContractorController.sendCustomEmail); // admin change contractor gst


router.post("/contractors/attach-certn-details", AdminContractorController.attachCertnDetails); //
router.post("/contractors/attach-certn-id", AdminContractorController.attachCertnId); //

router.post("/contractors/:contractorId/attach-stripe-account", AdminContractorController.attachStripeAccount); //
router.post("/contractors/:contractorId/remove-stripe-account", AdminContractorController.removeStripeAccount); //
router.post("/contractors/:contractorId/issue-coupon", AdminContractorController.issueCoupon); //


//done
router.get("/customers", checkAdminRole, AdminCustomerController.getCustomers);
router.get("/customers/:customerId", checkAdminRole, AdminCustomerController.getSingleCustomer); // admin get single customer detail
router.get("/customer/job/detail/:customerId", checkAdminRole, AdminCustomerController.AdminGetSingleCustomerJobDetailController); // admin get single customer  job detail
router.post("/customer/account/status", Validations.CustomerChangeStatusParams, checkAdminRole, AdminCustomerController.AdminChangeCustomerAccountStatusController); // admin change customer account status
router.post("/customers/:customerId/issue-coupon", AdminCustomerController.issueCoupon); //



//done skill
router.post("/skills", validateAddSkillParams, checkAdminRole, AdminSkillController.AddNew); // admin add skill
router.post("/skills/bulk", checkAdminRole, AdminSkillController.AddMultipleSkills); // admin add skilll
router.get("/skills", checkAdminRole, AdminSkillController.GetSkills); // admin get all skill



// refactored aaron
router.get("/jobs", checkAdminRole, AdminJobController.getJobs);
router.get("/jobs/:jobId", checkAdminRole, AdminJobController.getSingleJob);
router.get("/app_detail", checkAdminRole, AdminGetAppDetailController);
router.get("/jobdays", checkAdminRole, AdminJobController.getJobDays);
router.get("/jobdays/:jobdayId", checkAdminRole, AdminJobController.getSingleJobDay);
// router.get("/invoice/detail/:jobId", checkAdminRole, AdminJobController.AdminGetInvoiceSingleJobsrDetailController ); 


//done transaction
router.get("/transactions", checkAdminRole, TransactionDetailController.AdminGetTransactionDetailController)
router.get("/transaction/:transactionId", checkAdminRole, TransactionDetailController.AdminGetSingleTransactionDetailController);

//refactored emergency
router.get("/emergencies", checkAdminRole, AdminEmergencyController.getEmergencies);
router.post("/emergencies/:emergencyId/accept", checkAdminRole, AdminEmergencyController.acceptEmergency);
router.post("/emergencies/:emergencyId/resolve", checkAdminRole, AdminEmergencyController.resolveEmergency);
router.get("/emergencies/:emergencyId", checkAdminRole, AdminEmergencyController.getSingleEmergency);



//refactored disputes
router.get("/disputes", checkAdminRole, AdminDisputeController.getJobDisputes);
router.get("/disputes/:disputeId", checkAdminRole, AdminDisputeController.getSingleDispute);
router.post("/disputes/:disputeId/accept", checkAdminRole, AdminDisputeController.acceptDispute);
router.post("/disputes/:disputeId/settle", Validations.SettleDisputeParams, checkAdminRole, AdminDisputeController.settleDispute);
router.post("/disputes/:disputeId/refund-customer", checkAdminRole, AdminDisputeController.createDisputeRefund);
router.post("/disputes/:disputeId/refund-contractor", checkAdminRole, AdminDisputeController.markJobAsComplete);
router.post("/disputes/:disputeId/enable-revisit", checkAdminRole, AdminDisputeController.enableRevisit);


//refactored conversation
router.post("/conversations", Validations.StartCoversaionParams, checkAdminRole, AdminConversationController.startConversation); // admin start conversation
router.get("/conversations", checkAdminRole, AdminConversationController.getConversations); // admin get conversation 
router.get("/conversations/:conversationId", checkAdminRole, AdminConversationController.getSingleConversation); // admin get single conversation 
router.get("/conversations/:conversationId/messages", checkAdminRole, AdminConversationController.getConversationMessages); // admin get  conversation message
router.post("/conversations/:conversationId/messages", Validations.sendMessageParams, checkAdminRole, AdminConversationController.sendMessage); // admin send message



// Notifications
router.get('/notifications', checkAdminRole, AdminNotificationController.getNotifications)
router.get('/notifications/alerts', checkAdminRole, AdminNotificationController.redAlerts)
router.get('/notifications/:notificationId', checkAdminRole, AdminNotificationController.getSingleNotification)
router.post('/notifications/mark-all-read', checkAdminRole, AdminNotificationController.markAllNotificationsAsRead)
router.post('/notifications/:notificationId', checkAdminRole, AdminNotificationController.getSingleNotification)



router.get("/get_revenue_par_day", validateRevenueDateParams, checkAdminRole, AdminGetRevenueAnalysisControlleer); // admin get total number of unseen notification
router.get("/get_all_pending_payout", checkAdminRole, AdminGetPendingPayoutDetailController); // admin get all pending payout
router.get("/get_all_completed_payout", checkAdminRole, AdminGetCompletedPayoutDetailController); // admin get all completed payout
router.get("/get_single_payout", validatePayoutIDParams, checkAdminRole, AdminGetSinglePayoutDetailController); // admin get single payout
router.post("/pay_contractor", validatePayoutIDPayContractorParams, checkAdminRole, AdminPayContractorController); // admin paycontractor



// QUIZ
router.post("/quizzes", createQuizParams, checkAdminRole, AdminQuizController.CreateQuiz); // admin create quiz
router.get("/quizzes", checkAdminRole, AdminQuizController.getAllQuizzes); // admin get quizes
router.post("/quizzes/:quizId/add-question", checkAdminRole, AdminQuizController.addSingleQuestion); // admin get all question
router.get("/quizzes/:quizId", checkAdminRole, AdminQuizController.getSingleQuiz); // admin get all question
router.get("/random-quiz", checkAdminRole, AdminQuizController.getRandomQuiz); // admin add question

router.get("/questions", checkAdminRole, AdminQuizController.GetAllQuestions); // admin get all question
router.get("/questions/:questionId", checkAdminRole, AdminQuizController.GetSingleQuestion); // admin get single question
router.patch("/questions/:questionId", validateEditQuestionParams, checkAdminRole, AdminQuizController.EditQuestion); // admin edit question
router.delete("/questions/:questionId", checkAdminRole, AdminQuizController.DeleteQuestion); // admin delete question



// App Versions
router.post("/promotions", Validations.validatePromotionCreation, checkAdminRole, PromotionController.addPromotion);
router.get("/promotions", checkAdminRole, PromotionController.getPromotions);
router.get("/promotions/:id", checkAdminRole, PromotionController.getSinglePromotion);
router.patch("/promotions/:id", Validations.validatePromotionUpdate, checkAdminRole, PromotionController.updatePromotion);
router.delete("/promotions/:id", checkAdminRole, PromotionController.deletePromotion);



export default router;