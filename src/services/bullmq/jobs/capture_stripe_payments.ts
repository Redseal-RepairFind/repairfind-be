import TransactionModel, { ITransaction, TRANSACTION_STATUS } from "../../../database/common/transaction.model";
import { Logger } from "../../../utils/logger";
import { StripeService } from "../../stripe";


export const captureStripePayments = async () => {
    try {

 
        const oneDayInMillis = 24 * 60 * 60; // One day in milliseconds
        const daysBeforeNow =  Math.floor( Date.now() / 1000) - (1 * oneDayInMillis); // 1 day(s) before now
        const dayFromNow = Math.floor( Date.now() / 1000) + (2 * oneDayInMillis); // 1 day(s) after now 
        //will charge on the 6th day is 1 if it 2 it will charge on the 5th day, if its 7 it will charge on the same day assuming  capture_before is in 7 days
 
        const paymentCaptures = await TransactionModel.find({
            status: TRANSACTION_STATUS.REQUIRES_CAPTURE,
            'captureDetails.captured': false,
            'captureDetails.capture_before': {
                $gte: daysBeforeNow, 
                $lte: dayFromNow 
            }
        }) as ITransaction[];

        for (const transaction of paymentCaptures) {
            try {
                await StripeService.payment.capturePayment(transaction.captureDetails.payment_intent);
                
                // I should wait for webhook before updating transaction
                // transaction.captureDetails.captured = true;
                // transaction.status = TRANSACTION_STATUS.SUCCESSFUL
                // await transaction.save();

                Logger.info(`Successfully captured payment for payment ID: ${transaction._id}`);
            } catch (error) {
                Logger.error(`Error capturing payment for payment ID: ${transaction._id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error occurred while capturing payments:', error);
    }
};
