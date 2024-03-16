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
//   const cpUpload = diskUpload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'previousJobPhotos', maxCount: 10 }, { name: 'previousJobVideos', maxCount: 10 }])
router.post("/profiles", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateProfileRequest, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).createProfile();
});
router.get("/profiles/me", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).getProfile();
});
router.put("/profiles/me", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.UpdateProfileRequest, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).updateProfile();
});
router.post("/profiles/bank-details", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.UpdateBankDetailRequest, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).updateBankDetails();
});
router.post("/profiles/stripe-identity", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).createIdentitySession();
});
//  Account
router.get("/me", contractorRoleCheck_middleware_1.checkContractorRole, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).getUser();
});
router.patch("/me", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateProfileRequest, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).updateAccount();
});
router.post("/me/change-password", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.PasswordChangeRequest, function (req, res, next) {
    (0, contractor_controller_1.ProfileController)(req, res, next).changePassword();
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
router.post("/schedules", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateScheduleRequest, contractor_schedule_controller_1.ScheduleContractor.createSchedule);
// router.get("/schedules", checkContractorRole, ScheduleContractor.getSchedulesByDate);
router.get("/schedules", contractorRoleCheck_middleware_1.checkContractorRole, contractor_schedule_controller_1.ScheduleContractor.expandWeeklyAvailability);
router.post("/schedules/events", contractorRoleCheck_middleware_1.checkContractorRole, contractor_schedule_controller_1.ScheduleContractor.addOrUpdateSchedule);
router.get("/schedules/events", contractorRoleCheck_middleware_1.checkContractorRole, contractor_schedule_controller_1.ScheduleContractor.getEventsByMonth);
router.post("/stripe-account", contractorRoleCheck_middleware_1.checkContractorRole, contractor_stripe_controller_1.ContractorStripeController.createAccount);
router.post("/stripe-session", contractorRoleCheck_middleware_1.checkContractorRole, requests_1.ContractorHttpRequest.CreateStripeSessionRequest, contractor_stripe_controller_1.ContractorStripeController.createSession);
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
exports.default = router;
