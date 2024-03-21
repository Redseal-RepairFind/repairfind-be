import { CustomerAuthController } from "../controllers/customer_auth.controller";
import { checkCustomerRole } from "../middleware/customerRoleChecker.middleware";
import { CustomerHttpRequest } from "../requests";
import { CustomerController } from "../controllers/customer.controller";
import { CustomerStripeController } from "../controllers/customer_stripe.controller";

const express = require("express");
const router = express.Router();


// Auth
router.post("/signup", CustomerHttpRequest.signupParams, CustomerAuthController.signUp ); // customer signup
router.post("/login", CustomerHttpRequest.loginParams, CustomerAuthController.signIn ); // customer signup
router.post("/email-verification", CustomerHttpRequest.emailVerificationParams, CustomerAuthController.verifyEmail ); // customer verified email
router.post("/resend-email-verification", CustomerHttpRequest.forgotPasswordParams, CustomerAuthController.resendEmail ); // customer resend email
router.post("/forgot-password", CustomerHttpRequest.forgotPasswordParams, CustomerAuthController.forgotPassword ); // customer forgot passwor
router.post("/reset-password", CustomerHttpRequest.resetPasswordParams, CustomerAuthController.resetPassword  ); // customer reset password
router.post("/reset-password-verification", CustomerHttpRequest.verifyPasswordOtpParams,  CustomerAuthController.verifyResetPasswordOtp ); // verify password reset opt
router.post("/google-signon", CustomerHttpRequest.verifySocialSignon,  CustomerAuthController.googleSignon ); // verify password reset opt
router.post("/facebook-signon", CustomerHttpRequest.verifySocialSignon,  CustomerAuthController.facebookSignon ); // verify password reset opt


//  Account
router.patch("/me", checkCustomerRole, CustomerController.updateAccount ); // customer update account
router.get("/me", checkCustomerRole, CustomerController.getAccount ); // 
router.post("/me/change-password", checkCustomerRole, CustomerHttpRequest.changePasswordParams,  CustomerController.changePassword ); 
router.post("/me/devices", checkCustomerRole, CustomerHttpRequest.UpdateOrDeviceParams,  CustomerController.updateOrCreateDevice ); 
router.get("/me/devices", checkCustomerRole,  CustomerController.myDevices ); 



router.post("/stripe-account",  checkCustomerRole,  CustomerStripeController.createAccount ); 
router.post("/stripe-session",  checkCustomerRole, CustomerHttpRequest.createStripeSessionParams, CustomerStripeController.createSession ); 
router.post("/stripe-setupintent",  checkCustomerRole, CustomerStripeController.createSetupIntent ); 

export default router;