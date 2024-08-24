import admin, { ServiceAccount } from 'firebase-admin';
import axios from 'axios';
import { config } from '../../config';
import { Logger } from '../logger';



const initializeFirebase = async () => {
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



export const sendFCMNotification = async (FcmToken: any, payload: {notification: object, data: any, androidOptions?: object, iosOptions?: object}) => {
    try {
        const message = {
            tokens: [FcmToken], // Ensure FcmToken is a valid array of tokens
            android: {
                notification: payload.notification,
                data: payload.data, // Ensure payload is an object with string values only
            },

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


initializeFirebase();



export const FCMNotification = {sendNotification: sendFCMNotification};




