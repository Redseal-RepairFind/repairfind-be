import { title } from 'process';
import NotificationModel from '../../database/common/notification.model';
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import ContractorDeviceModel from '../../database/contractor/models/contractor_devices.model';
import CustomerModel from '../../database/customer/models/customer.model';
import CustomerDeviceModel from '../../database/customer/models/customer_devices.model';
import { sendPushNotifications } from '../expo';
import { SocketService } from '../socket';
import { ObjectId } from 'mongoose';
import { url } from 'inspector';



export interface SendNotificationData {
    user: string|ObjectId 
    userType: string 
    title: string
    heading: object
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

        params.payload.userType = params.userType
        params.payload.user = params.user
        params.payload.heading = params.heading
        
        if(params.userType == 'contractors'){
            user  = await ContractorModel.findById(params.user)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }
        
        if(params.userType == 'customers'){
            user  = await CustomerModel.findById(params.user)
            devices = await CustomerDeviceModel.find({customer: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }
        
        if(params.userType == 'admins'){
            user  = await CustomerModel.findById(params.user)
            devices = await CustomerDeviceModel.find({customer: user?.id}).select('deviceToken')
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
                title: params.title, 
                sound: 'default',
                priority: params.type == 'NEW_INCOMING_CALL'  ? 'normal' : 'high', 
                body:   params.message,
                categoryId: params.type == 'NEW_INCOMING_CALL'  ? 'call' : params.type,
                channelId: params.type == 'NEW_INCOMING_CALL'  ? 'call' : params.type,
                data: { 
                    ...params.payload,
                    _displayInForeground: true
                },
            })

        }
       
        if (options.hasOwnProperty('database')) {
            params.payload.message = params.message
            const notification = new NotificationModel(params.payload)
            await notification.save();

            SocketService.sendNotification(user.email, params.type, {
                type: 'NEW_NOTIFICATION', 
                message: params.message, 
                data: params.payload
            });

        }

    
        return;
    }
}
