import { ContractorModel } from '../../database/contractor/models/contractor.model';
import ContractorDeviceModel from '../../database/contractor/models/contractor_devices.model';
import ContractorNotificationModel from '../../database/contractor/models/contractor_notification.model';
import CustomerModel from '../../database/customer/models/customer.model';
import CustomerDeviceModel from '../../database/customer/models/customer_devices.model';
import CustomerNotificationModel from '../../database/customer/models/customer_notification.model';
import { sendPushNotifications } from '../expo';
import SocketService from '../socket';



export interface SendNotificationData {
    userId: string // fcmTokens, expoDeviceTokens, userEmails
    userType: string // fcmTokens, expoDeviceTokens, userEmails
    title: string
    type: string
    message: string
    payload: any
}


export class NotificationService  {

    public static async sendNotification<T>(params: SendNotificationData, options: {
        push?: boolean
        socket?: boolean
        database?: boolean
    } = {
        push: false, // false by default
        socket: true,
        database: true
    } ): Promise<void> {

        
        let user = null
        let deviceTokens :string[] = []
        let devices  = []
        

        if(params.userType == 'contractor'){
            user  = await ContractorModel.findById(params.userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }
        
        if(params.userType == 'customer'){
            user  = await CustomerModel.findById(params.userId)
            devices = await CustomerDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }
        
    
        if(!user) return

        if ( 'firebase' in options ) {
        }

        if ('socket' in options) {
            SocketService.sendNotification(user.email, params.type, {
                type: params.type, 
                message: params.message, 
                data: params.payload
            });
        }
        if ('push' in options) {
            sendPushNotifications( deviceTokens , {
                title: 'Identity Verification',
                icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                body: 'Identity verification session created',
                data: { 
                    event: 'identity.verification_session.created',
                    payload: params.payload
                },
            })


        }
       
        if (options.hasOwnProperty('database')) {
            if(params && params.payload.customer){
                const customerNotification = new CustomerNotificationModel(params.payload)
                await customerNotification.save();
            }

           if(params && params.payload.contractor){
            const customerNotification = new ContractorNotificationModel(params.payload)
            await customerNotification.save();
           }
        }

       

        return;
    }
}
