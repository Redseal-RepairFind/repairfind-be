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
var customer_tripDay_controller_1 = require("../controllers/customer_tripDay.controller");
var customer_payment_controller_1 = require("../controllers/customer_payment.controller");
var customer_transaction_controller_1 = require("../controllers/customer_transaction.controller");
var customer_booking_controller_1 = require("../controllers/customer_booking.controller");
var customer_call_controller_1 = require("../controllers/customer_call.controller");
var express = require("express");
var router = express.Router();
// Auth
router.post("/signup", requests_1.CustomerHttpRequest.signupParams, customer_auth_controller_1.CustomerAuthController.signUp); // customer signup
router.post("/login", requests_1.CustomerHttpRequest.loginParams, customer_auth_controller_1.CustomerAuthController.signIn); // customer signup
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
router.post("/stripe-account", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.createAccount);
router.post("/stripe-payment-methods/:paymentMethodId/detach", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.detachStripePaymentMethod);
router.post("/stripe-payment-methods/:paymentMethodId/attach", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.attachStripePaymentMethod);
router.post("/stripe-session", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.createStripeSessionParams, customer_stripe_controller_1.CustomerStripeController.createSession);
router.post("/stripe-setupintent", customerRoleChecker_middleware_1.checkCustomerRole, customer_stripe_controller_1.CustomerStripeController.createSetupIntent);
// Explore Contractors
router.get("/explore/contractors", customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.queryContractorParams, customer_explore_controller_1.CustomerExploreController.exploreContractors);
router.get("/explore/contractors/:contractorId", customerRoleChecker_middleware_1.checkCustomerRole, customer_explore_controller_1.CustomerExploreController.getSingleContractor);
router.get("/explore/contractors/:contractorId/schedules", customerRoleChecker_middleware_1.checkCustomerRole, customer_explore_controller_1.CustomerExploreController.getContractorSchedules);
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
router.post("/jobs/:jobId/pay", customerRoleChecker_middleware_1.checkCustomerRole, customer_payment_controller_1.CustomerPaymentController.makeJobPayment);
router.post("/jobs/:jobId/payment-capture", customerRoleChecker_middleware_1.checkCustomerRole, customer_payment_controller_1.CustomerPaymentController.captureJobPayment);
// BOOKING
router.get("/bookings", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getMyBookings);
router.get("/bookings/history", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getBookingHistory);
router.get("/bookings/:bookingId", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.getSingleBooking);
router.post("/bookings/:bookingId/reschedule", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.requestBookingReschedule);
router.post("/bookings/:bookingId/reschedule/:action", customerRoleChecker_middleware_1.checkCustomerRole, customer_booking_controller_1.CustomerBookingController.acceptOrDeclineReschedule);
// Transactions
router.get("/transactions", customerRoleChecker_middleware_1.checkCustomerRole, customer_transaction_controller_1.CustomerTransactionController.getTransactions);
router.get("/transactions/summary", customerRoleChecker_middleware_1.checkCustomerRole, customer_transaction_controller_1.CustomerTransactionController.getTransactionSummary);
router.get("/transactions/:transactionId", customerRoleChecker_middleware_1.checkCustomerRole, customer_transaction_controller_1.CustomerTransactionController.getSingleTransaction);
// Notifications
router.get('/notifications', customerRoleChecker_middleware_1.checkCustomerRole, customer_notification_controller_1.CustomerNotificationController.getNotifications);
router.get('/notifications/:notificationId', customerRoleChecker_middleware_1.checkCustomerRole, customer_notification_controller_1.CustomerNotificationController.getSingleNotification);
router.post('/notifications/:notificationId', customerRoleChecker_middleware_1.checkCustomerRole, customer_notification_controller_1.CustomerNotificationController.markNotificationAsRead);
// Conversations
router.get('/conversations', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.getConversations);
router.get('/conversations/:conversationId', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.getSingleConversation);
router.get('/conversations/:conversationId/messages', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.getConversationMessages);
router.post('/conversations/:conversationId/messages', customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.sendMessageParams, customer_conversation_controller_1.CustomerConversationController.sendMessage);
router.post('/conversations/:conversationId/mark-all-read', customerRoleChecker_middleware_1.checkCustomerRole, customer_conversation_controller_1.CustomerConversationController.markAllMessagesAsRead);
// trips day
router.post('/trip/:tripDayId/comfirm/arrival', customerRoleChecker_middleware_1.checkCustomerRole, requests_1.CustomerHttpRequest.tripArrivalComfirmParams, customer_tripDay_controller_1.CustomerTripDayController.customerverifiedContractorSiteArrivalController);
// Call
router.post("/voicecall/agora-rtc", customerRoleChecker_middleware_1.checkCustomerRole, customer_call_controller_1.CustomerCallController.createRtcToken);
router.post("/voicecall", customerRoleChecker_middleware_1.checkCustomerRole, customer_call_controller_1.CustomerCallController.startCall);
router.post("/voicecall/:callId/end", customerRoleChecker_middleware_1.checkCustomerRole, customer_call_controller_1.CustomerCallController.endCall);
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
exports.default = router;
