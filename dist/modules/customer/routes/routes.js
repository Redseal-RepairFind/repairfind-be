"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var customer_auth_controller_1 = require("../controllers/customer_auth.controller");
var customerRoleChecker_middleware_1 = require("../middleware/customerRoleChecker.middleware");
var requests_1 = require("../requests");
var customer_controller_1 = require("../controllers/customer.controller");
var customer_stripe_controller_1 = require("../controllers/customer_stripe.controller");
var customer_explore_controller_1 = require("../controllers/customer_explore.controller");
var customer_job_controller_1 = require("../controllers/customer_job.controller");
var customer_notification_controller_1 = require("../controllers/customer_notification.controller");
var customer_conversation_controller_1 = require("../controllers/customer_conversation.controller");
var customer_jobday_controller_1 = require("../controllers/customer_jobday.controller");
var customer_payment_controller_1 = require("../controllers/customer_payment.controller");
var customer_transaction_controller_1 = require("../controllers/customer_transaction.controller");
var customer_booking_controller_1 = require("../controllers/customer_booking.controller");
var customer_call_controller_1 = require("../controllers/customer_call.controller");
var express = require("express");
var router = express.Router();
// Auth
router.post("/signup", requests_1.CustomerHttpRequest.signupParams, customer_auth_controller_1.CustomerAuthController.signUp); // customer signup
router.post("/login", requests_1.CustomerHttpRequest.loginParams, customer_auth_controller_1.CustomerAuthController.signIn); // customer signup
router.post("/login-phone", requests_1.CustomerHttpRequest.loginWithPhoneParams, customer_auth_controller_1.CustomerAuthController.signInWithPhone); // customer signup
router.post("/email-verification", requests_1.CustomerHttpRequest.emailVerificationParams, customer_auth_controller_1.CustomerAuthController.verifyEmail); // customer verified email
router.post("/resend-email-verification", requests_1.CustomerHttpRequest.forgotPasswordParams, customer_auth_controller_1.CustomerAuthController.resendEmail); // customer resend email
router.post("/forgot-password", requests_1.CustomerHttpRequest.forgotPasswordParams, customer_auth_controller_1.CustomerAuthController.forgotPassword); // customer forgot passwor
router.post("/reset-password", requests_1.CustomerHttpRequest.resetPasswordParams, customer_auth_controller_1.CustomerAuthController.resetPassword); // customer reset password
router.post("/reset-password-verification", requests_1.CustomerHttpRequest.verifyPasswordOtpParams, customer_auth_controller_1.CustomerAuthController.verifyResetPasswordOtp); // verify password reset opt
router.post("/google-signon", requests_1.CustomerHttpRequest.verifySocialSignon, customer_auth_controller_1.CustomerAuthController.googleSignon); // verify password reset opt
router.post("/facebook-signon", requests_1.CustomerHttpRequest.verifySocialSignon, customer_auth_controller_1.CustomerAuthController.facebookSignon); // verify password reset opt
router.post("/apple-signon", requests_1.CustomerHttpRequest.verifySocialSignon, customer_auth_controller_1.CustomerAuthController.appleSignon); // verify password reset opt
//  Account
router.patch("/me", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.updateAccount); // customer update account
router.get("/me", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.getAccount); // 
router.post("/me/change-password", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.changePasswordParams, customer_controller_1.CustomerController.changePassword);
router.post("/me/devices", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.UpdateOrDeviceParams, customer_controller_1.CustomerController.updateOrCreateDevice);
router.get("/me/devices", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.myDevices);
router.delete("/me", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.deleteAccount);
router.post("/signout", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.signOut);
router.post("/feedback", customerRoleChecker_middleware_1.checkCustomerRole, customer_controller_1.CustomerController.submitFeedback);
router.post("/stripe-account", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.createAccount);
router.post("/stripe-payment-methods/:paymentMethodId/detach", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.detachStripePaymentMethod);
router.post("/stripe-payment-methods/:paymentMethodId/attach", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.attachStripePaymentMethod);
router.post("/stripe-session", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createStripeSessionParams, customer_stripe_controller_1.CustomerStripeController.createSession);
router.post("/stripe-setupintent", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.createSetupIntent);
// Explore Contractors
router.get("/explore/contractors", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.queryContractorParams, customer_explore_controller_1.CustomerExploreController.exploreContractors);
router.get("/explore/contractors/favorites", customerRoleChecker_middleware_1.checkCustomerRole, customer_explore_controller_1.CustomerExploreController.getFavoriteContractors);
router.get("/explore/contractors/:contractorId", customerRoleChecker_middleware_1.checkCustomerRole, customer_explore_controller_1.CustomerExploreController.getSingleContractor);
router.get("/explore/contractors/:contractorId/schedules", customerRoleChecker_middleware_1.checkCustomerRole, customer_explore_controller_1.CustomerExploreController.getContractorSchedules);
router.get("/explore/contractors/:contractorId/reviews", customerRoleChecker_middleware_1.checkCustomerRole, customer_explore_controller_1.CustomerExploreController.getContractorReviews);
// JOB
router.post("/jobs/requests", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createJobRequestParams, customer_job_controller_1.CustomerJobController.createJobRequest);
router.post("/jobs/listings", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createJoListingParams, customer_job_controller_1.CustomerJobController.createJobListing);
router.get("/jobs", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getMyJobs);
router.get("/jobs/history", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getJobHistory);
router.get("/jobs/:jobId", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getSingleJob);
router.get("/jobs/:jobId/quotations", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getJobQuotations);
router.get("/jobs/:jobId/quotations/:quotationId", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getSingleQuotation);
router.post("/jobs/:jobId/quotations/:quotationId/accept", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.acceptJobQuotation);
router.post("/jobs/:jobId/quotations/:quotationId/decline", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.declineJobQuotation);
router.post("/jobs/:jobId/quotations/:quotationId/schedule", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.scheduleJob);
router.post("/jobs/:jobId/pay", customerRoleChecker_middleware_1.checkCustomerRole, customer_payment_controller_1.CustomerPaymentController.makeJobPayment);
router.post("/jobs/:jobId/payment-capture", customerRoleChecker_middleware_1.checkCustomerRole, customer_payment_controller_1.CustomerPaymentController.captureJobPayment);
router.post("/jobs/:jobId/change-order-payment", customerRoleChecker_middleware_1.checkCustomerRole, customer_payment_controller_1.CustomerPaymentController.makeChangeOrderEstimatePayment);
router.get("/jobs/:jobId/enquiries", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getJobEnquiries);
router.get("/jobs/:jobId/enquiries/:enquiryId", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getJobSingleEnquiry);
router.post("/jobs/:jobId/enquiry-reply", customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.replyJobEnquiry);
router.get('/quotations', customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getAllQuotations); // 
router.get('/quotations/:quotationId', customerRoleChecker_middleware_1.checkCustomerRole, customer_job_controller_1.CustomerJobController.getQuotation); // 
// BOOKING
router.get("/bookings", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getMyBookings);
router.get("/bookings/history", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getBookingHistory);
router.get("/bookings/disputes", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getBookingDisputes);
router.get("/bookings/:bookingId", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getSingleBooking);
router.post("/bookings/:bookingId/cancel", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.cancelBooking);
router.post("/bookings/:bookingId/initiate-cancel", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getRefundable);
router.post("/bookings/:bookingId/change-order-toggle", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.toggleChangeOrder);
router.post("/bookings/:bookingId/mark-complete", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.acceptBookingComplete);
router.post("/bookings/:bookingId/review", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.reviewBookingOnCompletion);
router.post("/bookings/:bookingId/reschedule", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.requestBookingReschedule);
router.post("/bookings/:bookingId/dispute", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createJobDisputeParams, customer_booking_controller_1.CustomerBookingController.createBookingDispute);
router.post("/bookings/:bookingId/emergency", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createJobDisputeParams, customer_booking_controller_1.CustomerBookingController.createJobEmergency);
router.post("/bookings/:bookingId/refund", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.requestBookingRefund);
router.post("/bookings/:bookingId/reschedule/:action", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.acceptOrDeclineReschedule);
// Transactions
router.get("/transactions", customerRoleChecker_middleware_1.checkCustomerRole, customer_transaction_controller_1.CustomerTransactionController.getTransactions);
router.get("/transactions/summary", customerRoleChecker_middleware_1.checkCustomerRole, customer_transaction_controller_1.CustomerTransactionController.getTransactionSummary);
router.get("/transactions/:transactionId", customerRoleChecker_middleware_1.checkCustomerRole, customer_transaction_controller_1.CustomerTransactionController.getSingleTransaction);
// Notifications
router.get('/notifications', customerRoleChecker_middleware_1.checkCustomerRole, customer_notification_controller_1.CustomerNotificationController.getNotifications);
router.get('/notifications/:notificationId', customerRoleChecker_middleware_1.checkCustomerRole, customer_notification_controller_1.CustomerNotificationController.getSingleNotification);
router.post('/notifications/mark-all-read', customerRoleChecker_middleware_1.checkCustomerRole, customer_notification_controller_1.CustomerNotificationController.markAllNotificationsAsRead);
router.post('/notifications/:notificationId', customerRoleChecker_middleware_1.checkCustomerRole, customer_notification_controller_1.CustomerNotificationController.markNotificationAsRead);
// Conversations
router.get('/conversations', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.getConversations);
router.get('/conversations/:conversationId', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.getSingleConversation);
router.get('/conversations/:conversationId/messages', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.getConversationMessages);
router.post('/conversations/:conversationId/messages', customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.sendMessageParams, customer_conversation_controller_1.CustomerConversationController.sendMessage);
router.post('/conversations/:conversationId/mark-all-read', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.markAllMessagesAsRead);
// jobdays day
router.post('/jobdays/:jobDayId/confirm-arrival', customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.tripArrivalComfirmParams, customer_jobday_controller_1.CustomerJobDayController.confirmContractorArrival);
router.post('/jobdays/:jobDayId/emergency', customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.tripArrivalComfirmParams, customer_jobday_controller_1.CustomerJobDayController.createJobEmergency);
router.post('/jobdays/:jobDayId/dispute', customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createJobDisputeParams, customer_jobday_controller_1.CustomerJobDayController.createJobDispute);
router.post('/jobdays/:jobDayId/confirm-completion', customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createJobDisputeParams, customer_jobday_controller_1.CustomerJobDayController.confirmJobDayCompletion);
router.post('/jobdays/:jobDayId/post-quality-assurance', customerRoleChecker_middleware_1.checkCustomerRole, customer_jobday_controller_1.CustomerJobDayController.savePostJobQualityAssurance);
router.post('/jobdays/:jobDayId/pre-quality-assurance', customerRoleChecker_middleware_1.checkCustomerRole, customer_jobday_controller_1.CustomerJobDayController.savePreJobJobQualityAssurance);
router.post('/jobdays/initiate', customerRoleChecker_middleware_1.checkCustomerRole, customer_jobday_controller_1.CustomerJobDayController.initiateJobDay);
// Call
router.post("/voicecall/agora-rtc", customerRoleChecker_middleware_1.checkCustomerRole, customer_call_controller_1.CustomerCallController.createRtcToken);
router.post("/voicecall", customerRoleChecker_middleware_1.checkCustomerRole, customer_call_controller_1.CustomerCallController.startCall);
router.get("/voicecall/:callId", customerRoleChecker_middleware_1.checkCustomerRole, customer_call_controller_1.CustomerCallController.getSingleCall);
router.post("/voicecall/:callId/end", customerRoleChecker_middleware_1.checkCustomerRole, customer_call_controller_1.CustomerCallController.endCall);
exports.default = router;
