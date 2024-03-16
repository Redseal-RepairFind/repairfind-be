import { diskUpload, memoryUpload } from "../../../utils/upload.utility";

import { checkContractorRole } from "../middleware/contractorRoleCheck.middleware";
import { AuthController } from "../controllers/contractor_auth.controller";
import { NextFunction, Request, Response } from "express";
import { ContractorHttpRequest } from "../requests";
import { ProfileController } from "../controllers/contractor.controller";
import { QuizController } from "../controllers/contractor_quiz.controller";
import { TeamController } from "../controllers/contractor_team.controller";
import { ScheduleController } from "../controllers/contractor_schedule.controller";
import { ContractorStripeController } from "../controllers/contractor_stripe.controller";
import { TeamInvitationController } from "../controllers/contractor_team_invitation.controller";

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
    ProfileController(req, res, next).createProfile();
});
router.get("/profiles/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).getProfile();
});
router.put("/profiles/me", checkContractorRole,  ContractorHttpRequest.UpdateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).updateProfile();
});

router.post("/profiles/bank-details", checkContractorRole, ContractorHttpRequest.UpdateBankDetailRequest, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).updateBankDetails();
});

router.post("/profiles/stripe-identity", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).createIdentitySession();
});

//  Account
router.get("/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).getUser();
});
router.patch("/me", checkContractorRole,  ContractorHttpRequest.CreateProfileRequest, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).updateAccount();
});

router.post("/me/change-password", checkContractorRole, ContractorHttpRequest.PasswordChangeRequest, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).changePassword();
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



// router.post("/start_quiz", checkContractorRole, contractorStartQuizController); // contractor start quiz
// router.get("/load_quiz_question", checkContractorRole, contractionLoadtQuestionController); // contractor load question
// router.post("/answer_question", checkContractorRole, validateContractorAwnserQuestionParams, contractionAnwerQuestionController); // contractor anser question 
// router.get("/quiz_result", checkContractorRole, contractionGetQuizRrsultController); // contractor get quiz result


// router.get("/contractor_detail", checkContractorRole, contractorDeatilController); // contractor detail
// router.post("/contractor_edit_biodata", checkContractorRole, upload.single('profileImg'), contractorUpdateBioController); // contractor update biodata

// router.post("/contractor_add_document", checkContractorRole, upload.any(), contractorAddDocumentController); // contractor add his document
// router.get("/contractor_certn_comfirm", checkContractorRole, contractorComfirmCertnValidationController); // contractor certn comfirmation


// router.post("/contractor_set_available", checkContractorRole, validateAvailabilityParams, contractorSetAvailabilityController); // contractor set avialability
// router.post("/contractor_set_not_available", checkContractorRole, validateNotAvailabilityParams, contractorSetNotAvailabilityController); // contractor set not avialability
// router.post("/contractor_remove_available", checkContractorRole, validateREmoveAvailabilityParams, contractorDeleteAvailabilityController); // contractor remove avialability
// router.post("/contractor_edit_available", checkContractorRole, validateEditAvailabilityParams, contractorEditAvailabilityController); // contractor edit avialability

// router.get("/get_all_skill", getAllSkillController); // get all skill

// router.get("/get_job_request_sent", checkContractorRole, contractorGetJobRequestContractorController); // cuntractor get job request sent to him
// router.post("/send_job_qoutation", checkContractorRole, validateSendJobQoutationParams, contractorSendJobQuatationController); // cuntractor sent job qoutation
// router.post("/send_job_qoutation_two", checkContractorRole, validatejobQouteTwoREquestParams, contractorSendJobQuatationControllerTwo); // cuntractor sent job qoutation two
// router.get("/get_job_qoutation_sent", checkContractorRole, contractorGetQuatationContractorController); // cuntractor get job qoutation sent 
// router.get("/get_job_payment_comfirm_and_job_in_progress", checkContractorRole, contractorGetQuatationPaymentComfirmAndJobInProgressController); // cuntractor get job qoutation payment comfirm and job in progress
// router.post("/reject_job_request", checkContractorRole, validateRejectJobREquestParams, contractorRejectJobRequestController); // contractor reject job request
// router.get("/get_rejected_job_request", checkContractorRole, contractorGeJobRejectedController); // cuntractor get rejected job  request
// router.get("/get_job_history", checkContractorRole, contractorGeJobHistoryController); // cuntractor get job  history
// router.post("/complete_job", checkContractorRole, validateJobIdParams, contractorCompleteJobController); // cuntractor complete job
// router.get("/get_job_completed", checkContractorRole, contractorGeJobCompletedController); // cuntractor get job completed
// router.get("/get_job_completed_comfirm", checkContractorRole, contractorGeJobComfirmController); // cuntractor get job comfirm by customer
// router.get("/get_job_completed_complain", checkContractorRole, contractorGeJobComplainController); // cuntractor get job complain by customer

// //real job Qoutation
// router.post("/send_job_qoutation_one_by_one", checkContractorRole, validateSentQoutationOneByOneParams, contractorSendJobQuatationControllerThree); // cuntractor sent job qoutation one by one
// router.post("/send_job_qoutation_complete", checkContractorRole, validateSentQoutationCompleteParams, contractorSendJobQuatationControllerFour); // cuntractor sent job qoutation complete
// router.post("/remove_job_qoutation_one_by_one", checkContractorRole, validateSentQoutationOneByOneParams, contractorRemoveobQuatationOneByOneControllerfive); // cuntractor remove qoute one by one

// router.post("/enter_bank_detail", checkContractorRole, validateBankDetailEquestParams, contractorEnterBankdetailController); // cuntractor enter back detail
// router.get("/get_bank_detail", checkContractorRole, contractorGetBankDetailController); // cuntractor get bank detail


// router.get("/get_all_notification", checkContractorRole, contractorGetNotificationrController); // contractor get all notification
// router.post("/view_unseen_notification", checkContractorRole, contractorViewNotificationrController); // contractor view unseen notification
// router.get("/get_unseen_notification", checkContractorRole, contractorUnseenNotificationrController); // contractor get total number of unseen notification

// router.post("/rate_customer", checkContractorRole, validateContractorRateCustomerParams, contractorRateCustomerController); // contractor rated customer
// router.get("/contractor_rating_detail", checkContractorRole, contractorRatingDetailController); // contractor rated customer


export default router;