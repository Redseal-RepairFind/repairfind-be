import Admin from 'firebase-admin';
// import {IUserAuthToken, NotificationDb, UserDb, UserTokenDb} from '../database';
import { APIFeatures } from '../../utils/api.feature';
import { Logger } from '../../utils/logger';


// const serviceAccount = require('../../config/repairfind-firebase-adminsdk-b6t29-6c7fb4e01a.json');

Admin.initializeApp({
    // credential: Admin.credential.cert(serviceAccount)
});

export interface SendNotificationData {
    user: string
    title: string
    message: string
}

export interface sendMulticastNotification {
    title: string;
    body: string;
    userIds?: Array<string>;
}

export class NotificationService  {

    public static async sendNotification<T>(params: SendNotificationData, options?: {
        writeToDatabase: boolean
    }): Promise<void> {

        // if (options?.writeToDatabase) {
        //     await NotificationDb.create({
        //         user: params.user,
        //         message: params.message,
        //         title: params.title
        //     });
        // }

        // const user = await UserTokenDb.findById<IUserAuthToken>(params.user);

        // if (!user) {
        //     return;
        // }

        // const fcmToken = user.fcmToken;

        // if (!fcmToken) {
        //     return;
        // }
        // const payload = {
        //     notification: {
        //         title: params.title,
        //         message: params.message
        //     }
        // };
        // await Admin.messaging().sendToDevice(fcmToken, payload, {
        //     priority: 'high',
        //     timeToLive: 60 * 60 * 24
        // });
        return;
    }

    public static async fetchNotifications(params: any): Promise<any> {
        // const userId = params.userId;
        // const query = <unknown>params.query;
        // let filter = {user: userId, deleted: false};
        // const features = new APIFeatures(NotificationDb.find(filter), query)
        //     .filter().sort().limitFields().paginate();
        // const limit = features.queryString.limit;
        // const page = features.queryString.page;
        // const notifications = await features.query;
        // const count = await NotificationDb.countDocuments(filter);
        // await NotificationDb.updateMany(filter, {read: true}, {new: true});
        
        // return {
        //     totalCount: count,
        //     limit, page,
        //     lastPage: Math.ceil(count / limit),
        //     notifications
        // }
    }

    public static async sendMultiCastNotification(params: sendMulticastNotification) {
        // try {
        //     let fcmTokens = [] as Array<string> | undefined
        //     if (params.userIds) {
        //         fcmTokens = await this.getFcmTokensForCustomUsersWithEnabledNotifications(params.userIds);
        //     } else {
        //         fcmTokens = await this.getFcmTokensForUsersWithEnabledNotifications(); // Implement a function to get user tokens
        //     }
        //     const message: Admin.messaging.MulticastMessage = {
        //         data: {
        //             title: params.title,
        //             body: params.body,
        //         },
        //         tokens: <string[]>fcmTokens,
        //     };
        //     const response = await Admin.messaging().sendMulticast(message);
        //     console.log('Notifications sent successfully:', response);
        // } catch (error) {
        //     Logger.Error('send multicast notification encountered an error', error)
        //     console.error('Error sending notifications:', error);
        // }
    }


    private static async getFcmTokensForUsersWithEnabledNotifications() {
        // try {
        //     const usersWithEnabledNotifications = await UserDb.find({
        //         'notificationPreference.enableNotification': true,
        //     }).select('user');

        //     const userIds: string[] = usersWithEnabledNotifications.map((user:any) => user.id);

        //     const fcmTokens = await UserTokenDb.find<IUserAuthToken>({user: {$in: userIds}}).select('fcmToken');
        //     console.log(fcmTokens)
        //     return fcmTokens.map((fcmToken: { fcmToken: string }) => fcmToken.fcmToken);
        // } catch (error: unknown) {
        //     Logger.Error('Error getting users FCM Tokens', error)
        // }
    }

    private static async getFcmTokensForCustomUsersWithEnabledNotifications(userIds: string[]): Promise<string[]> {
        // try {
        //     const usersWithEnabledNotifications = await UserDb.find({
        //         'notificationPreference.enableNotification': true,
        //         _id: {$in: userIds},
        //     }).select('user');

        //     const existingUserIds = usersWithEnabledNotifications.map((user: any) => user.id);

        //     // Ensure the retrieved user IDs match the provided user IDs
        //     const missingUserIds = userIds.filter(userId => !existingUserIds.includes(userId));
        //     if (missingUserIds.length > 0) {
        //         console.warn(`User IDs not found, notification will not be sent: ${missingUserIds}`);
        //     }

        //     const fcmTokens = await UserTokenDb.find<IUserAuthToken>({user: {$in: existingUserIds}}).select('fcmToken');
        //     console.log(fcmTokens);
        //     return fcmTokens.map((fcmToken: { fcmToken: string }) => fcmToken.fcmToken);
        // } catch (error: unknown) {
        //     Logger.Error('Error getting users FCM Tokens', error);
            return [];
        // }
    }

    public static async deleteNotification(req: any): Promise<any> {
        // const notificationId = <string>req.params.id;
        // await NotificationDb.findByIdAndUpdate(notificationId, {deleted: true});
    }
}
