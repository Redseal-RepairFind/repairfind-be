"use strict";
// import admin, { ServiceAccount } from 'firebase-admin';
// import axios from 'axios';
// import { config } from '../../config';
// import { JWT } from 'google-auth-library';
// const initializeFirebase = async () => {
//     try {
//         const { data: serviceAccount } = await axios.get(config.google.serviceJson);
//         admin.initializeApp({
//             credential: admin.credential.cert(serviceAccount as ServiceAccount)
//         });
//         console.log('Firebase Admin SDK initialized');
//     } catch (error) {
//         console.error('Error fetching service account JSON:', error);
//     }
// };
// const sendWebNotification = async (FcmToken: any) => {
//     try {
//         const message = {
//             tokens: [FcmToken], // Ensure FcmToken is a valid array of tokens
//             android: {
//                 // notification: {       // Use 'notification' for title and body
//                 //     title: 'Title of Notification',     // Dynamic title
//                 //     body: '<b>Body of Notification</b>',       // Dynamic body
//                 //     image: "https://example.com/path-to-your-image.jpg"  // URL to the image
//                 // },
//                 data: {
//                     imageUrl: "https://www.localenterprise.ie/images_upload/DublinCity/DublinCityImages/Logo____.PNG",
//                 },
//             },
//             apns: {
//                 payload: {
//                     aps: {
//                         alert: {
//                             title: 'req.body.title' || "Title",
//                             body: 'req.body.body' || "Message Body",
//                         },
//                         'mutable-content': 1
//                     }
//                 },
//                 fcm_options: {
//                     image: 'https://example.com/path-to-image.jpg'
//                 }
//             },
//             webpush: {            // Add optional webpush settings
//                 fcm_options: {
//                     link: "http://localhost:8081"
//                 },
//                 notification: {
//                     icon: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dpromotion&psig=AOvVaw1_Rrmp4e8rVEG3eY4iCsBj&ust=1724453872296000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjjybjZiYgDFQAAAAAdAAAAABAJg"
//                 }
//             }
//         };
//         const response = await admin.messaging().sendMulticast(message);
//         console.log('Notification sent successfully:', response);
//         // Process response to check for failures
//         response.responses.forEach((resp, index) => {
//             if (!resp.success) {
//                 console.log(`Error sending message to token ${message.tokens[index]}: ${resp?.error?.message}`);
//             }
//         });
//         return response;
//     } catch (error: any) {
//         console.error('Error sending notification', error.message);
//     }
// };
// initializeFirebase();
// export default sendWebNotification;
