import { CommonController } from "../controllers/common.controller";
import { WebhookController } from "../controllers/webhook.controller";


const express = require("express");
const router = express.Router();

router.get("/bank-lists",  CommonController.getBankList ); // customer update is profile
router.post("/webhooks/stripe",  WebhookController.stripeWebook ); // customer update is profile


export default router;