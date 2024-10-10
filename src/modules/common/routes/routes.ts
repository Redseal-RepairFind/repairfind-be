import { callServiceController } from "../controllers/call.controller";
import { CliController } from "../controllers/cli.controller";
import { CommonController } from "../controllers/common.controller";
import { PaypalSandboxController } from "../controllers/paypal_sandbox.controller";
import { SessionController } from "../controllers/session.controller";
import { TrainingController } from "../controllers/training.controller";
import { WebhookController } from "../controllers/webhook.controller";
import { CommonHttpRequest } from "../requests";


const express = require("express");
const router = express.Router();

router.get("/bank-lists",  CommonController.getBankList ); // customer update is profile
router.get("/countries",  CommonController.getCountries ); // customer update is profile
router.get("/skills",  CommonController.getSkills ); // customer update is profile
router.get("/options",  CommonController.getOptions ); // customer update is profile
router.get("/trainings/get-quiz",  TrainingController.getQuiz ); 
router.post("/trainings/submit-quiz",  TrainingController.submitQuiz ); 

router.post("/sessions/clear", CommonHttpRequest.clearSessionParams,  SessionController.clearAuthSession ); 

router.post("/payments/charges", CommonHttpRequest.clearSessionParams,  CommonController.calculateCharges ); 


router.get("/app-versions",  CommonController.getCurrentOrLatestAppVersions ); 


router.post("/webhooks/stripe",  WebhookController.stripeWebook ); // stripe webhook
router.post("/webhooks/certn",  WebhookController.certnWebook ); //  certn webhook
router.post("/webhooks/paypal",  WebhookController.paypalWebhook ); //  certn webhook


router.post("/clear-queue",  CliController.clearQueue ); //
router.post("/test-fcm-notification",  CommonController.sendTestNotification ); //


router.post("/translate",  CommonController.translateText ); //
router.post("/generate-referral-codes",  CommonController.updateExistingUsersWithReferralCodes ); //



router.post("/testing/paypal/create-order",  PaypalSandboxController.createOrder ); //
router.post("/testing/paypal/capture-order",  PaypalSandboxController.captureOrder ); //
router.post("/testing/paypal/authorize-order",  PaypalSandboxController.authorizeOrder ); //
router.post("/testing/paypal/charge-card",  PaypalSandboxController.chargePaymentMethod ); //
router.post("/testing/paypal/create-setup-token",  PaypalSandboxController.createSetupToken ); //

// router.post("/testing/paypal/create-payment-token",  PaypalSandboxController.createPaymentToken ); //



export default router;