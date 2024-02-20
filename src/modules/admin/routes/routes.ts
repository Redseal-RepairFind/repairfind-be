import { upload } from "../../../utils/upload.utility";
import { AdminAddNewSkillController, AdminGetSkillController } from "../controllers/adminAddSkill.controller";
import { AdminGetContractorDocForValController, AdminGetSingleContractorDocForValController, AdminValidateContractorDocsController } from "../controllers/adminContractorDocVal.controller";
import { AdminEmailForgotPasswordController, AdminEmailResetPasswordController } from "../controllers/adminForgotPassword";
import { AdminChangeContractorContractorDetailController, AdminGetContractorDetailController, AdminGetSingleContractorDetailController } from "../controllers/adminGetContractorDetail.controller";
import { AdminGetCustomerDetailController, AdminGetSingleCustomerDetailController } from "../controllers/adminGetCustomerDetail.contractor";
import { adminGetNotificationrController, adminUnseenNotificationrController, adminViewNotificationrController } from "../controllers/adminNotification.controller";
import { AdminSignInController, SuperAdminGetAllAdminController, SuperAdminValidateOtherAdminController, adminResendEmailController, adminSignUpController, adminUpdateBioController, adminVerifiedEmailController } from "../controllers/adminReg.controller";
import { AdminGetAppDetailController } from "../controllers/appDetails.Controller";
import { AdminGetRevenueAnalysisControlleer, AdminsendEmailsControlleer } from "../controllers/averageRevenue.controller";
import { AdminGetJobsrDetailController, AdminGetSingleJobsrDetailController, AdminGetTotalJobsrController } from "../controllers/job.controller";
import { AdminGetCompletedPayoutDetailController, AdminGetPendingPayoutDetailController, AdminGetSinglePayoutDetailController, AdminPayContractorController } from "../controllers/payout.controller";
import { AdminAddQuestionlController, AdminDeleteQuestionlController, AdminEditQuestionlController, AdminGetAllQuestionController, AdminGetSingleQuestionController } from "../controllers/question.controller";
import { AdminGetSingleTransactionDetailController, AdminGetTransactionDetailController } from "../controllers/transaction.controller";
import { checkAdminRole } from "../middlewares/adminRoleChecker.middleware";
import { validatAdminEmailverificationParams, validateAddQuestionParams, validateAddSkillParams, validateAdminForgotPasswordParams, validateAdminLoginParams, validateAdminResetPasswprdParams, validateContractoDocumentIdValidationParams, validateContractorChangeStatusValidationParams, validateContractorIdValidationParams, validateCustomerIdValidationParams, validateDeleteQuestionValidationParams, validateEditQuestionParams, validateJobIdValidationParams, validatePayoutIDParams, validatePayoutIDPayContractorParams, validateQuestionIdValidationParams, validateRevenueDateParams, validateSignupParams, validateSuperAdminValidationParams, validateTRansactionIdValidationParams } from "../middlewares/adminValidate.middleware";

const express = require("express");
const router = express.Router();

router.post("/admin_signup", validateSignupParams, adminSignUpController ); // admin signup
router.post("/admin_email_verification", validatAdminEmailverificationParams, adminVerifiedEmailController ); // admin email verification
router.post("/admin_resend_email", validateAdminForgotPasswordParams, adminResendEmailController ); // admin resend email
router.post("/admin_signin", validateAdminLoginParams, AdminSignInController ); // admin login
router.post("/admin_forgot_password", validateAdminForgotPasswordParams, AdminEmailForgotPasswordController ); // admin forgot password
router.post("/admin_reset_password", validateAdminResetPasswprdParams, AdminEmailResetPasswordController ); // admin reset password
router.get("/super_admin_get_list_of_admin", checkAdminRole, SuperAdminGetAllAdminController ); // super get the list of admin
router.post("/super_admin_validate_other_admin", validateSuperAdminValidationParams, checkAdminRole, SuperAdminValidateOtherAdminController ); // super admin validate other admin


router.get("/admin_get_contractor_detail", checkAdminRole, AdminGetContractorDetailController ); // admin get contractor detail
router.get("/admin_get_single_contractor_detail", validateContractorIdValidationParams, checkAdminRole, AdminGetSingleContractorDetailController ); // admin get single contractor detail
router.post("/admin_change_contractor_status", validateContractorChangeStatusValidationParams, checkAdminRole, AdminChangeContractorContractorDetailController ); // admin change contractor status

router.get("/admin_get_customer_detail", checkAdminRole, AdminGetCustomerDetailController ); // admin get customer detail
router.get("/admin_get_single_customer_detail", validateCustomerIdValidationParams, checkAdminRole, AdminGetSingleCustomerDetailController ); // admin get single customer detail


router.get("/admin_get_contractor_document", checkAdminRole, AdminGetContractorDocForValController ); // admin get contractor pending document for validation
router.get("/admin_get_single_contractor_document", validateContractoDocumentIdValidationParams, checkAdminRole, AdminGetSingleContractorDocForValController ); // admin get single contractor pending document for validation
router.post("/admin_validate_contractor_document", validateContractoDocumentIdValidationParams, checkAdminRole, AdminValidateContractorDocsController ); // admin get validate contractor document 


router.post("/admin_add_skill", validateAddSkillParams, checkAdminRole, AdminAddNewSkillController ); // admin add skilll
router.get("/admin_get_skill", checkAdminRole, AdminGetSkillController ); // admin get all skill

router.get("/admin_get_jobs_detail", checkAdminRole, AdminGetJobsrDetailController ); // admin get job detail
router.get("/admin_get_single_job_detail", validateJobIdValidationParams, checkAdminRole, AdminGetSingleJobsrDetailController ); // admin get single job detail
router.get("/admin_get_total_job", checkAdminRole, AdminGetTotalJobsrController    ); // admin get total job


router.get("/admin_get_transaction_detail", checkAdminRole, AdminGetTransactionDetailController ); // admin get transaction detail
router.get("/admin_get_single_transaction_detail", validateTRansactionIdValidationParams, checkAdminRole, AdminGetSingleTransactionDetailController ); // admin get single transaction detail

router.post("/admin_add_question", validateAddQuestionParams, checkAdminRole, AdminAddQuestionlController ); // admin add question
router.get("/admin_get_all_question", checkAdminRole, AdminGetAllQuestionController ); // admin get all question
router.get("/admin_get_single_question", validateQuestionIdValidationParams, checkAdminRole, AdminGetSingleQuestionController ); // admin get single question
router.post("/admin_edit_question", validateEditQuestionParams, checkAdminRole, AdminEditQuestionlController ); // admin edit question
router.post("/admin_delete_question", validateDeleteQuestionValidationParams, checkAdminRole, AdminDeleteQuestionlController ); // admin delete question

router.get("/app_detail", checkAdminRole, AdminGetAppDetailController ); // admin get app detail
router.post("/update_profile", checkAdminRole, upload.single('profileImg'), adminUpdateBioController ); // admin update profile

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


export default router;