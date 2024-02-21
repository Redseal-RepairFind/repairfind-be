import { contractorViewNotificationrController } from "../../contractor/controllers/contractorNotification.controller";
import { memoryUpload } from "../../../utils/upload.utility";
import { customerEmailForgotPasswordController, customerEmailResetPasswordController } from "../controllers/customerForgotPassword.controller";
import { customerAcceptAndPayForJobController, customerComfirmedJobJobController, customerComplaintedJobJobController, customerGetAllSetJobController, customerGetComfirmJobController, customerGetComletedByContractorController, customerGetComplainJobController, customerGetJobQoutationController, customerGetJobQoutationPaymentConfirmAndJobInProgressController, customerGetJobQoutationPaymentOpenController, customerGetJobRejectedontroller, customerJobRequestSentToContractorController, customerSendJobToContractorController, customerVerififyPaymentForJobController } from "../controllers/customerJob.controller";
import { customerGetNotificationrController, customerUnseenNotificationrController, customerViewNotificationrController } from "../controllers/customerNotification.controller";
import { customerComfirmInpectionMonneyCheckoutContractorController, customerGetJobInspectionPaymentOpenController, customerInpectionMonneyCheckoutContractorController, webhook, } from "../controllers/customerPayment.controller";
import { CustomerResendEmailController, CustomerUpdateProfileController, customerSignInController, customerSignUpController, customerVerifiedEmailController } from "../controllers/customerReg.controller";
import { customerGetAllContractorOnSkillController, customerGetPopularContractorController, customerGetSingleContractorOnSkillController, customerSearchForContractorController } from "../controllers/lookForContractor.controller";
import { customerRateContractorController, customerRatingDetailController } from "../controllers/ratingContractor.controller";
import { checkCustomerRole } from "../middleware/customerRoleChecker.middleware";
import { validateAcceptAndPayParams, validateComfirmInspectionPaymentParams, validateComfirmPaymentParams, validateContractorSearckParams, validateCustomerGetContractorParams, validateCustomerRateContractorParams, validateCustomerUpdateProfileParams, validateSignupParams, validatecustomeLoginParams, validatecustomerEmailverificationParams, validatecustomerForgotPasswordParams, validatecustomerResetPasswprdParams } from "../middleware/requestValidate.middleware";

const express = require("express");
const router = express.Router();


router.post("/signup", validateSignupParams, customerSignUpController ); // customer signup
router.post("/email-verification", validatecustomerEmailverificationParams, customerVerifiedEmailController ); // customer verified email
router.post("/resend-email-verification", validatecustomerForgotPasswordParams, CustomerResendEmailController ); // customer resend email
router.post("/login", validatecustomeLoginParams, customerSignInController ); // customer login
router.post("/forgot-password", validatecustomerForgotPasswordParams, customerEmailForgotPasswordController ); // customer forgot passwor
router.post("/reset-password", validatecustomerResetPasswprdParams, customerEmailResetPasswordController ); // customer reset password
router.post("/update-profile", checkCustomerRole, memoryUpload.single('profileImg'), CustomerUpdateProfileController ); // customer update is profile


router.get("/get_popular_contractor", checkCustomerRole, customerGetPopularContractorController ); // customer get popular contractor
router.get("/search_contractor", checkCustomerRole, customerSearchForContractorController ); // customer search contractor
router.get("/get_all_contractor_on_skill", validateContractorSearckParams, checkCustomerRole, customerGetAllContractorOnSkillController ); // customer get all contractor on a skill
router.get("/customer_get_single_contractor", validateCustomerGetContractorParams, checkCustomerRole, customerGetSingleContractorOnSkillController ); // customer get single contractor on a skill

router.post("/customer_send_job",checkCustomerRole, memoryUpload.any(), customerSendJobToContractorController ); // customer send job request
router.get("/customer_get_job_request",checkCustomerRole, customerJobRequestSentToContractorController ); // customer get job that he send request
router.get("/customer_get_job_qoutation", checkCustomerRole, customerGetJobQoutationController ); // customer get job that qoutation was sent
router.post("/customer_accept_and_pay", checkCustomerRole, validateAcceptAndPayParams, customerAcceptAndPayForJobController ); // customer accept and pay
router.get("/customer_get_job_qoutation_payment_open", checkCustomerRole, customerGetJobQoutationPaymentOpenController ); // customer get job that qoutation payment is open
router.post("/customer_comfirm_payment", checkCustomerRole, validateComfirmPaymentParams, customerVerififyPaymentForJobController ); // customer comfirm payment
router.get("/customer_get_job_qoutation_payment_comfirm_and_job_in_progress", checkCustomerRole, customerGetJobQoutationPaymentConfirmAndJobInProgressController ); // customer get job that qoutation payment is comfirm and job in progress
router.get("/customer_get_job_rejected", checkCustomerRole, customerGetJobRejectedontroller ); // customer get job requested rejected
router.get("/customer_get_job_complete_by_contractor", checkCustomerRole, customerGetComletedByContractorController ); // get jon comleted by contractoe
router.post("/customer_comfirm_job", checkCustomerRole, validateAcceptAndPayParams, customerComfirmedJobJobController ); // customer comfirm job completed by contractor
router.get("/customer_get_job_comfirm", checkCustomerRole, customerGetComfirmJobController ); // customer get job comfirm
router.post("/customer_complain_job", checkCustomerRole, validateAcceptAndPayParams, customerComplaintedJobJobController ); // customer complain about job completed by contractor
router.get("/customer_get_job_complain", checkCustomerRole, customerGetComplainJobController ); // customer get job complain


router.get("/customer_get_jobs_history",checkCustomerRole, customerGetAllSetJobController ); // customer get all  job history


router.post("/customer_pay_inspection_fees_checkout", checkCustomerRole, memoryUpload.any(),  customerInpectionMonneyCheckoutContractorController ); // customer pay for inspection
router.post("/customer_comfirm_inspection_inspection_fees", checkCustomerRole, validateComfirmInspectionPaymentParams, customerComfirmInpectionMonneyCheckoutContractorController ); // customer comfirm inspection money
router.get("/customer_get_inspection_payment_open", checkCustomerRole, customerGetJobInspectionPaymentOpenController ); // customer get inspection payment open

router.post("/webhook", webhook ); // web hook

router.get("/get_all_notification", checkCustomerRole,  customerGetNotificationrController ); // customer get all notification
router.post("/view_unseen_notification", checkCustomerRole,  customerViewNotificationrController ); // customer view unseen notification
router.get("/get_unseen_notification", checkCustomerRole,  customerUnseenNotificationrController  ); // customer get total number of unseen notification

router.post("/rate_contarctor", checkCustomerRole, validateCustomerRateContractorParams,  customerRateContractorController  ); // customer rate contractor
router.get("/customer_rating_detail", checkCustomerRole,  customerRatingDetailController  ); // customer rating detail


export default router;