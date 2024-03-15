import { Request, Response } from "express";
import { StripeService } from "../../../services/stripe";
import { Log } from "../../../utils/logger";


export const stripeWebook = async (
  req: Request,
  res: Response,
) => {

  try {
    const sig = <string>req.headers['stripe-signature'];
    const payload = req.body;
    Log.info([sig, payload])
    
    StripeService.webhook.StripeWebhookHandler(req)
    res.status(200).end() 

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}

export const WebhookController = {
    stripeWebook,
}
