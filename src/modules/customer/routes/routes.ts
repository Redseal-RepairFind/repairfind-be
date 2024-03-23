import { CustomerAuthController } from "../controllers/customer_auth.controller";
import { checkCustomerRole } from "../middleware/customerRoleChecker.middleware";
import { CustomerHttpRequest } from "../requests";
import { CustomerController } from "../controllers/customer.controller";
import { CustomerStripeController } from "../controllers/customer_stripe.controller";
import { JobListing } from "../controllers/customerJobListing.controller";
import { ContractorSearch } from "../controllers/customer_contractorSearch.controller";
import { memoryUpload } from "../.../../../../utils/upload.utility";
import { JobRequest } from "../controllers/job_request.controller";

const express = require("express");
const router = express.Router();


// Auth
router.post("/signup", CustomerHttpRequest.signupParams, CustomerAuthController.signUp ); // customer signup
router.post("/login", CustomerHttpRequest.loginParams, CustomerAuthController.signIn ); // customer signup
router.post("/email-verification", CustomerHttpRequest.emailVerificationParams, CustomerAuthController.verifyEmail ); // customer verified email
router.post("/resend-email-verification", CustomerHttpRequest.forgotPasswordParams, CustomerAuthController.resendEmail ); // customer resend email
router.post("/forgot-password", CustomerHttpRequest.forgotPasswordParams, CustomerAuthController.forgotPassword ); // customer forgot passwor
router.post("/reset-password", CustomerHttpRequest.resetPasswordParams, CustomerAuthController.resetPassword  ); // customer reset password
router.post("/reset-password-verification", CustomerHttpRequest.verifyPasswordOtpParams,  CustomerAuthController.verifyResetPasswordOtp ); // verify password reset opt
router.post("/google-signon", CustomerHttpRequest.verifySocialSignon,  CustomerAuthController.googleSignon ); // verify password reset opt
router.post("/facebook-signon", CustomerHttpRequest.verifySocialSignon,  CustomerAuthController.facebookSignon ); // verify password reset opt


//  Account
router.patch("/me", checkCustomerRole, CustomerController.updateAccount ); // customer update account
router.get("/me", checkCustomerRole, CustomerController.getAccount ); // 
router.post("/me/change-password", checkCustomerRole, CustomerHttpRequest.changePasswordParams,  CustomerController.changePassword ); 
router.post("/me/devices", checkCustomerRole, CustomerHttpRequest.UpdateOrDeviceParams,  CustomerController.updateOrCreateDevice ); 
router.get("/me/devices", checkCustomerRole,  CustomerController.myDevices ); 



router.post("/stripe-account",  checkCustomerRole,  CustomerStripeController.createAccount ); 
router.post("/stripe-session",  checkCustomerRole, CustomerHttpRequest.createStripeSessionParams, CustomerStripeController.createSession ); 
router.post("/stripe-setupintent",  checkCustomerRole, CustomerStripeController.createSetupIntent ); 


// Job Listing
router.post("/job-listing", checkCustomerRole, memoryUpload.any(), CustomerHttpRequest.jobListingParams, CustomerHttpRequest.validateFormData, JobListing.customerListNewJobController ); 

// search for contractor
router.get("/search-contractor-location", checkCustomerRole, CustomerHttpRequest.searchContractorByLocationParams, CustomerHttpRequest.validateFormData, ContractorSearch.customerSearchForContractorByLocatinController ); 
router.get("/search-contractor-category-date", checkCustomerRole, CustomerHttpRequest.searchContractorByCategoryDateParams, CustomerHttpRequest.validateFormData, ContractorSearch.customerSearchForContractorByCategoryAndDateController ); 
router.get("/search-category", checkCustomerRole, CustomerHttpRequest.searchCategoryDateParams, CustomerHttpRequest.validateFormData, ContractorSearch.customerSearchForCategoryController ); 
router.get("/filter-contractor", checkCustomerRole, CustomerHttpRequest.filterContractorParams, CustomerHttpRequest.validateFormData, ContractorSearch.customerFilterContractoController ); 


//job request
router.post("/send-job-request", checkCustomerRole, memoryUpload.any(), CustomerHttpRequest.sendJobRequestParams, CustomerHttpRequest.validateFormData, JobRequest.customerSendJobRequestController ); 



router.post("/jobs", checkCustomerRole, CustomerHttpRequest.sendJobRequestParams, CustomerHttpRequest.validateFormData, JobRequest.customerSendJobRequestController ); 


// router.get("/get_popular_contractor", checkCustomerRole, customerGetPopularContractorController ); // customer get popular contractor
// router.get("/search_contractor", checkCustomerRole, customerSearchForContractorController ); // customer search contractor
// router.get("/get_all_contractor_on_skill", validateContractorSearckParams, checkCustomerRole, customerGetAllContractorOnSkillController ); // customer get all contractor on a skill
// router.get("/customer_get_single_contractor", validateCustomerGetContractorParams, checkCustomerRole, customerGetSingleContractorOnSkillController ); // customer get single contractor on a skill

// router.post("/customer_send_job",checkCustomerRole, memoryUpload.any(), customerSendJobToContractorController ); // customer send job request
// router.get("/customer_get_job_request",checkCustomerRole, customerJobRequestSentToContractorController ); // customer get job that he send request
// router.get("/customer_get_job_qoutation", checkCustomerRole, customerGetJobQoutationController ); // customer get job that qoutation was sent
// router.post("/customer_accept_and_pay", checkCustomerRole, validateAcceptAndPayParams, customerAcceptAndPayForJobController ); // customer accept and pay
// router.get("/customer_get_job_qoutation_payment_open", checkCustomerRole, customerGetJobQoutationPaymentOpenController ); // customer get job that qoutation payment is open
// router.post("/customer_comfirm_payment", checkCustomerRole, validateComfirmPaymentParams, customerVerififyPaymentForJobController ); // customer comfirm payment
// router.get("/customer_get_job_qoutation_payment_comfirm_and_job_in_progress", checkCustomerRole, customerGetJobQoutationPaymentConfirmAndJobInProgressController ); // customer get job that qoutation payment is comfirm and job in progress
// router.get("/customer_get_job_rejected", checkCustomerRole, customerGetJobRejectedontroller ); // customer get job requested rejected
// router.get("/customer_get_job_complete_by_contractor", checkCustomerRole, customerGetComletedByContractorController ); // get jon comleted by contractoe
// router.post("/customer_comfirm_job", checkCustomerRole, validateAcceptAndPayParams, customerComfirmedJobJobController ); // customer comfirm job completed by contractor
// router.get("/customer_get_job_comfirm", checkCustomerRole, customerGetComfirmJobController ); // customer get job comfirm
// router.post("/customer_complain_job", checkCustomerRole, validateAcceptAndPayParams, customerComplaintedJobJobController ); // customer complain about job completed by contractor
// router.get("/customer_get_job_complain", checkCustomerRole, customerGetComplainJobController ); // customer get job complain


// router.get("/customer_get_jobs_history",checkCustomerRole, customerGetAllSetJobController ); // customer get all  job history


// router.post("/customer_pay_inspection_fees_checkout", checkCustomerRole, memoryUpload.any(),  customerInpectionMonneyCheckoutContractorController ); // customer pay for inspection
// router.post("/customer_comfirm_inspection_inspection_fees", checkCustomerRole, validateComfirmInspectionPaymentParams, customerComfirmInpectionMonneyCheckoutContractorController ); // customer comfirm inspection money
// router.get("/customer_get_inspection_payment_open", checkCustomerRole, customerGetJobInspectionPaymentOpenController ); // customer get inspection payment open

// router.post("/webhook", webhook ); // web hook

// router.get("/get_all_notification", checkCustomerRole,  customerGetNotificationrController ); // customer get all notification
// router.post("/view_unseen_notification", checkCustomerRole,  customerViewNotificationrController ); // customer view unseen notification
// router.get("/get_unseen_notification", checkCustomerRole,  customerUnseenNotificationrController  ); // customer get total number of unseen notification

// router.post("/rate_contarctor", checkCustomerRole, validateCustomerRateContractorParams,  customerRateContractorController  ); // customer rate contractor
// router.get("/customer_rating_detail", checkCustomerRole,  customerRatingDetailController  ); // customer rating detail


export default router;