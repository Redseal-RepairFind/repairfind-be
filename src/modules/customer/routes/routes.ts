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
import { CustomerStripePaymentController } from "../controllers/customer_stripe_payment.controller";
import { CustomerTransactionController } from "../controllers/customer_transaction.controller";
import { CustomerBookingController } from "../controllers/customer_booking.controller";
import { CustomerCallController } from "../controllers/customer_call.controller";
import { checkCustomerOrGuestRole } from "../middleware/customerOrGuest.middleware";
import { CustomerPaypalPaymentController } from "../controllers/customer_paypal_payment.controller";
import { CustomerPaypalController } from "../controllers/customer_paypal.controller";

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

router.post("/feedback", checkCustomerRole,  CustomerController.submitFeedback ); 
router.post("/abuse-reports", checkCustomerRole, CustomerHttpRequest.CreateAbuseReportRequest,  CustomerController.submitReport ); 
router.post("/block-contractor", checkCustomerRole, CustomerHttpRequest.BlocUserkRequest,  CustomerController.blockUser ); 
router.post("/unblock-contractor", checkCustomerRole, CustomerHttpRequest.BlocUserkRequest,  CustomerController.unBlockUser ); 



router.post("/stripe-account",  checkCustomerRole,  CustomerStripeController.createAccount ); 
router.post("/stripe-payment-methods/:paymentMethodId/detach",  checkCustomerRole,  CustomerStripeController.detachStripePaymentMethod ); 
router.post("/stripe-payment-methods/:paymentMethodId/attach",  checkCustomerRole,  CustomerStripeController.attachStripePaymentMethod ); 
router.post("/stripe-session",  checkCustomerRole, CustomerHttpRequest.createStripeSessionParams, CustomerStripeController.createSession ); 
router.post("/stripe-setupintent",  checkCustomerRole, CustomerStripeController.createSetupIntent ); 

router.post("/paypal/create-payment-method-order", checkCustomerRole, CustomerPaypalController.createPaymentMethodOrder ); 
router.post("/paypal/authorize-payment-method-order", checkCustomerRole, CustomerPaypalController.authorizePaymentMethodOrder ); 
router.get("/paypal/payment-methods", checkCustomerRole, CustomerPaypalController.loadCreatePaymentMethodView ); 
router.delete("/paypal/payment-methods/:vaultId", checkCustomerRole, CustomerPaypalController.deletePaypalPaymentMethod ); 

// Explore Contractors
router.get("/explore/contractors", checkCustomerOrGuestRole, CustomerHttpRequest.queryContractorParams, CustomerExploreController.exploreContractors ); 
router.get("/explore/contractors/favorites", checkCustomerRole, CustomerExploreController.getFavoriteContractors ); 
router.get("/explore/contractors/:contractorId", checkCustomerOrGuestRole,  CustomerExploreController.getSingleContractor ); 
router.get("/explore/contractors/:contractorId/schedules", checkCustomerOrGuestRole, CustomerExploreController.getContractorSchedules ); 
router.get("/explore/contractors/:contractorId/reviews", checkCustomerOrGuestRole, CustomerExploreController.getContractorReviews ); 


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
router.post("/jobs/:jobId/quotations/:quotationId/schedule", checkCustomerRole, CustomerJobController.scheduleJob ); 



router.post("/jobs/:jobId/paypal/create-checkout-order", checkCustomerRole, CustomerPaypalPaymentController.createCheckoutOrder ); 
router.post("/jobs/:jobId/paypal/capture-checkout-order", checkCustomerRole, CustomerPaypalPaymentController.captureCheckoutOrder ); 
router.post("/jobs/:jobId/paypal/pay", checkCustomerRole, CustomerPaypalPaymentController.payJobEstimate ); 
router.post("/jobs/:jobId/paypal/pay-change-order", checkCustomerRole, CustomerPaypalPaymentController.payChangeOrderEstimate ); 


router.post("/jobs/:jobId/pay", checkCustomerRole, CustomerStripePaymentController.makeJobPayment ); 
router.post("/jobs/:jobId/payment-capture", checkCustomerRole, CustomerStripePaymentController.captureJobPayment ); 
router.post("/jobs/:jobId/change-order-payment", checkCustomerRole, CustomerStripePaymentController.makeChangeOrderEstimatePayment ); 


router.get("/jobs/:jobId/enquiries", checkCustomerRole, CustomerJobController.getJobEnquiries ); 
router.get("/jobs/:jobId/enquiries/:enquiryId", checkCustomerRole, CustomerJobController.getJobSingleEnquiry ); 
router.post("/jobs/:jobId/enquiry-reply", checkCustomerRole, CustomerJobController.replyJobEnquiry ); 
router.get('/quotations', checkCustomerRole, CustomerJobController.getAllQuotations) // 
router.post("/quotations/:quotationId/apply-coupon", checkCustomerRole, CustomerJobController.applyCouponToJobQuotation ); 
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
router.post("/bookings/:bookingId/emergency", checkCustomerRole,  CustomerHttpRequest.createJobDisputeParams,  CustomerBookingController.createJobEmergency ); 
router.post("/bookings/:bookingId/refund", checkCustomerRole, CustomerBookingController.requestBookingRefund ); 
router.post("/bookings/:bookingId/reschedule/:action", checkCustomerRole, CustomerBookingController.acceptOrDeclineReschedule ); 


// Transactions
router.get("/transactions", checkCustomerRole, CustomerTransactionController.getTransactions ); 
router.get("/transactions/summary", checkCustomerRole, CustomerTransactionController.getTransactionSummary);
router.get("/transactions/:transactionId", checkCustomerRole, CustomerTransactionController.getSingleTransaction);




// Notifications
router.get('/notifications', checkCustomerRole, CustomerNotificationController.getNotifications)
router.get('/notifications/alerts', checkCustomerRole, CustomerNotificationController.redAlerts)
router.get('/notifications/:notificationId', checkCustomerRole, CustomerNotificationController.getSingleNotification)
router.post('/notifications/mark-all-read', checkCustomerRole, CustomerNotificationController.markAllNotificationsAsRead)
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
router.get("/voicecall/lastcall", checkCustomerRole,  CustomerCallController.getLastCall );

router.get("/voicecall/:callId", checkCustomerRole,  CustomerCallController.getSingleCall );
router.post("/voicecall/:callId/end", checkCustomerRole,  CustomerCallController.endCall );


export default router;