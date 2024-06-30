import { memoryUpload } from "../../../utils/upload.utility";
import { AdminAddNewSkillController, AdminGetSkillController } from "../controllers/adminAddSkill.controller";
import { AdminEmailForgotPasswordController, AdminEmailResetPasswordController } from "../controllers/adminForgotPassword";
import { AdminContractorDetail } from "../controllers/adminGetContractorDetail.controller";
import { AdminCustomerController } from "../controllers/adminGetCustomerDetail.contractor";
import { adminGetNotificationrController, adminUnseenNotificationrController, adminViewNotificationrController } from "../controllers/adminNotification.controller";
import { AddStaffController, AdminSignInController, SuperAdminGetAllAdminController, SuperAdminChangeStaffStatusController, adminResendEmailController, adminSignUpController, adminUpdateBioController, adminVerifiedEmailController, SuperAdminAddPermissionToStaffController, SuperAdminRemovePermissionFromStaffController } from "../controllers/adminReg.controller";
import { AdminGetAppDetailController } from "../controllers/appDetails.Controller";
import { AdminGetRevenueAnalysisControlleer, AdminsendEmailsControlleer } from "../controllers/averageRevenue.controller";
import { AdminContractorController } from "../controllers/contractor.controller";
import { AdminConversation } from "../controllers/conversation.controller";
import { dispute } from "../controllers/dispute.controller";
import { ermergency } from "../controllers/emergency.controller";
import {  AdminJobController, } from "../controllers/job.controller";
import { AdminGetCompletedPayoutDetailController, AdminGetPendingPayoutDetailController, AdminGetSinglePayoutDetailController, AdminPayContractorController } from "../controllers/payout.controller";
import { Permission } from "../controllers/permission.controller";
import { AdminQuizController } from "../controllers/quiz.controller";
import { TransactionDetailController } from "../controllers/transaction.controller";
import { checkAdminRole } from "../middlewares/adminRoleChecker.middleware";
import { Validations, createQuizParams, validatAdminEmailverificationParams, validateAddQuestionParams, validateAddSkillParams, validateAdminForgotPasswordParams, validateAdminLoginParams, validateAdminResetPasswprdParams, validateContractoDocumentIdValidationParams, validateContractorChangeStatusValidationParams, validateContractorIdValidationParams, validateCustomerIdValidationParams, validateDeleteQuestionValidationParams, validateEditQuestionParams, validateEmergecyIdParams, validateJobIdValidationParams, validatePayoutIDParams, validatePayoutIDPayContractorParams, validateQuestionIdValidationParams, validateResolvedEmergecyIdParams, validateRevenueDateParams, validateSignupParams, validateSuperAdmiCchangeStatusParams, validateTRansactionIdValidationParams } from "../middlewares/adminValidate.middleware";

const express = require("express");
const router = express.Router();


//done authecation
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

//don contractor
router.get("/contractor/detail", checkAdminRole, AdminContractorDetail.AdminGetContractorDetailController ); // admin get contractor detail
router.get("/contractor/detail/:contractorId", checkAdminRole, AdminContractorDetail.AdminGetSingleContractorDetailController ); // admin get single contractor detail
router.post("/validate/contractor/gst", validateContractorChangeStatusValidationParams, checkAdminRole, AdminContractorDetail.AdminChangeContractorGstStatusController ); // admin change contractor gst
router.get("/contractor/detail/pending/gst", checkAdminRole, AdminContractorDetail.AdminGetContractorGstPendingController ); // admin get contractor detail with gst status pending
router.get("/contractor/detail/approve/gst", checkAdminRole, AdminContractorDetail.AdminGetContractorGstApproveController ); // admin get contractor detail with gst status approve
router.get("/contractor/detail/decline/gst", checkAdminRole, AdminContractorDetail.AdminGetContractorGstDecliningController ); // admin get contractor detail with gst status Decline
router.get("/contractor/detail/review/gst", checkAdminRole, AdminContractorDetail.AdminGetContractorGstReviewingController ); // admin get contractor detail with gst status Reviewing
router.get("/contractor/job/detail/:contractorId", checkAdminRole, AdminContractorDetail.AdminGetSingleContractorJonDetailController ); // admin get single contractor job detail
router.post("/contractor/account/status", Validations.ContractorChangeStatusParams, checkAdminRole, AdminContractorDetail.AdminChangeContractorAccountStatusController); // admin change contractor account status


//done
router.get("/customer/detail", checkAdminRole, AdminCustomerController.AdminGetCustomerDetailController ); // admin get customer detail
router.get("/customer/detail/:customerId", checkAdminRole, AdminCustomerController.AdminGetSingleCustomerDetailController ); // admin get single customer detail
router.get("/customer/job/detail/:customerId", checkAdminRole, AdminCustomerController.AdminGetSingleCustomerJobDetailController ); // admin get single customer  job detail
router.post("/customer/account/status", Validations.CustomerChangeStatusParams, checkAdminRole, AdminCustomerController.AdminChangeCustomerAccountStatusController); // admin change customer account status



//done skill
router.post("/skills", validateAddSkillParams, checkAdminRole, AdminAddNewSkillController ); // admin add skill
router.post("/add/skill", validateAddSkillParams, checkAdminRole, AdminAddNewSkillController ); // admin add skilll
router.get("/skills", checkAdminRole, AdminGetSkillController ); // admin get all skill

router.post("/skills", validateAddSkillParams, checkAdminRole, AdminAddNewSkillController ); // admin add skilll
//done
router.post("/add/skill", validateAddSkillParams, checkAdminRole, AdminAddNewSkillController ); // admin add skilll
router.get("/skills", checkAdminRole, AdminGetSkillController ); // admin get all skill

// done job
router.get("/jobs/detail", checkAdminRole, AdminJobController.AdminGetJobsrDetailController ); // admin get job detail
router.get("/jobs/detail/:jobId", checkAdminRole, AdminJobController.AdminGetSingleJobsrDetailController ); // admin get single job detail
router.get("/total_job", checkAdminRole, AdminJobController.AdminGetTotalJobsrController); // admin get total job
router.get("/app_detail", checkAdminRole, AdminGetAppDetailController ); // admin get app detail
router.get("/invoice/detail/:jobId", checkAdminRole, AdminJobController.AdminGetInvoiceSingleJobsrDetailController ); // admin get invoices for single job detail

//done transaction
router.get("/transactions", checkAdminRole,TransactionDetailController.AdminGetTransactionDetailController ); // admin get transaction detail
router.get("/transaction/:transactionId", checkAdminRole, TransactionDetailController.AdminGetSingleTransactionDetailController ); // admin get single transaction detail

//done emergency
router.get("/emergecy/active", checkAdminRole, ermergency.AdminGetActiveEmergencyJobController ); // admin get active emergency
router.get("/emergecy/new", checkAdminRole, ermergency.AdminGeNewEmergencyJobController ); // admin get new emergency
router.get("/emergecy/resolve", checkAdminRole, ermergency.AdminGetResolveEmergencyJobController ); // admin get resolve emergency
router.get("/emergecy/:emergencyId", checkAdminRole, ermergency.AdminGetSingleEmergencyJobController ); // admin get single emergency
router.post("/emergecy/accept", validateEmergecyIdParams, checkAdminRole, ermergency.AdminAcceptEmergencyJobController  ); // admin accept emergecy
router.post("/emergecy/resolved", validateResolvedEmergecyIdParams, checkAdminRole, ermergency.AdminResolvedEmergencyJobController  ); // admin resolved emergecy

//done dispute
router.get("/dispute", Validations.DisputeStatusParams, checkAdminRole, dispute.AdminJobDisputeByStatusController ); // admin get dispute by status
router.get("/dispute/:disputeId", checkAdminRole, dispute.AdminGetSingleJobDisputeController ); // admin get single dispute
router.post("/dispute/accept", Validations.AcceptDisputeParams, checkAdminRole, dispute.AdminAcceptJobDisputeController ); // admin accept dispute
router.get("/dispute/admin", Validations.DisputeStatusParams, checkAdminRole, dispute.AdminGetJobDisputForAdminController ); // admin get dispute for himself
router.post("/dispute/settle", Validations.SettleDisputeParams, checkAdminRole, dispute.AdminSettleJobDisputeController  ); // admin settle dispute

//done conversation
router.post("/conversation", Validations.StartCoversaionParams, checkAdminRole, AdminConversation.startConversation  ); // admin start conversation
router.get("/conversation", checkAdminRole, AdminConversation.getConversations  ); // admin get conversation 
router.get("/conversation/:conversationId", checkAdminRole, AdminConversation.getSingleConversation  ); // admin get single conversation 
router.get("/conversation/meaasge/:conversationId", checkAdminRole, AdminConversation.getConversationMessages  ); // admin get  conversation message
router.post("/conversation/meaasge/:conversationId", Validations.sendMessageParams, checkAdminRole, AdminConversation.sendMessage  ); // admin send message



router.post("/update_profile", checkAdminRole, memoryUpload.single('profileImg'), adminUpdateBioController ); // admin update profile

router.get("/get_all_notification", checkAdminRole,  adminGetNotificationrController ); // admin get all notification
router.post("/view_unseen_notification", checkAdminRole,  adminViewNotificationrController ); // admin view unseen notification
router.get("/get_unseen_notification", checkAdminRole,  adminUnseenNotificationrController  ); // admin get total number of unseen notification

router.get("/get_revenue_par_day", validateRevenueDateParams, checkAdminRole, AdminGetRevenueAnalysisControlleer ); // admin get total number of unseen notification

router.get("/get_all_pending_payout", checkAdminRole, AdminGetPendingPayoutDetailController ); // admin get all pending payout
router.get("/get_all_completed_payout", checkAdminRole, AdminGetCompletedPayoutDetailController ); // admin get all completed payout
router.get("/get_single_payout", validatePayoutIDParams, checkAdminRole, AdminGetSinglePayoutDetailController ); // admin get single payout
router.post("/pay_contractor", validatePayoutIDPayContractorParams, checkAdminRole, AdminPayContractorController  ); // admin paycontractor


//no work just testing email
router.post("/send_email", AdminsendEmailsControlleer ); // admin get total number of unseen notification



// //////// //// ///// //// //// //// //// //// //// ///// //

// QUIZ
router.post("/quizzes", createQuizParams, checkAdminRole, AdminQuizController.CreateQuiz ); // admin create quiz
router.get("/quizzes", checkAdminRole, AdminQuizController.getAllQuizzes ); // admin get quizes
router.get("/random-quiz", checkAdminRole, AdminQuizController.getRandomQuiz ); // admin add question

// router.post("/admin_add_question", validateAddQuestionParams, checkAdminRole, AdminQuizController.AddQuestion ); // admin add question
router.get("/question", checkAdminRole, AdminQuizController.GetAllQuestions ); // admin get all question
router.get("/question/:questionId", checkAdminRole, AdminQuizController.GetSingleQuestion ); // admin get single question
router.post("/question/edit", validateEditQuestionParams, checkAdminRole, AdminQuizController.EditQuestion ); // admin edit question
router.post("/question/delete", validateDeleteQuestionValidationParams, checkAdminRole, AdminQuizController.DeleteQuestion ); // admin delete question


// CONTRACTOR
router.post("/contractors/:contractorId/attach-stripe-account",  AdminContractorController.attachStripeAccount ); //
router.post("/contractors/:contractorId/remove-stripe-account",  AdminContractorController.removeStripeAccount ); //

export default router;