import { EventEmitter } from 'events';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { EmailService, NotificationService } from '../services';
import { GenericEmailTemplate } from '../templates/common/generic_email';


export const TransactionEvent: EventEmitter = new EventEmitter();

TransactionEvent.on('ESCROW_TRANSFER_SUCCESSFUL', async function (transaction) {
    try {
        console.log('handling ESCROW_TRANSFER_SUCCESSFUL event', transaction.id)

        const fromUser = (transaction.fromUserType == 'customers') ? await CustomerModel.findById(transaction.fromUser) : await ContractorModel.findById(transaction.fromUser)
        const toUser = (transaction.toUserType == 'customers') ? await CustomerModel.findById(transaction.toUser) : await ContractorModel.findById(transaction.toUser)
        if(toUser){
            NotificationService.sendNotification({
                user: toUser.id,
                userType: transaction.toUserType,
                title: 'Fund transfer',
                type: 'FUND_TRANSFER', //
                message: `Fund transfer successful`,
                heading: { name: `${toUser.name}`, image: toUser.profilePhoto?.url },
                payload: {
                    entity: transaction.id,
                    entityType: 'transactions',
                    message: `Fund transfer successful`,
                    customer: toUser.id,
                    event: 'FUND_TRANSFER',
                    transactionId: transaction.id,
                }
            }, { push: true, socket: true })

        
            
        }



    } catch (error) {
        console.error(`Error handling ESCROW_TRANSFER_SUCCESSFUL event: ${error}`);
    }
});
