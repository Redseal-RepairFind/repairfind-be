import { callServiceController } from "../controllers/call.controller";
import { CommonController } from "../controllers/common.controller";
import { WebhookController } from "../controllers/webhook.controller";
import { CustomerHttpRequest } from "../requests";


const express = require("express");
const router = express.Router();

router.get("/bank-lists",  CommonController.getBankList ); // customer update is profile
router.post("/webhooks/stripe",  WebhookController.stripeWebook ); // customer update is profile
router.post("/call", CustomerHttpRequest.callsParams,  callServiceController.callController ); //
router.post("/incoming-call",  callServiceController.incommingCallController ); //

export default router;