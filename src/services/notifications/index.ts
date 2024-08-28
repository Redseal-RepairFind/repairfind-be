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
import { NotificationUtil } from '../../utils/notification.util';
import AdminModel from '../../database/admin/models/admin.model';
import { APNNotification } from './apn';
import { FCMNotification } from './fcm';
import { Logger } from '../logger';



export interface SendNotificationData {
    user: string | ObjectId
    userType: string
    title: string
    heading: object
    type: string
    message: string
    payload: any
}


export class NotificationService {

    public static async sendNotification<T>(params: SendNotificationData, options: {
        push?: boolean
        socket?: boolean
        database?: boolean
    } = {
            push: false, // false by default
            socket: true,
            database: true
        }): Promise<void> {


        let user = null
        let deviceTokens: string[] = []
        let devices = []

        params.payload.userType = params.userType
        params.payload.user = params.user
        params.payload.heading = params.heading
        params.payload.data = { ...params.payload }

        if (params.userType == 'contractors') {
            user = await ContractorModel.findById(params.user)
            devices = await ContractorDeviceModel.find({ contractor: user?.id }).select('deviceToken expoToken deviceType')
            deviceTokens = devices.map(device => device.expoToken);
        }

        if (params.userType == 'customers') {
            user = await CustomerModel.findById(params.user)
            devices = await CustomerDeviceModel.find({ customer: user?.id }).select('deviceToken expoToken deviceType')
            deviceTokens = devices.map(device => device.expoToken);
        }

        if (params.userType == 'admins') {
            user = await AdminModel.findById(params.user)
            devices = await CustomerDeviceModel.find({ customer: user?.id }).select('deviceToken expoToken deviceType')
            deviceTokens = devices.map(device => device.expoToken);
        }


        if (!user) return

        if ('firebase' in options) {
        }

        if ('socket' in options) {
            SocketService.sendNotification(user.email, params.type, {
                type: params.type,
                message: params.message,
                data: params.payload
            });

            if (params.type == 'NEW_DISPUTE_MESSAGE' || params.type == 'JOB_BOOKED') {
                // send red alert notification here also, for mobile to update red dots - lol
                const alerts = await NotificationUtil.redAlerts(params.user as ObjectId)
                SocketService.sendNotification(user.email, 'RED_DOT_ALERT', {
                    type: 'RED_DOT_ALERT',
                    message: 'New alert update',
                    data: alerts
                });
            }
        }


        if ('push' in options) {


            let pushLoad: any = {
                title: params.title,
                sound: 'default',
                priority: 'high',
                body: params.message,
                categoryId: params.type,
                channelId: params.type,
                categoryIdentifier: params.type,
                data: {
                    ...params.payload
                },
            }

            if (params.type == 'NEW_INCOMING_CALL') {
                
                devices.map((device) => {
                    if (device.deviceType == 'ANDROID') {

                        const payload = {
                            notification: {
                                title: params.title,
                                body: params.message,
                                channelId: 'call',
                                clickAction: 'default',

                                
                            },
                            androidOptions: { 
                                isBackground: false, 
                                topic: "call"
                            },
                            data: {
                                categoryId: params.type,
                                channelId: params.type,
                                categoryIdentifier: params.type,
                                callId: params.payload.callId,
                                channel: params.payload.channel,
                                heading: JSON.stringify(params.payload.heading),
                                event: params.payload.event,
                                token: params.payload.token ?? '',
                                uid: `"${params.payload.uid}"` ?? '',
                                user: params.payload.user,
                                userType: params.payload.userType
                            }
                        }

                        
                        FCMNotification.sendNotification(device.deviceToken, payload)
                        // FCMNotification.sendBackgroundNotification(device.deviceToken)
                    }
                    if (device.deviceType == 'IOS') {
                        const alert = { title: params.title, body: params.message, }

                        const data = {
                            categoryId: params.type,
                            channelId: params.type,
                            categoryIdentifier: params.type,
                            ...params.payload
                        }
                        const payload = {
                            expiry: Math.floor(Date.now() / 1000) + 3600, // Expires 1 hour from now
                            badge: 3,
                            priority: 10,
                            mutableContent: true,
                            aps: {
                                'content-available': 1,
                                'mutable-content': 1,
                            },
                            sound: 'ringtone.wav',
                            alert: alert,
                            contentAvailable: true,
                            payload: data,
                            topic: (params.userType === 'contractors') ? 'com.krendus.repairfindcontractor' : '@repairfindinc/repairfind-customer',
                        }
                        APNNotification.sendAPN2Notification(device.deviceToken, payload)
                        // APNNotification.sendAPNNotification(device.deviceToken)
                        // APNNotification.sendNotification([device.token],alert, data, options)
                    }
                });


                pushLoad = {
                    _contentAvailable: true,
                    priority: 'high',
                }


            } else {
                sendPushNotifications(deviceTokens, pushLoad)
            }

        }

        if (options.hasOwnProperty('database')) {
            params.payload.message = params.message
            const notification = new NotificationModel(params.payload)
            await notification.save();

            SocketService.sendNotification(user.email, 'NEW_NOTIFICATION', {
                type: 'NEW_NOTIFICATION',
                message: params.message,
                data: params.payload
            });

        }


        return;
    }
}
