"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contractorRoleCheck_middleware_1 = require("../middleware/contractorRoleCheck.middleware");
var contractor_auth_controller_1 = require("../controllers/contractor_auth.controller");
var requests_1 = require("../requests");
var contractor_controller_1 = require("../controllers/contractor.controller");
var contractor_quiz_controller_1 = require("../controllers/contractor_quiz.controller");
var contractor_team_controller_1 = require("../controllers/contractor_team.controller");
var contractor_schedule_controller_1 = require("../controllers/contractor_schedule.controller");
var contractor_stripe_controller_1 = require("../controllers/contractor_stripe.controller");
var contractor_team_invitation_controller_1 = require("../controllers/contractor_team_invitation.controller");
var contractor_job_controller_1 = require("../controllers/contractor_job.controller");
var contractor_notification_controller_1 = require("../controllers/contractor_notification.controller");
var contractor_conversation_controller_1 = require("../controllers/contractor_conversation.controller");
var contractor_tripDay_controller_1 = require("../controllers/contractor_tripDay.controller");
var express = require("express");
var router = express.Router();
//  AUTH
router.post("/signup", requests_1.ContractorHttpRequest.CreateContractorRequest, function (req, res, next) {
    (0, contractor_auth_controller_1.AuthController)(req, res, next).signUp();
});
router.post("/email-verification", requests_1.ContractorHttpRequest.EmailVerificationRequest, function (req, res, next) {
    (0, contractor_auth_controller_1.AuthController)(req, res, next).verifyEmail();
});
router.post("/signin", requests_1.ContractorHttpRequest.LoginRequest, function (req, res, next) {
    (0, contractor_auth_controller_1.AuthController)(req, res, next).signin();
});
router.post("/resend-email", requests_1.ContractorHttpRequest.ResendEmailRequest, function (req, res, next) {
    (0, contractor_auth_controller_1.AuthController)(req, res, next).resendEmail();
});
router.post("/forgot-password", requests_1.ContractorHttpRequest.ResendEmailRequest, function (req, res, next) {
    (0, contractor_auth_controller_1.AuthController)(req, res, next).forgotPassword();
});
router.post("/reset-password-verification", function (req, res, next) {
    (0, contractor_auth_controller_1.AuthController)(req, res, next).verifyResetPasswordOtp();
});
router.post("/reset-password", requests_1.ContractorHttpRequest.PasswordResetRequest, function (req, res, next) {
    (0, contractor_auth_controller_1.AuthController)(req, res, next).resetPassword();
});
// PROFILE
router.post("/profiles", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).createProfile();
});
router.get("/profiles", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).getProfile();
});
router.patch("/profiles", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.UpdateProfileRequest, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).updateProfile();
});
//  Account
router.get("/me", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).getAccount();
});
router.patch("/me", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateProfileRequest, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).updateAccount();
});
router.post("/me/change-password", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.PasswordChangeRequest, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).changePassword();
});
router.post("/me/devices", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.UpdateOrDevice, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).createOrUpdateDevice();
});
router.get("/me/devices", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).myDevices();
});
router.post("/me/stripe-account", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).createStripeAccount();
});
router.get("/me/stripe-account-login", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).generateStripeAccountDashboardLink();
});
router.post("/me/gst", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateGstDetailsRequest, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).addGstDetails();
});
router.post("/me/company", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateCompanyDetailsRequest, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).addCompanyDetails();
});
router.post("/me/stripe-identity", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ContractorController)(req, res, next).createIdentitySession();
});
//  QUiz
router.get("/quiz-start", contractorRoleCheck_middleware_1.checkContractorRole, contractor_quiz_controller_1.QuizController.StartQuiz);
router.get("/quiz-result", contractorRoleCheck_middleware_1.checkContractorRole, contractor_quiz_controller_1.QuizController.GetQuizResult); // contractor get quiz result
router.post("/quiz-submit", contractorRoleCheck_middleware_1.checkContractorRole, contractor_quiz_controller_1.QuizController.SubmitQuiz); // contractor anser question 
//  Company Team
router.post("/teams/invite", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.InviteToTeam, contractor_team_controller_1.TeamController.inviteToTeam);
router.get("/teams", contractorRoleCheck_middleware_1.checkContractorRole, contractor_team_controller_1.TeamController.getTeam); // contractor get quiz result
router.get("/teams/search-contractors", contractorRoleCheck_middleware_1.checkContractorRole, contractor_team_controller_1.TeamController.searchContractorsNotInTeam); // contractor get quiz result
router.get("/teams/memberships", contractorRoleCheck_middleware_1.checkContractorRole, contractor_team_controller_1.TeamController.getTeamMemberships); // contractor get quiz result
// router.delete("/teams/:teamId/leave", checkContractorRole, QuizController.SubmitQuiz); // contractor anser question 
// Define routes for managing team invitations
router.post("/teams/invitations", contractorRoleCheck_middleware_1.checkContractorRole, contractor_team_invitation_controller_1.TeamInvitationController.inviteToTeam);
router.get("/teams/invitations", contractorRoleCheck_middleware_1.checkContractorRole, contractor_team_invitation_controller_1.TeamInvitationController.getInvitations);
router.patch("/teams/invitations/:invitationId/accept", contractorRoleCheck_middleware_1.checkContractorRole, contractor_team_invitation_controller_1.TeamInvitationController.acceptInvitation);
router.patch("/teams/invitations/:invitationId/reject", contractorRoleCheck_middleware_1.checkContractorRole, contractor_team_invitation_controller_1.TeamInvitationController.rejectInvitation);
//  Contractor Schedule
router.post("/schedules", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateScheduleRequest, contractor_schedule_controller_1.ScheduleController.createSchedule);
router.get("/schedules", contractorRoleCheck_middleware_1.checkContractorRole, contractor_schedule_controller_1.ScheduleController.getSchedulesByDate);
// router.get("/schedules", checkContractorRole, ScheduleController.expandWeeklyAvailability);
router.post("/schedules/events", contractorRoleCheck_middleware_1.checkContractorRole, contractor_schedule_controller_1.ScheduleController.addOrUpdateSchedule);
router.post("/schedules/availability", contractorRoleCheck_middleware_1.checkContractorRole, contractor_schedule_controller_1.ScheduleController.setAvailability);
router.get("/schedules/events", contractorRoleCheck_middleware_1.checkContractorRole, contractor_schedule_controller_1.ScheduleController.getEventsByMonth);
router.post("/stripe-account", contractorRoleCheck_middleware_1.checkContractorRole, contractor_stripe_controller_1.ContractorStripeController.createAccount);
router.post("/stripe-session", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateStripeSessionRequest, contractor_stripe_controller_1.ContractorStripeController.createSession);
router.post("/stripe-setupintent", contractorRoleCheck_middleware_1.checkContractorRole, contractor_stripe_controller_1.ContractorStripeController.createSetupIntent);
/*
    JOB
*/
// Contractor Jobs
router.get('/jobs', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.getJobRequests);
// Job Listings
router.get('/jobs/my-jobs', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.getMyJobs);
router.get('/jobs/listings', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.getJobListings);
router.get('/jobs/listings/:jobId', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.getJobListingById);
// Job Request
router.get('/jobs/requests', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.getJobRequests);
router.get('/jobs/requests/:jobId', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.getJobRequestById);
router.post('/jobs/requests/:jobId/accept', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.acceptJobRequest);
router.post('/jobs/requests/:jobId/reject', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.rejectJobRequest);
// Quotation & Estimate
router.post('/jobs/:jobId/quotations', contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateJobQuotationRequest, contractor_job_controller_1.ContractorJobController.sendJobQuotation); // send application and estimate
router.get('/jobs/:jobId/quotations', contractorRoleCheck_middleware_1.checkContractorRole, contractor_job_controller_1.ContractorJobController.getQuotationForJob); // send application and estimate
router.patch('/jobs/:jobId/quotations', contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateJobQuotationRequest, contractor_job_controller_1.ContractorJobController.updateJobQuotation); // send application and estimate
// Notifications
router.get('/notifications', contractorRoleCheck_middleware_1.checkContractorRole, contractor_notification_controller_1.ContractorNotificationController.getNotifications);
router.get('/notifications/:notificationId', contractorRoleCheck_middleware_1.checkContractorRole, contractor_notification_controller_1.ContractorNotificationController.getSingleNotification);
// Conversations
router.get('/conversations', contractorRoleCheck_middleware_1.checkContractorRole, contractor_conversation_controller_1.ContractorConversationController.getConversations);
router.get('/conversations/:conversationId', contractorRoleCheck_middleware_1.checkContractorRole, contractor_conversation_controller_1.ContractorConversationController.getSingleConversation);
router.get('/conversations/:conversationId/messages', contractorRoleCheck_middleware_1.checkContractorRole, contractor_conversation_controller_1.ContractorConversationController.getConversationMessages);
router.post('/conversations/:conversationId/messages', contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.sendMessageParams, contractor_conversation_controller_1.ContractorConversationController.sendMessage);
// trips day
router.post('/trip/:jobId/start', contractorRoleCheck_middleware_1.checkContractorRole, contractor_tripDay_controller_1.ContractorTripDayController.contractorStartTripController);
router.post('/trip/:tripDayId/arrive', contractorRoleCheck_middleware_1.checkContractorRole, contractor_tripDay_controller_1.ContractorTripDayController.contractorArrivedSiteController);
exports.default = router;
