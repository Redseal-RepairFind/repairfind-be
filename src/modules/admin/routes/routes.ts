import { memoryUpload } from "../../../utils/upload.utility";
import { AdminAddNewSkillController, AdminGetSkillController } from "../controllers/adminAddSkill.controller";
import { AdminGetContractorDocForValController, AdminGetSingleContractorDocForValController, AdminValidateContractorDocsController } from "../controllers/adminContractorDocVal.controller";
import { AdminEmailForgotPasswordController, AdminEmailResetPasswordController } from "../controllers/adminForgotPassword";
import { AdminContractorDetail } from "../controllers/adminGetContractorDetail.controller";
import { AdminGetCustomerDetailController, AdminGetSingleCustomerDetailController } from "../controllers/adminGetCustomerDetail.contractor";
import { adminGetNotificationrController, adminUnseenNotificationrController, adminViewNotificationrController } from "../controllers/adminNotification.controller";
import { AdminSignInController, SuperAdminGetAllAdminController, SuperAdminValidateOtherAdminController, adminResendEmailController, adminSignUpController, adminUpdateBioController, adminVerifiedEmailController } from "../controllers/adminReg.controller";
import { AdminGetAppDetailController } from "../controllers/appDetails.Controller";
import { AdminGetRevenueAnalysisControlleer, AdminsendEmailsControlleer } from "../controllers/averageRevenue.controller";
import { AdminContractorController } from "../controllers/contractor.controller";
import {  AdminJobController, } from "../controllers/job.controller";
import { AdminGetCompletedPayoutDetailController, AdminGetPendingPayoutDetailController, AdminGetSinglePayoutDetailController, AdminPayContractorController } from "../controllers/payout.controller";
import { AdminQuizController } from "../controllers/quiz.controller";
import { AdminGetSingleTransactionDetailController, AdminGetTransactionDetailController } from "../controllers/transaction.controller";
import { checkAdminRole } from "../middlewares/adminRoleChecker.middleware";
import { createQuizParams, validatAdminEmailverificationParams, validateAddQuestionParams, validateAddSkillParams, validateAdminForgotPasswordParams, validateAdminLoginParams, validateAdminResetPasswprdParams, validateContractoDocumentIdValidationParams, validateContractorChangeStatusValidationParams, validateContractorIdValidationParams, validateCustomerIdValidationParams, validateDeleteQuestionValidationParams, validateEditQuestionParams, validateJobIdValidationParams, validatePayoutIDParams, validatePayoutIDPayContractorParams, validateQuestionIdValidationParams, validateRevenueDateParams, validateSignupParams, validateSuperAdminValidationParams, validateTRansactionIdValidationParams } from "../middlewares/adminValidate.middleware";

const express = require("express");
const router = express.Router();

router.post("/signup", validateSignupParams, adminSignUpController ); // admin signup
router.post("/email/verification", validatAdminEmailverificationParams, adminVerifiedEmailController ); // admin email verification
router.post("/resend/email", validateAdminForgotPasswordParams, adminResendEmailController ); // admin resend email
router.post("/signin", validateAdminLoginParams, AdminSignInController ); // admin login
router.post("/forgot/password", validateAdminForgotPasswordParams, AdminEmailForgotPasswordController ); // admin forgot password
router.post("/reset/password", validateAdminResetPasswprdParams, AdminEmailResetPasswordController ); // admin reset password
router.get("/super/admin/get_list_of_admin", checkAdminRole, SuperAdminGetAllAdminController ); // super get the list of admin
router.post("/super/admin/validate/other_admin", validateSuperAdminValidationParams, checkAdminRole, SuperAdminValidateOtherAdminController ); // super admin validate other admin


//don
router.get("/contractor/detail", checkAdminRole, AdminContractorDetail.AdminGetContractorDetailController ); // admin get contractor detail
router.get("/contractor/detail/:contractorId", checkAdminRole, AdminContractorDetail.AdminGetSingleContractorDetailController ); // admin get single contractor detail
router.post("/validate/contractor/gst", validateContractorChangeStatusValidationParams, checkAdminRole, AdminContractorDetail.AdminChangeContractorGstStatusController ); // admin change contractor gst
router.get("/contractor/detail/pending/gst", checkAdminRole, AdminContractorDetail.AdminGetContractorGstPendingController ); // admin get contractor detail with gst status pending

router.get("/admin_get_customer_detail", checkAdminRole, AdminGetCustomerDetailController ); // admin get customer detail
router.get("/admin_get_single_customer_detail", validateCustomerIdValidationParams, checkAdminRole, AdminGetSingleCustomerDetailController ); // admin get single customer detail


router.get("/admin_get_contractor_document", checkAdminRole, AdminGetContractorDocForValController ); // admin get contractor pending document for validation
router.get("/admin_get_single_contractor_document", validateContractoDocumentIdValidationParams, checkAdminRole, AdminGetSingleContractorDocForValController ); // admin get single contractor pending document for validation
router.post("/admin_validate_contractor_document", validateContractoDocumentIdValidationParams, checkAdminRole, AdminValidateContractorDocsController ); // admin get validate contractor document 


router.post("/skills", validateAddSkillParams, checkAdminRole, AdminAddNewSkillController ); // admin add skilll
router.get("/skills", checkAdminRole, AdminGetSkillController ); // admin get all skill

// done
router.get("/jobs/detail", checkAdminRole, AdminJobController.AdminGetJobsrDetailController ); // admin get job detail
router.get("/jobs/detail/:jobId", checkAdminRole, AdminJobController.AdminGetSingleJobsrDetailController ); // admin get single job detail
router.get("/total_job", checkAdminRole, AdminJobController.AdminGetTotalJobsrController); // admin get total job
router.get("/app_detail", checkAdminRole, AdminGetAppDetailController ); // admin get app detail


router.get("/admin_get_transaction_detail", checkAdminRole, AdminGetTransactionDetailController ); // admin get transaction detail
router.get("/admin_get_single_transaction_detail", validateTRansactionIdValidationParams, checkAdminRole, AdminGetSingleTransactionDetailController ); // admin get single transaction detail

router.post("/admin_add_question", validateAddQuestionParams, checkAdminRole, AdminQuizController.AddQuestion ); // admin add question
router.get("/admin_get_all_question", checkAdminRole, AdminQuizController.GetAllQuestions ); // admin get all question


router.get("/admin_get_single_question", validateQuestionIdValidationParams, checkAdminRole, AdminQuizController.GetSingleQuestion ); // admin get single question
router.post("/admin_edit_question", validateEditQuestionParams, checkAdminRole, AdminQuizController.EditQuestion ); // admin edit question
router.post("/admin_delete_question", validateDeleteQuestionValidationParams, checkAdminRole, AdminQuizController.DeleteQuestion ); // admin delete question

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


// CONTRACTOR
router.post("/contractors/:contractorId/attach-stripe-account",  AdminContractorController.attachStripeAccount ); //
router.post("/contractors/:contractorId/remove-stripe-account",  AdminContractorController.removeStripeAccount ); //

export default router;