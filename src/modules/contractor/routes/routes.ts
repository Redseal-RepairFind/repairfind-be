import { diskUpload, memoryUpload } from "../../../utils/upload.utility";
import { contractorEmailForgotPasswordController, contractorEmailResetPasswordController } from "../controllers/contractorPassword.controller";
import { ContractorResendEmailController, contractorDeatilController, contractorSignInController, contractorSignUpController, contractorUpdateBioController, contractorVerifiedEmailController } from "../controllers/conttractorReg.controller";
import { 
            validateAvailabilityParams,
            validateBankDetailEquestParams, 
            validateContractorAwnserQuestionParams, 
            validateContractorRateCustomerParams,
            validateEditAvailabilityParams, 
            validateEmailLoginParams, 
            validateEmailParams, 
            validateEmailResetPasswordParams, 
            validateEmailVerificatioParams, 
            validateJobIdParams, 
            validateNotAvailabilityParams,
            validateREmoveAvailabilityParams, 
            validateRejectJobREquestParams, 
            validateSendJobQoutationParams, 
            validateSendJobQoutationParamsTwo, 
            validateSentQoutationCompleteParams, 
            validateSentQoutationOneByOneParams, 
            validateSignupParams, 
            validatejobQouteTwoREquestParams 
        } from "../middleware/requestValidate.middleware";

import { checkContractorRole } from "../middleware/contractorRoleCheck.middleware";
import { contractorAddDocumentController, contractorComfirmCertnValidationController, getAllSkillController } from "../controllers/contractordocumentValidate.controller";
import { contractorDeleteAvailabilityController, contractorEditAvailabilityController, contractorSetAvailabilityController, contractorSetNotAvailabilityController } from "../controllers/contractorAvailability.controller";
import { contractorCompleteJobController, contractorGeJobComfirmController, contractorGeJobComplainController, contractorGeJobCompletedController, contractorGeJobHistoryController, contractorGeJobRejectedController, contractorGetJobRequestContractorController, contractorGetQuatationContractorController, contractorGetQuatationPaymentComfirmAndJobInProgressController, contractorRejectJobRequestController, contractorRemoveobQuatationOneByOneControllerfive, contractorSendJobQuatationController, contractorSendJobQuatationControllerFour, contractorSendJobQuatationControllerThree, contractorSendJobQuatationControllerTwo } from "../controllers/contractorJob.controller";
import { contractorEnterBankdetailController, contractorGetBankDetailController } from "../controllers/contractorBankDetail.controller";
import { contractionAnwerQuestionController, contractionGetQuizRrsultController, contractionLoadtQuestionController, contractorStartQuizController } from "../controllers/question.controller";
import { contractorGetNotificationrController, contractorUnseenNotificationrController, contractorViewNotificationrController } from "../controllers/contractorNotification.controller";
import { contractorRateCustomerController, contractorRatingDetailController } from "../controllers/ratingCustomer.controller";
import { AuthController } from "../controllers/auth.controller";
import { NextFunction, Request, Response } from "express";
import { HttpRequest } from "../requests";
import multer from "multer";
import { ProfileController } from "../controllers/profile.controller";

const express = require("express");
const router = express.Router();


//  AUTH
router.post("/signup", validateSignupParams, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).signUp();
});
router.post("/email-verification", validateEmailVerificatioParams, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).verifyEmail();
});
router.post("/signin", validateEmailLoginParams, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).signin();
});
router.post("/resend-email", validateEmailParams, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).resendEmail();
});
router.post("/forgot-password", validateEmailParams, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).forgotPassword();
});
router.post("/reset-password", validateEmailResetPasswordParams, (req: Request, res: Response, next: NextFunction) => {
    AuthController(req, res, next).resetPassword();
});

// PROFILE
//   const cpUpload = diskUpload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'previousJobPhotos', maxCount: 10 }, { name: 'previousJobVideos', maxCount: 10 }])
router.post("/profiles", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).createProfile();
});
router.get("/profiles/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).getProfile();
});
router.patch("/profiles/me", checkContractorRole, (req: Request, res: Response, next: NextFunction) => {
    ProfileController(req, res, next).updateProfile();
});


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