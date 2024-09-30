import { Request, Response } from "express";
import { StripeService } from "../../../services/stripe";
import { Logger } from "../../../services/logger";
import { PayPalService } from "../../../services/paypal";
import { CertnService } from "../../../services";


export const stripeWebook = async (
  req: Request,
  res: Response,
) => {

  try {
    const sig = <string>req.headers['stripe-signature'];
    const payload = req.body;
    
    StripeService.webhook.StripeWebhookHandler(req)
    res.status(200).end() 

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}

export const certnWebook = async (
  req: Request,
  res: Response,
) => {

  try {
    Logger.info("CERTN WEBHOOK")
    CertnService.webhook.CertnWebhookHandler(req)
    res.status(200).end() 

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}

export const paypalWebhook = async (
  req: Request,
  res: Response,
) => {

  try {
   
    PayPalService.webhook.PayPalWebhookHandler(req)
    Logger.info("PAYPAL WEBHOOK RECEIVED")
    res.status(200).end() 

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}

export const WebhookController = {
    stripeWebook,
    certnWebook,
    paypalWebhook
}
