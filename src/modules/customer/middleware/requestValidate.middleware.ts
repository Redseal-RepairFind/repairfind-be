
import { body, query } from "express-validator";

export const validateSignupParams = [
  body("email").isEmail(),
  body("fullName").notEmpty(),
  body("phonenumber").notEmpty(),
  body("password").notEmpty(),
];

export const validatecustomerEmailverificationParams = [
    body("email").isEmail(),
    body("otp").notEmpty(),
];

export const validatecustomeLoginParams = [
    body("email").isEmail(),
    body("password").notEmpty(),
];

export const validatecustomerForgotPasswordParams = [
    body("email").isEmail(),
];

export const validatecustomerResetPasswprdParams = [
    body("email").isEmail(),
    body("otp").notEmpty(),
    body("password").notEmpty(),
];

export const validateContractorSearckParams = [
    query("skill").notEmpty(),
];

export const validateCustomerGetContractorParams = [
    query("contractorId").notEmpty(),
    query("skill").notEmpty(),
];

export const validateCustomerUpdateProfileParams = [
    query("fullName").notEmpty(),
    query("location").notEmpty(),
    query("phoneNumber").notEmpty(),
];

export const validateAcceptAndPayParams = [
    body("jobId").notEmpty(),
];

export const validateComfirmPaymentParams = [
    body("jobId").notEmpty(),
    body("paymentId").notEmpty(),
];

export const validateComfirmInspectionPaymentParams = [
    body("jobId").notEmpty(),
    body("inspectionPaymemtId").notEmpty(),
];

export const validateCustomerRateContractorParams = [
    body("jobId").notEmpty(),
    body("cleanliness")
      .isIn([1, 2, 3, 4, 5])
      .withMessage("cleanliness must be 1, 2, 3, 4, 0r 5"),
    body("timeliness")
      .isIn([1, 2, 3, 4, 5])
      .withMessage("timeliness must be 1, 2, 3, 4, 0r 5"),
    body("skill")
      .isIn([1, 2, 3, 4, 5])
      .withMessage("skill must be 1, 2, 3, 4, 0r 5"),
    body("communication")
      .isIn([1, 2, 3, 4, 5])
      .withMessage("communication must be 1, 2, 3, 4, 0r 5"),
    body("courteous")
      .isIn([1, 2, 3, 4, 5])
      .withMessage("courteous must be 1, 2, 3, 4, 0r 5"), 
    body("cleanlinessText").notEmpty(),
    body("timelinessText").notEmpty(),
    body("skillText").notEmpty(),
    body("communicationText").notEmpty(),
    body("courteousText").notEmpty(),
  ];