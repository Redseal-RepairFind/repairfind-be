import { memoryUpload } from "../../../utils/upload.utility";
import { AdminJobController } from "../controllers/admin_job.controller";
import { AdminSkillController } from "../controllers/admin_skill.controller";
import { AdminEmailForgotPasswordController, AdminEmailResetPasswordController } from "../controllers/adminForgotPassword";
import { AdminContractorController } from "../controllers/admin_contractors.controller";
import { AdminCustomerController } from "../controllers/adminGetCustomerDetail.contractor";
import { adminGetNotificationrController, adminUnseenNotificationrController, adminViewNotificationrController } from "../controllers/adminNotification.controller";
import { AddStaffController, AdminSignInController, SuperAdminGetAllAdminController, SuperAdminChangeStaffStatusController, adminResendEmailController, adminSignUpController, adminUpdateBioController, adminVerifiedEmailController, SuperAdminAddPermissionToStaffController, SuperAdminRemovePermissionFromStaffController } from "../controllers/adminReg.controller";
import { AdminGetAppDetailController } from "../controllers/appDetails.Controller";
import { AdminGetRevenueAnalysisControlleer, AdminsendEmailsControlleer } from "../controllers/averageRevenue.controller";
import { AdminConversationController } from "../controllers/conversation.controller";
import { AdminDisputeController } from "../controllers/admin_disputes.controller";
import { AdminEmergencyController } from "../controllers/emergency.controller";
// import {  AdminJobController, } from "../controllers/job.controller";
import { AdminGetCompletedPayoutDetailController, AdminGetPendingPayoutDetailController, AdminGetSinglePayoutDetailController, AdminPayContractorController } from "../controllers/payout.controller";
import { Permission } from "../controllers/permission.controller";
import { AdminQuizController } from "../controllers/quiz.controller";
import { TransactionDetailController } from "../controllers/transaction.controller";
import { checkAdminRole } from "../middlewares/adminRoleChecker.middleware";
import { Validations, createQuizParams, validatAdminEmailverificationParams, validateAddQuestionParams, validateAddSkillParams, validateAdminForgotPasswordParams, validateAdminLoginParams, validateAdminResetPasswprdParams, validateContractoDocumentIdValidationParams, validateContractorIdValidationParams, validateCustomerIdValidationParams, validateDeleteQuestionValidationParams, validateEditQuestionParams, validateEmergecyIdParams, validateJobIdValidationParams, validatePayoutIDParams, validatePayoutIDPayContractorParams, validateQuestionIdValidationParams, validateResolvedEmergecyIdParams, validateRevenueDateParams, validateSignupParams, validateSuperAdmiCchangeStatusParams, validateTRansactionIdValidationParams } from "../middlewares/admin_validations.middleware";

const express = require("express");
const router = express.Router();


//refactored authecation
router.post("/signup", validateSignupParams, adminSignUpController ); // admin signup
router.post("/email/verification", validatAdminEmailverificationParams, adminVerifiedEmailController ); // admin email verification
router.post("/resend/email", validateAdminForgotPasswordParams, adminResendEmailController ); // admin resend email
router.post("/signin", validateAdminLoginParams, AdminSignInController ); // admin login
router.post("/forgot/password", validateAdminForgotPasswordParams, AdminEmailForgotPasswordController ); // admin forgot password
router.post("/reset/password", validateAdminResetPasswprdParams, AdminEmailResetPasswordController ); // admin reset password


//don staff
router.post("/staff", Validations.AddStaffParams, checkAdminRole, AddStaffController ); // super admin add staff
router.post("/staff/status", validateSuperAdmiCchangeStatusParams, checkAdminRole, SuperAdminChangeStaffStatusController ); // super admin change staff status
router.get("/staffs", checkAdminRole, SuperAdminGetAllAdminController ); // super get the list of staff
router.post("/staff/permission", Validations.AddPermissionParams, checkAdminRole, SuperAdminAddPermissionToStaffController ); // super add permission to staff
router.post("/staff/permission/remove", Validations.AddPermissionParams, checkAdminRole, SuperAdminRemovePermissionFromStaffController ); // super remove permission from staff

// done permission
router.post("/permission", Validations.PermissionCreationParam, checkAdminRole, Permission.PermissionCreationController ); // super admin create permission
router.get("/permissions", checkAdminRole, Permission.GetPermissionController ); // super admin get all permission
router.post("/edit/permission", Validations.EditPermissionParams, checkAdminRole, Permission.EditPermissionController ); // super admin edit permission



//refactored contractor
router.get("/contractors", checkAdminRole, AdminContractorController.exploreContractors ); // admin get contractor detail
router.get("/contractors/:contractorId", checkAdminRole, AdminContractorController.getSingleContractor ); // admin get single contractor detail
router.get("/contractors/:contractorId/jobs", checkAdminRole, AdminContractorController.getJobHistory ); // admin get single contractor detail
router.get("/contractors/:contractorId/jobs/:jobId", checkAdminRole, AdminContractorController.getSingleJob ); // admin get single contractor detail
router.patch("/contractors/:contractorId/gst", Validations.updateGstDetails, checkAdminRole, AdminContractorController.updateGstDetails ); // admin change contractor gst
router.patch("/contractors/:contractorId/status", Validations.updateAccount, checkAdminRole, AdminContractorController.updateAccountStatus ); // admin change contractor gst
router.post("/contractors/:contractorId/sendmail", Validations.sendCustomEmail, checkAdminRole, AdminContractorController.sendCustomEmail ); // admin change contractor gst


//done
router.get("/customer/detail", checkAdminRole, AdminCustomerController.AdminGetCustomerDetailController ); // admin get customer detail
router.get("/customer/detail/:customerId", checkAdminRole, AdminCustomerController.AdminGetSingleCustomerDetailController ); // admin get single customer detail
router.get("/customer/job/detail/:customerId", checkAdminRole, AdminCustomerController.AdminGetSingleCustomerJobDetailController ); // admin get single customer  job detail
router.post("/customer/account/status", Validations.CustomerChangeStatusParams, checkAdminRole, AdminCustomerController.AdminChangeCustomerAccountStatusController); // admin change customer account status



//done skill
router.post("/skills", validateAddSkillParams, checkAdminRole, AdminSkillController.AddNew ); // admin add skill
// router.post("/skill/bulk", validateAddSkillParams, checkAdminRole, AdminSkillController ); // admin add skilll
router.get("/skills", checkAdminRole, AdminSkillController.GetSkills ); // admin get all skill



// refactored aaron
router.get("/jobs", checkAdminRole, AdminJobController.getJobs ); 
router.get("/jobs/stats", checkAdminRole, AdminJobController.getJobStats); 
router.get("/jobs/:jobId", checkAdminRole, AdminJobController.getSingleJob ); 
router.get("/app_detail", checkAdminRole, AdminGetAppDetailController ); 
// router.get("/invoice/detail/:jobId", checkAdminRole, AdminJobController.AdminGetInvoiceSingleJobsrDetailController ); 



//done transaction
router.get("/transactions", checkAdminRole,TransactionDetailController.AdminGetTransactionDetailController )
router.get("/transaction/:transactionId", checkAdminRole, TransactionDetailController.AdminGetSingleTransactionDetailController ); 

//refactored emergency
router.get("/emergencies", checkAdminRole, AdminEmergencyController.getEmergencies ); 
router.post("/emergencies/:emergencyId/accept", checkAdminRole, AdminEmergencyController.acceptEmergency  );
router.post("/emergencies/:emergencyId/resolve", checkAdminRole, AdminEmergencyController.resolveEmergency  );
router.get("/emergencies/:emergencyId", checkAdminRole, AdminEmergencyController.getSingleEmergency ); 



//refactored disputes
router.get("/disputes", checkAdminRole, AdminDisputeController.getJobDisputes ); 
router.get("/disputes/:disputeId", checkAdminRole, AdminDisputeController.getSingleDispute ); 
router.post("/disputes/:disputeId/accept", checkAdminRole, AdminDisputeController.acceptDispute ); 
router.post("/disputes/:disputeId/settle", Validations.SettleDisputeParams, checkAdminRole, AdminDisputeController.settleDispute  ); 


//refactored conversation
router.post("/conversations", Validations.StartCoversaionParams, checkAdminRole, AdminConversationController.startConversation  ); // admin start conversation
router.get("/conversations", checkAdminRole, AdminConversationController.getConversations  ); // admin get conversation 
router.get("/conversations/:conversationId", checkAdminRole, AdminConversationController.getSingleConversation  ); // admin get single conversation 
router.get("/conversations/:conversationId/messages", checkAdminRole, AdminConversationController.getConversationMessages  ); // admin get  conversation message
router.post("/conversations/:conversationId/messages", Validations.sendMessageParams, checkAdminRole, AdminConversationController.sendMessage  ); // admin send message



// TODO:
router.post("/update_profile", checkAdminRole, memoryUpload.single('profileImg'), adminUpdateBioController ); // admin update profile
router.get("/get_all_notification", checkAdminRole,  adminGetNotificationrController ); // admin get all notification
router.post("/view_unseen_notification", checkAdminRole,  adminViewNotificationrController ); // admin view unseen notification
router.get("/get_unseen_notification", checkAdminRole,  adminUnseenNotificationrController  ); // admin get total number of unseen notification
router.get("/get_revenue_par_day", validateRevenueDateParams, checkAdminRole, AdminGetRevenueAnalysisControlleer ); // admin get total number of unseen notification
router.get("/get_all_pending_payout", checkAdminRole, AdminGetPendingPayoutDetailController ); // admin get all pending payout
router.get("/get_all_completed_payout", checkAdminRole, AdminGetCompletedPayoutDetailController ); // admin get all completed payout
router.get("/get_single_payout", validatePayoutIDParams, checkAdminRole, AdminGetSinglePayoutDetailController ); // admin get single payout
router.post("/pay_contractor", validatePayoutIDPayContractorParams, checkAdminRole, AdminPayContractorController  ); // admin paycontractor



// QUIZ
router.post("/quizzes", createQuizParams, checkAdminRole, AdminQuizController.CreateQuiz ); // admin create quiz
router.get("/quizzes", checkAdminRole, AdminQuizController.getAllQuizzes ); // admin get quizes
router.get("/random-quiz", checkAdminRole, AdminQuizController.getRandomQuiz ); // admin add question
router.get("/question", checkAdminRole, AdminQuizController.GetAllQuestions ); // admin get all question
router.get("/question/:questionId", checkAdminRole, AdminQuizController.GetSingleQuestion ); // admin get single question
router.post("/question/edit", validateEditQuestionParams, checkAdminRole, AdminQuizController.EditQuestion ); // admin edit question
router.post("/question/delete", validateDeleteQuestionValidationParams, checkAdminRole, AdminQuizController.DeleteQuestion ); // admin delete question


// CONTRACTOR
router.post("/contractors/:contractorId/attach-stripe-account",  AdminContractorController.attachStripeAccount ); //
router.post("/contractors/:contractorId/remove-stripe-account",  AdminContractorController.removeStripeAccount ); //

export default router;