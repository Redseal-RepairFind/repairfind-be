import admin, { ServiceAccount } from 'firebase-admin';
import axios from 'axios';
import { config } from '../../config';
import { Logger } from '../logger';



export const initializeFirebase = async () => {
    try {
        const { data: serviceAccount } = await axios.get(config.google.serviceJson);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount)
        });

        Logger.info('Firebase Admin SDK initialized');
    } catch (error) {
        Logger.error('Error fetching service account JSON:', error);
    }
};



export const sendFCMNotification = async (FcmToken: any, payload: {notification: object, data: any, androidOptions?: any, iosOptions?: object}) => {

    Logger.info("sendFCMNotification",  [FcmToken, payload])
    try {

        const android = (payload.androidOptions?.isBackground) ? {
            data: payload.data, 
            // notification: payload.notification
        } : {
            notification: payload.notification,
            data: payload.data, 
        }

        const message = {
            tokens: [FcmToken], // Ensure FcmToken is a valid array of tokens
            android: android,
            apns: {
                payload: {
                    aps: {
                        alert: payload.notification,
                        ...payload.iosOptions
                    },
                    ...payload.data
                }
            }
        };

        const response = await admin.messaging().sendMulticast(message);
        response.responses.forEach((resp, index) => {
            if (!resp.success) {
                Logger.error(`Error sending message to token ${message.tokens[index]}: ${resp?.error?.message}`);
            } else {
                Logger.info('Notification sent successfully:', response);
            }
        });
        return response;
    } catch (error: any) {
        Logger.error('Error sending notification', error);
    }
};



export const FCMNotification = {sendNotification: sendFCMNotification, initializeFirebase};




