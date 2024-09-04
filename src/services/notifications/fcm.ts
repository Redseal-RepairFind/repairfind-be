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
            priority: 'high' as const,
        } : {
            notification: payload.notification,
            data: payload.data, 
        }


        const message = {
            tokens: [FcmToken], // Ensure FcmToken is a valid array of tokens
            android: android,
            // ...payload.androidOptions
            // apns: {
            //     payload: {
            //         aps: {
            //             alert: payload.notification,
            //             ...payload.iosOptions
            //         },
            //         ...payload.data
            //     }
            // }
        };

        // const subRes = await admin.messaging().subscribeToTopic(FcmToken, 'call')
        // Logger.info('subscribeToTopic', subRes);


        const response = await admin.messaging().sendMulticast(message);
        response.responses.forEach((resp, index) => {
            if (!resp.success) {
                Logger.error(`Error sending message to token ${message.tokens[index]}: ${resp?.error?.message}`);
            } else {
                Logger.info('Notification sent successfully:', response);
            }
        });

        // const unSubRes = await admin.messaging().unsubscribeFromTopic(FcmToken, 'call')
        // Logger.info('unsubscribeFromTopic', unSubRes);

        return response;
    } catch (error: any) {
        Logger.error('Error sending notification', error);
    }
};



export const sendBackgroundNotification = (registrationToken: string) => {
    // Define the message payload
    const message = {
      token: registrationToken, // Target device token
      notification: {
        title: 'title',
        body: 'body'
      },
      data: {}, // Ensure data is defined (can be empty object if not used)
      android: {
        priority: 'high' as const, // Use 'as const' to strictly type the value
      },
      apns: {
        headers: {
          'apns-priority': '10', // iOS equivalent of high priority
        },
        payload: {
          aps: {
            'content-available': 1, // Required for background notifications in iOS
          }
        }
      }
    };
  
    // Send the message using Firebase Admin SDK
    admin.messaging().send(message)
      .then(response => {
        console.log('Successfully sent message:', response);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };
  
  


  


export const FCMNotification = {sendNotification: sendFCMNotification, initializeFirebase, sendBackgroundNotification};




