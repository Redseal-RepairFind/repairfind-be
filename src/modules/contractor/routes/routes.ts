
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
//   const cpUpload = diskUpload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'previousJobPhotos', maxCount: 10 }, { name: 'previousJobVideos', maxCount: 10 }])
router.post("/profiles", checkContractorRole, ContractorHttpRequest.CreateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).createProfile();
});
router.get("/profiles/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).getProfile();
});
router.put("/profiles/me", checkContractorRole,  ContractorHttpRequest.UpdateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).updateProfile();
});

router.post("/profiles/bank-details", checkContractorRole, ContractorHttpRequest.UpdateBankDetailRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).updateBankDetails();
});

router.post("/profiles/stripe-identity", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).createIdentitySession();
});

//  Account
router.get("/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).getUser();
});
router.patch("/me", checkContractorRole,  ContractorHttpRequest.CreateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ContractorController(req, res, next).updateAccount();
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

//  QUiz
router.get("/quiz-start", checkContractorRole, QuizController.StartQuiz );
router.get("/quiz-result", checkContractorRole, QuizController.GetQuizResult); // contractor get quiz result
router.post("/quiz-submit", checkContractorRole, QuizController.SubmitQuiz); // contractor anser question 


//  Company Team
router.post("/teams/invite", checkContractorRole, ContractorHttpRequest.InviteToTeam, TeamController.inviteToTeam );
router.get("/teams", checkContractorRole, TeamController.getTeam); // contractor get quiz result
router.get("/teams/search-contractors", checkContractorRole, TeamController.searchContractorsNotInTeam); // contractor get quiz result

router.get("/teams/memberships", checkContractorRole, TeamController.getTeamMemberships); // contractor get quiz result
// router.delete("/teams/:teamId/leave", checkContractorRole, QuizController.SubmitQuiz); // contractor anser question 

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
router.get('/jobs/listings', checkContractorRole, ContractorJobController.getJobListings)
router.get('/jobs/listings/jobId', checkContractorRole, ContractorJobController.getJobListings)

// Job Request
router.get('/jobs/requests', checkContractorRole, ContractorJobController.getJobRequests)
router.get('/jobs/requests/:jobId', checkContractorRole, ContractorJobController.getJobRequestById)
router.post('/jobs/requests/:jobId/accept', checkContractorRole, ContractorJobController.acceptJobRequest)
router.post('/jobs/requests/:jobId/reject', checkContractorRole, ContractorJobController.rejectJobRequest)

// Application & Estimate
router.post('/jobs/:jobId/applications', checkContractorRole, ContractorHttpRequest.CreateJobApplicationRequest, ContractorJobController.sendJobApplication) // send application and estimate
router.get('/jobs/:jobId/applications', checkContractorRole, ContractorJobController.getApplicationForJob) // send application and estimate
router.patch('/jobs/:jobId/applications', checkContractorRole,ContractorHttpRequest.CreateJobApplicationRequest, ContractorJobController.updateJobApplication) // send application and estimate



// Notifications
router.get('/notifications', checkContractorRole, ContractorNotificationController.getNotifications)
router.get('/notifications/:notificationId', checkContractorRole, ContractorNotificationController.getSingleNotification)


// Conversations
router.get('/conversations', checkContractorRole, ContractorConversationController.getConversations)
router.get('/conversations/:conversationId', checkContractorRole, ContractorConversationController.getSingleConversation)
router.get('/conversations/:conversationId/messages', checkContractorRole, ContractorConversationController.getConversationMessages)

export default router;