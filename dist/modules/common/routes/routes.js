"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var call_controller_1 = require("../controllers/call.controller");
var common_controller_1 = require("../controllers/common.controller");
var webhook_controller_1 = require("../controllers/webhook.controller");
var requests_1 = require("../requests");
var express = require("express");
var router = express.Router();
router.get("/bank-lists", common_controller_1.CommonController.getBankList); // customer update is profile
router.post("/webhooks/stripe", webhook_controller_1.WebhookController.stripeWebook); // customer update is profile
router.post("/webhooks/certn", webhook_controller_1.WebhookController.certnWebook); // customer update is profile
router.post("/call", requests_1.CustomerHttpRequest.callsParams, call_controller_1.callServiceController.callController); //
router.post("/incoming-call", call_controller_1.callServiceController.incommingCallController); //
exports.default = router;
