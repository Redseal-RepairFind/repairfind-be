import { IPayment, PaymentModel } from "../../../database/common/payment.schema";
import { Logger } from "../../logger";
import { StripeService } from "../../stripe";


export const captureStripePayments = async () => {
    try {

 
        const oneDayInMillis = 24 * 60 * 60; // One day in milliseconds
        const daysBeforeNow =  Math.floor( Date.now() / 1000) - (1 * oneDayInMillis); // 1 day(s) before now
        const dayFromNow = Math.floor( Date.now() / 1000) + (2 * oneDayInMillis); // 1 day(s) after now 
        //will charge on the 6th day is 1 if it 2 it will charge on the 5th day, if its 7 it will charge on the same day assuming  capture_before is in 7 days
 
        const paymentCaptures = await PaymentModel.find({
            // status: TRANSACTION_STATUS.REQUIRES_CAPTURE,
            captured: false,
            'capture.capture_before': {
                $gte: daysBeforeNow, 
                $lte: dayFromNow 
            }
        }) as IPayment[];

        for (const payment of paymentCaptures) {
            try {
                await StripeService.payment.capturePayment(payment.capture.payment_intent);
                
                // I should wait for webhook before updating transaction
                // transaction.capture.captured = true;
                // transaction.status = TRANSACTION_STATUS.SUCCESSFUL
                // await transaction.save();

                Logger.info(`Successfully captured payment for payment ID: ${payment.id}`);
            } catch (error) {
                Logger.error(`Error capturing payment for payment ID: ${payment.id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error occurred while capturing payments:', error);
    }
};
