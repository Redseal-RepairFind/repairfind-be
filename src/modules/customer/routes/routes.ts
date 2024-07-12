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
router.post("/login-phone", CustomerHttpRequest.loginWithPhoneParams, CustomerAuthController.signInWithPhone ); // customer signup
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
router.post("/signout", checkCustomerRole,  CustomerController.signOut ); 



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
router.post("/jobs/:jobId/change-order-payment", checkCustomerRole, CustomerPaymentController.makeChangeOrderEstimatePayment ); 
router.get('/quotations/:quotationId', checkCustomerRole, CustomerJobController.getQuotation) // 


// BOOKING
router.get("/bookings", checkCustomerRole, CustomerBookingController.getMyBookings ); 
router.get("/bookings/history", checkCustomerRole, CustomerBookingController.getBookingHistory ); 
router.get("/bookings/disputes", checkCustomerRole, CustomerBookingController.getBookingDisputes ); 
router.get("/bookings/:bookingId", checkCustomerRole, CustomerBookingController.getSingleBooking ); 
router.post("/bookings/:bookingId/cancel", checkCustomerRole, CustomerBookingController.cancelBooking ); 
router.post("/bookings/:bookingId/initiate-cancel", checkCustomerRole, CustomerBookingController.getRefundable ); 
router.post("/bookings/:bookingId/change-order-toggle", checkCustomerRole, CustomerBookingController.toggleChangeOrder ); 
router.post("/bookings/:bookingId/mark-complete", checkCustomerRole, CustomerBookingController.acceptBookingComplete ); 
router.post("/bookings/:bookingId/review", checkCustomerRole, CustomerBookingController.reviewBookingOnCompletion ); 
router.post("/bookings/:bookingId/reschedule", checkCustomerRole, CustomerBookingController.requestBookingReschedule ); 
router.post("/bookings/:bookingId/dispute", checkCustomerRole,  CustomerHttpRequest.createJobDisputeParams,  CustomerBookingController.createBookingDispute ); 
router.post("/bookings/:bookingId/refund", checkCustomerRole, CustomerBookingController.requestBookingRefund ); 
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
router.post('/jobdays/:jobDayId/confirm-completion', checkCustomerRole, CustomerHttpRequest.createJobDisputeParams, CustomerJobDayController.confirmJobDayCompletion)
router.post('/jobdays/:jobDayId/post-quality-assurance', checkCustomerRole,  CustomerJobDayController.savePostJobQualityAssurance)
router.post('/jobdays/:jobDayId/pre-quality-assurance', checkCustomerRole,  CustomerJobDayController.savePreJobJobQualityAssurance)
router.post('/jobdays/initiate', checkCustomerRole, CustomerJobDayController.initiateJobDay)


// Call
router.post("/voicecall/agora-rtc", checkCustomerRole,  CustomerCallController.createRtcToken );
router.post("/voicecall", checkCustomerRole,  CustomerCallController.startCall );
router.post("/voicecall/:callId/end", checkCustomerRole,  CustomerCallController.endCall );


export default router;