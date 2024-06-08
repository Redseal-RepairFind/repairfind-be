import { NotificationService } from "../..";
import { IJob } from "../../../database/common/job.model";
import { PaymentModel } from "../../../database/common/payment.schema";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { IContractor } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { ICustomer } from "../../../database/customer/interface/customer.interface";
import CustomerModel from "../../../database/customer/models/customer.model";
import { Logger } from "../../../utils/logger";
import { StripeService } from "../../stripe";


export const handleJobRefunds = async () => {
    try {
        const transactions = await TransactionModel.find({
            type: TRANSACTION_TYPE.REFUND,
            status: TRANSACTION_STATUS.PENDING
        });


        for (const transaction of transactions) {
            try {

                const fromUser = (transaction.fromUserType == 'customers') ? await CustomerModel.findById(transaction.fromUser) : await ContractorModel.findById(transaction.fromUser)
                const toUser = (transaction.toUserType == 'customers') ? await CustomerModel.findById(transaction.toUser) : await ContractorModel.findById(transaction.toUser)

                
                if (fromUser && toUser) {



                    const payment = await PaymentModel.findById(transaction.payment)
                    if (!payment) {
                        return
                    }

                    // if (!transaction.status) {
                        // const stripePayment = await StripeService.payment.refundCharge(payment.charge, (payment.amount))
                        const stripePayment = await StripeService.payment.refundCharge(payment.charge, (transaction.amount*100) )// convert to cent
                    // }

                }


                await transaction.save()
            } catch (error) {
                Logger.error(`Error processing refund transaction: ${transaction.id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error processing refund transaction:', error);
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

