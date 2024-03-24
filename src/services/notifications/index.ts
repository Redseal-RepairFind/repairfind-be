import SocketService from '../socket';



export interface SendNotificationData {
    channels: string[] // fcmTokens, expoDeviceTokens, userEmails
    title: string
    type: string
    message: string
    payload: string
}


export class NotificationService  {

    public static async sendNotification<T>(params: SendNotificationData, options?: {
        firebase: boolean
        socket: boolean
        expo: boolean
    }): Promise<void> {

        if (options?.firebase) {
        }
        if (options?.socket) {
            SocketService.sendNotification(params.channels, params.type, {
                type: params.type, 
                message: params.message, 
                data: params.payload
            });
        }
        if (options?.expo) {
            
        }
        return;
    }
}
