import { CustomerAuthController } from "../controllers/customer_auth.controller";
import { checkCustomerRole } from "../middleware/customerRoleChecker.middleware";
import { CustomerHttpRequest } from "../requests";
import { CustomerController } from "../controllers/customer.controller";
import { CustomerStripeController } from "../controllers/customer_stripe.controller";
import { ContractorSearch } from "../controllers/customer_contractorSearch.controller";
import { memoryUpload } from "../.../../../../utils/upload.utility";
import { CustomerExploreController } from "../controllers/customer_explore.controller";
import { CustomerJobController } from "../controllers/customer_job.controller";
import { CustomerNotificationController } from "../controllers/customer_notification.controller";
import { CustomerConversationController } from "../controllers/customer_conversation.controller";
import { CustomerJobDayController } from "../controllers/customer_jobday.controller";
import { CustomerPaymentController } from "../controllers/customer_payment.controller";
import { CustomerTransactionController } from "../controllers/customer_transaction.controller";
import { CustomerBookingController } from "../controllers/customer_booking.controller";
import { CustomerCallController } from "../controllers/customer_call.controller";

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
router.post("/apple-signon", CustomerHttpRequest.verifySocialSignon,  CustomerAuthController.appleSignon ); // verify password reset opt


//  Account
router.patch("/me", checkCustomerRole, CustomerController.updateAccount ); // customer update account
router.get("/me", checkCustomerRole, CustomerController.getAccount ); // 
router.post("/me/change-password", checkCustomerRole, CustomerHttpRequest.changePasswordParams,  CustomerController.changePassword ); 
router.post("/me/devices", checkCustomerRole, CustomerHttpRequest.UpdateOrDeviceParams,  CustomerController.updateOrCreateDevice ); 
router.get("/me/devices", checkCustomerRole,  CustomerController.myDevices ); 
router.delete("/me", checkCustomerRole,  CustomerController.deleteAccount ); 



router.post("/stripe-account",  checkCustomerRole,  CustomerStripeController.createAccount ); 
router.post("/stripe-payment-methods/:paymentMethodId/detach",  checkCustomerRole,  CustomerStripeController.detachStripePaymentMethod ); 
router.post("/stripe-payment-methods/:paymentMethodId/attach",  checkCustomerRole,  CustomerStripeController.attachStripePaymentMethod ); 
router.post("/stripe-session",  checkCustomerRole, CustomerHttpRequest.createStripeSessionParams, CustomerStripeController.createSession ); 
router.post("/stripe-setupintent",  checkCustomerRole, CustomerStripeController.createSetupIntent ); 


// Explore Contractors
router.get("/explore/contractors", checkCustomerRole, CustomerHttpRequest.queryContractorParams, CustomerExploreController.exploreContractors ); 
router.get("/explore/contractors/favorites", checkCustomerRole, CustomerExploreController.getFavoriteContractors ); 
router.get("/explore/contractors/:contractorId", checkCustomerRole,  CustomerExploreController.getSingleContractor ); 
router.get("/explore/contractors/:contractorId/schedules", checkCustomerRole, CustomerExploreController.getContractorSchedules ); 
router.get("/explore/contractors/:contractorId/reviews", checkCustomerRole, CustomerExploreController.getContractorReviews ); 


// JOB
router.post("/jobs/requests", checkCustomerRole, CustomerHttpRequest.createJobRequestParams, CustomerJobController.createJobRequest ); 
router.post("/jobs/listings", checkCustomerRole, CustomerHttpRequest.createJoListingParams, CustomerJobController.createJobListing ); 
router.get("/jobs", checkCustomerRole, CustomerJobController.getMyJobs ); 
router.get("/jobs/history", checkCustomerRole, CustomerJobController.getJobHistory ); 
router.get("/jobs/:jobId", checkCustomerRole, CustomerJobController.getSingleJob ); 
router.get("/jobs/:jobId/quotations", checkCustomerRole, CustomerJobController.getJobQuotations ); 
router.get("/jobs/:jobId/quotations/:quotationId", checkCustomerRole, CustomerJobController.getSingleQuotation ); 
router.post("/jobs/:jobId/quotations/:quotationId/accept", checkCustomerRole, CustomerJobController.acceptJobQuotation ); 
router.post("/jobs/:jobId/quotations/:quotationId/decline", checkCustomerRole, CustomerJobController.declineJobQuotation ); 
router.post("/jobs/:jobId/pay", checkCustomerRole, CustomerPaymentController.makeJobPayment ); 
router.post("/jobs/:jobId/payment-capture", checkCustomerRole, CustomerPaymentController.captureJobPayment ); 


// BOOKING
router.get("/bookings", checkCustomerRole, CustomerBookingController.getMyBookings ); 
router.get("/bookings/history", checkCustomerRole, CustomerBookingController.getBookingHistory ); 
router.get("/bookings/disputes", checkCustomerRole, CustomerBookingController.getBookingDisputes ); 
router.get("/bookings/:bookingId", checkCustomerRole, CustomerBookingController.getSingleBooking ); 
router.post("/bookings/:bookingId/cancel", checkCustomerRole, CustomerBookingController.cancelBooking ); 
router.post("/bookings/:bookingId/initiate-cancel", checkCustomerRole, CustomerBookingController.intiateBookingCancelation ); 
router.post("/bookings/:bookingId/change-order-toggle", checkCustomerRole, CustomerBookingController.toggleChangeOrder ); 
router.post("/bookings/:bookingId/mark-complete", checkCustomerRole, CustomerBookingController.acceptBookingComplete ); 
router.post("/bookings/:bookingId/review", checkCustomerRole, CustomerBookingController.reviewBookingOnCompletion ); 
router.post("/bookings/:bookingId/reschedule", checkCustomerRole, CustomerBookingController.requestBookingReschedule ); 
router.post("/bookings/:bookingId/reschedule/:action", checkCustomerRole, CustomerBookingController.acceptOrDeclineReschedule ); 


// Transactions
router.get("/transactions", checkCustomerRole, CustomerTransactionController.getTransactions ); 
router.get("/transactions/summary", checkCustomerRole, CustomerTransactionController.getTransactionSummary);
router.get("/transactions/:transactionId", checkCustomerRole, CustomerTransactionController.getSingleTransaction);




// Notifications
router.get('/notifications', checkCustomerRole, CustomerNotificationController.getNotifications)
router.get('/notifications/:notificationId', checkCustomerRole, CustomerNotificationController.getSingleNotification)
router.post('/notifications/:notificationId', checkCustomerRole, CustomerNotificationController.markNotificationAsRead)


// Conversations
router.get('/conversations', checkCustomerRole, CustomerConversationController.getConversations)
router.get('/conversations/:conversationId', checkCustomerRole, CustomerConversationController.getSingleConversation)
router.get('/conversations/:conversationId/messages', checkCustomerRole, CustomerConversationController.getConversationMessages)
router.post('/conversations/:conversationId/messages', checkCustomerRole, CustomerHttpRequest.sendMessageParams, CustomerConversationController.sendMessage)
router.post('/conversations/:conversationId/mark-all-read', checkCustomerRole, CustomerConversationController.markAllMessagesAsRead)

// jobdays day
router.post('/jobdays/:jobDayId/confirm-arrival', checkCustomerRole, CustomerHttpRequest.tripArrivalComfirmParams, CustomerJobDayController.confirmContractorArrival)
router.post('/jobdays/:jobDayId/emergency', checkCustomerRole, CustomerHttpRequest.tripArrivalComfirmParams, CustomerJobDayController.createJobEmergency)
router.post('/jobdays/:jobDayId/dispute', checkCustomerRole, CustomerHttpRequest.createJobDisputeParams, CustomerJobDayController.createJobDispute)
router.post('/jobdays/:jobDayId/post-quality-assurance', checkCustomerRole,  CustomerJobDayController.savePostJobQualityAssurance)
router.post('/jobdays/:jobDayId/pre-quality-assurance', checkCustomerRole,  CustomerJobDayController.savePreJobJobQualityAssurance)
router.post('/jobdays/initiate', checkCustomerRole, CustomerJobDayController.initiateJobDay)


// Call
router.post("/voicecall/agora-rtc", checkCustomerRole,  CustomerCallController.createRtcToken );
router.post("/voicecall", checkCustomerRole,  CustomerCallController.startCall );
router.post("/voicecall/:callId/end", checkCustomerRole,  CustomerCallController.endCall );


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