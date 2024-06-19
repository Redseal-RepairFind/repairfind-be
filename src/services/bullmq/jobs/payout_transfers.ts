import { NotificationService } from "../..";
import { IJob } from "../../../database/common/job.model";
import { PaymentModel } from "../../../database/common/payment.schema";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { IContractor } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { ICustomer } from "../../../database/customer/interface/customer.interface";
import { TransactionEvent } from "../../../events/transaction.events";
import { Logger } from "../../../utils/logger";
import { StripeService } from "../../stripe";


export const handlePayoutTransfer = async () => {
    try {
        const transactions = await TransactionModel.find({
            type: TRANSACTION_TYPE.TRANSFER,
            status: TRANSACTION_STATUS.APPROVED
        });


        // to test, add money to account: 
        // await StripeService.payment.createTestCharge()
        
        for (const transaction of transactions) {
            try {

                const toUser =  await ContractorModel.findById(transaction.toUser)
                 if(!toUser) throw 'Contractor not found'

                const toUserStripeConnectAccount = toUser?.stripeAccount;
                if(!toUserStripeConnectAccount) throw 'Contractor does not have an active connect account'
               
                const connectAccountId  = toUserStripeConnectAccount.id

                const payment = await PaymentModel.findById(transaction.payment)
                if (!payment) return

                const amount = (transaction.amount * 100) // change to base currency

                const transactionMeta = transaction.metadata
                let metadata: any = { ...transactionMeta } ?? {}
                metadata.transactionId = transaction.id
                metadata.paymentId = payment.id
                
                const stripeTransfer = await StripeService.transfer.createTransfer(connectAccountId, amount, metadata)

                metadata.transfer = stripeTransfer
                transaction.metadata = metadata
                transaction.status = TRANSACTION_STATUS.SUCCESSFUL

                await transaction.save()
                //emit event and handle notifications from there ?

                TransactionEvent.emit('PAYOUT_TRANSFER_SUCCESSFUL', transaction)
                
            } catch (error) {
                Logger.error(`Error processing payout transfer: ${transaction.id}`, error);
            }
        }
        
    } catch (error) {
        Logger.error('Error processing payout transfer:', error);
    }
};



function sendNotification(customer: ICustomer, contractor: IContractor, job: IJob, message: any) {
    NotificationService.sendNotification({
        user: contractor.id,
        userType: 'contractors',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: `${customer.name}`, image: customer.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true })

    // reminder to customer
    NotificationService.sendNotification({
        user: customer.id,
        userType: 'customers',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: `${contractor.name}`, image: contractor.profilePhoto?.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true })
}

