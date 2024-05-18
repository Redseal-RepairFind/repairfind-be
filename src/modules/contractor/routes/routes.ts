
import { checkContractorRole } from "../middleware/contractorRoleCheck.middleware";
import { AuthController } from "../controllers/contractor_auth.controller";
import { NextFunction, Request, Response } from "express";
import { ContractorHttpRequest } from "../requests";
import { ContractorController } from "../controllers/contractor.controller";
import { QuizController } from "../controllers/contractor_quiz.controller";
import { TeamController } from "../controllers/contractor_team.controller";
import { ScheduleController } from "../controllers/contractor_schedule.controller";
import { ContractorStripeController } from "../controllers/contractor_stripe.controller";
import { TeamInvitationController } from "../controllers/contractor_team_invitation.controller";
import { ContractorJobController } from "../controllers/contractor_job.controller";
import { ContractorNotificationController } from "../controllers/contractor_notification.controller";
import { ContractorConversationController } from "../controllers/contractor_conversation.controller";
import { ContractorTransactionController } from "../controllers/contractor_transaction.controller";
import { ContractorCallController } from "../controllers/contractor_call.controller";
import { ContractorBookingController } from "../controllers/contractor_booking.controller";
import { ContractorJobDayController } from "../controllers/contractor_jobday.controller";

const express = require("express");
const router = express.Router();


//  AUTH
router.post("/signup", ContractorHttpRequest.CreateContractorRequest, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).signUp();
});
router.post("/email-verification", ContractorHttpRequest.EmailVerificationRequest, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).verifyEmail();
});

router.post("/signin", ContractorHttpRequest.LoginRequest, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).signin();
});

router.post("/resend-email", ContractorHttpRequest.ResendEmailRequest, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).resendEmail();
});
router.post("/forgot-password", ContractorHttpRequest.ResendEmailRequest, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).forgotPassword();
});

router.post("/reset-password-verification", (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).verifyResetPasswordOtp();
});

router.post("/reset-password", ContractorHttpRequest.PasswordResetRequest, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).resetPassword();
});


// PROFILE
router.post("/profiles", checkContractorRole, ContractorHttpRequest.CreateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).createProfile();
});
router.get("/profiles", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).getProfile();
});
router.patch("/profiles", checkContractorRole,  ContractorHttpRequest.UpdateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).updateProfile();
});

router.post("/profiles/upgrade-employee", checkContractorRole, ContractorHttpRequest.UpgradeEmployeeProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).upgradeEmployeeProfile();
});


//  Account
router.get("/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).getAccount();
});
router.patch("/me", checkContractorRole,  ContractorHttpRequest.CreateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).updateAccount();
});

router.delete("/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).deleteAccount();
});

router.post("/me/change-password", checkContractorRole, ContractorHttpRequest.PasswordChangeRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).changePassword();
});

router.post("/me/devices", checkContractorRole, ContractorHttpRequest.UpdateOrDevice, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).createOrUpdateDevice();
});
router.get("/me/devices", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).myDevices();
});

router.post("/me/stripe-account", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).createStripeAccount();
});
router.get("/me/stripe-account-login", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).generateStripeAccountDashboardLink();
});

router.post("/me/gst", checkContractorRole, ContractorHttpRequest.CreateGstDetailsRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).addGstDetails();
});

router.post("/me/company", checkContractorRole, ContractorHttpRequest.CreateCompanyDetailsRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).addCompanyDetails();
});

router.post("/me/stripe-identity", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).createIdentitySession();
});


//  QUiz
router.get("/quiz-start", checkContractorRole, QuizController.StartQuiz );
router.get("/quiz-result", checkContractorRole, QuizController.GetQuizResult); 
router.post("/quiz-submit", checkContractorRole, QuizController.SubmitQuiz); 


//  Company Team
router.post("/teams/invite", checkContractorRole, ContractorHttpRequest.InviteToTeam, TeamInvitationController.inviteToTeam );
router.get("/teams", checkContractorRole, TeamController.getTeam); 
router.get("/teams/search-contractors", checkContractorRole, TeamController.searchContractorsNotInTeam); 

router.get("/teams/memberships", checkContractorRole, TeamController.getTeamMemberships); 
router.delete("/teams/:teamId/leave", checkContractorRole, TeamController.leaveTeam); 
router.delete("/teams/:teamId/remove-member", checkContractorRole, TeamController.removeMemberFromTeam); 

// Define routes for managing team invitations
router.post("/teams/invitations", checkContractorRole, TeamInvitationController.inviteToTeam);
router.get("/teams/invitations", checkContractorRole, TeamInvitationController.getInvitations);
router.patch("/teams/invitations/:invitationId/accept", checkContractorRole, TeamInvitationController.acceptInvitation);
router.patch("/teams/invitations/:invitationId/reject", checkContractorRole, TeamInvitationController.rejectInvitation);



//  Contractor Schedule
router.post("/schedules", checkContractorRole, ContractorHttpRequest.CreateScheduleRequest, ScheduleController.createSchedule );
router.get("/schedules", checkContractorRole, ScheduleController.getSchedulesByDate);
// router.get("/schedules", checkContractorRole, ScheduleController.expandWeeklyAvailability);
router.post("/schedules/events", checkContractorRole, ScheduleController.addOrUpdateSchedule);
router.post("/schedules/availability", checkContractorRole, ScheduleController.setAvailability);
router.get("/schedules/events", checkContractorRole, ScheduleController.getEventsByMonth);



router.post("/stripe-account", checkContractorRole,  ContractorStripeController.createAccount ); 
router.post("/stripe-session",  checkContractorRole, ContractorHttpRequest.CreateStripeSessionRequest,  ContractorStripeController.createSession ); 
router.post("/stripe-setupintent",  checkContractorRole, ContractorStripeController.createSetupIntent ); 


/*
    JOB 
*/

// Contractor Jobs
router.get('/jobs', checkContractorRole, ContractorJobController.getJobRequests)

// Job Listings
router.get('/jobs/my-jobs', checkContractorRole, ContractorJobController.getMyJobs)
router.get('/jobs/listings', checkContractorRole, ContractorJobController.getJobListings)
router.get('/jobs/listings/:jobId', checkContractorRole, ContractorJobController.getJobListingById)

// Job Request
router.get('/jobs/requests', checkContractorRole, ContractorJobController.getJobRequests)
router.get('/jobs/requests/:jobId', checkContractorRole, ContractorJobController.getJobRequestById)
router.post('/jobs/requests/:jobId/accept', checkContractorRole, ContractorJobController.acceptJobRequest)
router.post('/jobs/requests/:jobId/reject', checkContractorRole, ContractorJobController.rejectJobRequest)

// Quotation & Estimate
router.post('/jobs/:jobId/quotations', checkContractorRole, ContractorHttpRequest.CreateJobQuotationRequest, ContractorJobController.sendJobQuotation) // send application and estimate
router.get('/jobs/:jobId/quotations', checkContractorRole, ContractorJobController.getQuotationForJob) // send application and estimate
router.patch('/jobs/:jobId/quotations', checkContractorRole,ContractorHttpRequest.CreateJobQuotationRequest, ContractorJobController.updateJobQuotation) // send application and estimate



// Notifications
router.get('/notifications', checkContractorRole, ContractorNotificationController.getNotifications)
router.get('/notifications/:notificationId', checkContractorRole, ContractorNotificationController.getSingleNotification)


// Conversations
router.get('/conversations', checkContractorRole, ContractorConversationController.getConversations)
router.get('/conversations/:conversationId', checkContractorRole, ContractorConversationController.getSingleConversation)
router.get('/conversations/:conversationId/messages', checkContractorRole, ContractorConversationController.getConversationMessages)
router.post('/conversations/:conversationId/messages', checkContractorRole, ContractorHttpRequest.sendMessageParams,  ContractorConversationController.sendMessage)
router.post('/conversations/:conversationId/mark-all-read', checkContractorRole,  ContractorConversationController.markAllMessagesAsRead)



// Transactions
router.get("/transactions", checkContractorRole, ContractorTransactionController.getTransactions ); 
router.get("/transactions/summary", checkContractorRole, ContractorTransactionController.getTransactionSummary ); 
router.get("/transactions/:transactionId", checkContractorRole, ContractorTransactionController.getSingleTransaction);


// BOOKING
router.get("/bookings", checkContractorRole, ContractorBookingController.getMyBookings ); 
router.get("/bookings/history", checkContractorRole, ContractorBookingController.getBookingHistory ); 
router.get("/bookings/disputes", checkContractorRole, ContractorBookingController.getBookingHistory ); 
router.get("/bookings/:bookingId", checkContractorRole, ContractorBookingController.getSingleBooking ); 
router.post("/bookings/:bookingId/reschedule", checkContractorRole, ContractorBookingController.requestBookingReschedule ); 
router.post("/bookings/:bookingId/reschedule/:action", checkContractorRole, ContractorBookingController.acceptOrDeclineReschedule ); 
router.post("/bookings/:bookingId/assign", checkContractorRole, ContractorBookingController.assignJob ); 
router.post("/bookings/:bookingId/cancel", checkContractorRole, ContractorBookingController.cancelBooking ); 
router.post('/bookings/:bookingId/mark-complete', checkContractorRole, ContractorBookingController.markBookingComplete)


// jobdays day
router.post('/jobdays/trip-start', checkContractorRole, ContractorJobDayController.startTrip)
router.post('/jobdays/initiate', checkContractorRole, ContractorJobDayController.initiateJobDay)
router.post('/jobdays/:jobDayId/trip-arrival', checkContractorRole, ContractorJobDayController.confirmArrival)
router.post('/jobdays/:jobDayId/emergency', checkContractorRole, ContractorJobDayController.createJobEmergency)



// Call
router.post("/voicecall/agora-rtc", checkContractorRole,  ContractorCallController.createRtcToken );
router.post("/voicecall", checkContractorRole,  ContractorCallController.startCall );
router.post("/voicecall/:callId/end", checkContractorRole,  ContractorCallController.endCall );

export default router;