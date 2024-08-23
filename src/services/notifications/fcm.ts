import admin, { ServiceAccount } from 'firebase-admin';
import axios from 'axios';
import { config } from '../../config';



const initializeFirebase = async () => {
    try {
        const { data: serviceAccount } = await axios.get(config.google.serviceJson);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount)
        });

        console.log('Firebase Admin SDK initialized');
    } catch (error) {
        console.error('Error fetching service account JSON:', error);
    }
};



export const sendFCMNotification = async (FcmToken: any, notification: object, options: any, payload: any) => {
    try {
        const message = {
            tokens: [FcmToken], // Ensure FcmToken is a valid array of tokens
            android: {
                notification,
                data:payload,
            },

            apns: {
                payload: {
                    aps: {
                        alert: notification,
                        badge: options.badge,
                    },
                }
            },

            webpush: {            // Add optional webpush settings
                fcm_options: {
                    link: "http://localhost:8081"
                },
                notification: {
                    icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dpromotion&psig=AOvVaw1_Rrmp4e8rVEG3eY4iCsBj&ust=1724453872296000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjjybjZiYgDFQAAAAAdAAAAABAJg"
                }
            }
        };

        const response = await admin.messaging().sendMulticast(message);
        response.responses.forEach((resp, index) => {
            if (!resp.success) {
                console.log(`Error sending message to token ${message.tokens[index]}: ${resp?.error?.message}`);
            }else{
                console.log('Notification sent successfully:', response);
            }
        });
        return response;
    } catch (error: any) {
        console.error('Error sending notification', error.message);
    }
};

initializeFirebase();



export const FCMNotification = {sendNotification: sendFCMNotification};




