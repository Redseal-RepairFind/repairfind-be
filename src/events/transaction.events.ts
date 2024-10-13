import { EventEmitter } from 'events';
import CustomerModel from '../database/customer/models/customer.model';
import { ContractorModel } from '../database/contractor/models/contractor.model';
import { EmailService, NotificationService } from '../services';
import { GenericEmailTemplate } from '../templates/common/generic_email';
import { COUPON_STATUS, COUPON_TYPE, CouponModel } from '../database/common/coupon.schema';
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../database/common/transaction.model';


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


            //check if there are  accumalated 25 dollars bonus for the contractor and create a transaction for payout here
            if(transaction.toUserType === 'contractors'){
                const coupons = await CouponModel.find({user: toUser.id, userType: 'contractors', status: COUPON_STATUS.ACTIVE, type: COUPON_TYPE.REFERRAL_BONUS })
                coupons.map(async (coupon)  =>{
                     //create refund transaction for each payment
            await TransactionModel.create({
                type: TRANSACTION_TYPE.REFUND,
                amount: coupon.value,
                toUser: coupon.user,
                toUserType: coupon.userType,
                description: `Referal Bonus Payment for: ${coupon?.code}`,
                status: TRANSACTION_STATUS.APPROVED,
                remark: 'bonus_payout',
                invoice: {
                    items: [],
                    charges: {amount: coupon.value}
                },
                metadata: {
                    ...coupon,
                    amount: coupon.value
                },

            })
                })
            }
        }

        
    } catch (error) {
        console.error(`Error handling ESCROW_TRANSFER_SUCCESSFUL event: ${error}`);
    }
});
