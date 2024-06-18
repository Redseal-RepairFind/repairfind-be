import { EventEmitter } from 'events';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { NotificationService } from '../services';


export const ScheduleEvent: EventEmitter = new EventEmitter();

ScheduleEvent.on('PAYOUT_TRANSFER_SUCCESSFUL', async function (transaction) {
    try {
        console.log('handling PAYOUT_TRANSFER_SUCCESSFUL event', transaction.id)

        const fromUser = (transaction.fromUserType == 'customers') ? await CustomerModel.findById(transaction.fromUser) : await ContractorModel.findById(transaction.fromUser)
        const toUser = (transaction.toUserType == 'customers') ? await CustomerModel.findById(transaction.toUser) : await ContractorModel.findById(transaction.toUser)
        if(toUser){
            NotificationService.sendNotification({
                user: toUser.id,
                userType: 'customers',
                title: 'Payout transfer created',
                type: 'PAYOUT_TRANSFER', //
                message: `Payout transfer`,
                heading: { name: `${toUser.name}`, image: toUser.profilePhoto?.url },
                payload: {
                    entity: transaction.id,
                    entityType: 'transactions',
                    message: `Payout transfer created`,
                    customer: toUser.id,
                    event: 'PAYOUT_TRANSFER',
                    transactionId: transaction.id,
                }
            }, { push: true, socket: true })
        }



    } catch (error) {
        console.error(`Error handling PAYOUT_TRANSFER_SUCCESSFUL event: ${error}`);
    }
});
