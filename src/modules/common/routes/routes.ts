import { callServiceController } from "../controllers/call.controller";
import { CliController } from "../controllers/cli.controller";
import { CommonController } from "../controllers/common.controller";
import { WebhookController } from "../controllers/webhook.controller";
import { CustomerHttpRequest } from "../requests";


const express = require("express");
const router = express.Router();

router.get("/bank-lists",  CommonController.getBankList ); // customer update is profile
router.get("/skills",  CommonController.getSkills ); // customer update is profile
router.post("/webhooks/stripe",  WebhookController.stripeWebook ); // stripe webhook
router.post("/webhooks/certn",  WebhookController.certnWebook ); //  certn webhook


router.post("/call", CustomerHttpRequest.callsParams,  callServiceController.callController ); //
router.post("/incoming-call",  callServiceController.incommingCallController ); //

router.post("/clear-queue",  CliController.clearQueue ); //



export default router;