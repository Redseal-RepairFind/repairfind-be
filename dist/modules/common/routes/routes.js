"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_controller_1 = require("../controllers/cli.controller");
var common_controller_1 = require("../controllers/common.controller");
var paypal_sandbox_controller_1 = require("../controllers/paypal_sandbox.controller");
var session_controller_1 = require("../controllers/session.controller");
var training_controller_1 = require("../controllers/training.controller");
var webhook_controller_1 = require("../controllers/webhook.controller");
var requests_1 = require("../requests");
var express = require("express");
var router = express.Router();
router.get("/bank-lists", common_controller_1.CommonController.getBankList); // customer update is profile
router.get("/countries", common_controller_1.CommonController.getCountries); // customer update is profile
router.get("/skills", common_controller_1.CommonController.getSkills); // customer update is profile
router.get("/options", common_controller_1.CommonController.getOptions); // customer update is profile
router.get("/trainings/get-quiz", training_controller_1.TrainingController.getQuiz);
router.post("/trainings/submit-quiz", training_controller_1.TrainingController.submitQuiz);
router.post("/sessions/clear", requests_1.CommonHttpRequest.clearSessionParams, session_controller_1.SessionController.clearAuthSession);
router.post("/payments/charges", requests_1.CommonHttpRequest.clearSessionParams, common_controller_1.CommonController.calculateCharges);
router.get("/app-versions", common_controller_1.CommonController.getCurrentOrLatestAppVersions);
router.post("/webhooks/stripe", webhook_controller_1.WebhookController.stripeWebook); // stripe webhook
router.post("/webhooks/certn", webhook_controller_1.WebhookController.certnWebook); //  certn webhook
router.post("/webhooks/paypal", webhook_controller_1.WebhookController.paypalWebhook); //  certn webhook
router.post("/clear-queue", cli_controller_1.CliController.clearQueue); //
router.post("/test-fcm-notification", common_controller_1.CommonController.sendTestNotification); //
router.post("/translate", common_controller_1.CommonController.translateText); //
router.post("/generate-referral-codes", common_controller_1.CommonController.updateExistingUsersWithReferralCodes); //
router.post("/testing/paypal/create-order", paypal_sandbox_controller_1.PaypalSandboxController.createOrder); //
router.post("/testing/paypal/capture-order", paypal_sandbox_controller_1.PaypalSandboxController.captureOrder); //
router.post("/testing/paypal/authorize-order", paypal_sandbox_controller_1.PaypalSandboxController.authorizeOrder); //
router.post("/testing/paypal/charge-card", paypal_sandbox_controller_1.PaypalSandboxController.chargePaymentMethod); //
router.post("/testing/paypal/create-setup-token", paypal_sandbox_controller_1.PaypalSandboxController.createSetupToken); //
// router.post("/testing/paypal/create-payment-token",  PaypalSandboxController.createPaymentToken ); //
exports.default = router;
