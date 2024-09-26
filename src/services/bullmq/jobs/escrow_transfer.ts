import { NotificationService } from "../..";
import { IJob } from "../../../database/common/job.model";
import { PaymentModel } from "../../../database/common/payment.schema";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { IContractor } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { ICustomer } from "../../../database/customer/interface/customer.interface";
import { TransactionEvent } from "../../../events/transaction.events";
import { Logger } from "../../logger";
import { PayPalService } from "../../paypal";
import { StripeService } from "../../stripe";


export const handleEscrowTransfer = async () => {
    try {
        const transactions = await TransactionModel.find({
            type: TRANSACTION_TYPE.ESCROW,
            status: TRANSACTION_STATUS.APPROVED
        });


        // to test, add money to account: 
        // await StripeService.payment.createTestCharge()

        for (const transaction of transactions) {
            try {

                const toUser = await ContractorModel.findById(transaction.toUser)
                if (!toUser) throw 'Contractor not found'

                const payment = await PaymentModel.findById(transaction.payment)
                if (!payment) return

                if (payment.channel == 'stripe') {
                    const toUserStripeConnectAccount = toUser?.stripeAccount;
                    if (!toUserStripeConnectAccount) throw 'Contractor does not have an active connect account'

                    const connectAccountId = toUserStripeConnectAccount.id
                    const amount = (transaction.amount * 100) // change to base currency

                    const transactionMeta = transaction.metadata
                    let metadata: any = { ...transactionMeta } ?? {}
                    metadata.transactionId = transaction.id
                    metadata.paymentId = payment.id

                    const stripeTransfer = await StripeService.transfer.createTransfer(connectAccountId, amount, metadata)

                    metadata.transfer = stripeTransfer
                    transaction.metadata = metadata
                    transaction.status = TRANSACTION_STATUS.SUCCESSFUL
                }

                if(payment.channel == 'paypal'){

                    const amount = (transaction.amount * 100) // change to base currency
                    const paypalTransfer  = await PayPalService.payout.transferToEmail(toUser.email, amount, 'CAD' )
                    
                    const transactionMeta = transaction.metadata
                    let metadata: any = { ...transactionMeta } ?? {}
                    metadata.transactionId = transaction.id
                    metadata.paymentId = payment.id
                    metadata.transfer = paypalTransfer
                    transaction.metadata = metadata
                    transaction.status = TRANSACTION_STATUS.SUCCESSFUL
                }


                

                await transaction.save()
                TransactionEvent.emit('ESCROW_TRANSFER_SUCCESSFUL ', transaction)

            } catch (error) {
                Logger.info(`Error processing payout transfer: ${transaction.id}`, error);

            }
        }

    } catch (error) {

        Logger.error('Error processing handleEscrowTransfer:', error);
    }
};

