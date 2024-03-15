"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_controller_1 = require("../controllers/common.controller");
var webhook_controller_1 = require("../controllers/webhook.controller");
var express = require("express");
var router = express.Router();
router.get("/bank-lists", common_controller_1.CommonController.getBankList); // customer update is profile
router.post("/webhooks/stripe", webhook_controller_1.WebhookController.stripeWebook); // customer update is profile
exports.default = router;
