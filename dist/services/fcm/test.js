"use strict";
// const { JWT } = require('google-auth-library');
// const axios = require('axios');
// import { config } from '../../config';
// import fs from 'fs';
// import jwt from 'jsonwebtoken'; // Ensure correct import of 'jsonwebtoken'
// import apn from 'apn'
// // Define your constants
// const APPLE_TEAM_ID = "6KFX77X3HH";
// const KEY_ID = "2SUBL2RAVU";
// const KEY_PATH = "./apn.p8";
// const IS_PRODUCTION = false;
// async function getAccessAPNTokenAsync() {
//   try {
//     const authorizationToken = jwt.sign(
//       {
//         iss: APPLE_TEAM_ID,
//         iat: Math.round(new Date().getTime() / 1000),
//       },
//       fs.readFileSync(KEY_PATH, "utf8"),
//       {
//         header: {
//           alg: "ES256",
//           kid: KEY_ID,
//         },
//       }
//     );
//     return authorizationToken;
//   } catch (error: any) {
//     throw new Error(`Failed to get access token: ${error.message}`);
//   }
// }
// export const sendAPNNotification = async (deviceToken: any) => {
//   try {
//     const url = IS_PRODUCTION
//       ? 'https://api.push.apple.com/3/device/' + deviceToken
//       : 'https://api.sandbox.push.apple.com/3/device/' + deviceToken;
//     const AUTHORIZATION_TOKEN = await getAccessAPNTokenAsync()
//     const http2 = require('http2');
//     const client = http2.connect(
//       IS_PRODUCTION ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com'
//     );
//     const request = client.request({
//       ':method': 'POST',
//       ':scheme': 'https',
//       'apns-topic': 'com.krendus.repairfindcontractor',
//       ':path': '/3/device/' + deviceToken, // This is the native device token you grabbed client-side
//       authorization: `bearer ${AUTHORIZATION_TOKEN}`, // This is the JSON web token generated in the "Authorization" step
//     });
//     request.setEncoding('utf8');
//     request.write(
//       JSON.stringify({
//         aps: {
//           // alert: {
//           //   title: "📧 You've got mail!",
//           //   body: 'Hello world! 🌐',
//           // },
//           'content-available': 1,
//         },
//       })
//     );
//     request.end()
//     // Handle the response
//     request.on('response', (headers: any) => {
//       console.log('Response headers:', headers);
//     });
//     let responseBody = '';
//     request.on('data', (chunk: string) => {
//       responseBody += chunk;
//     });
//     request.on('end', () => {
//       console.log('Response body:', responseBody);
//       client.close(); // Close the connection
//     });
//     request.on('error', (error: any) => {
//       console.error('Request error:', error);
//       client.close(); // Ensure connection is closed on error
//     });
//     console.log('Notification sent successfully');
//   } catch (error) {
//     console.error('Error sending APN notification:', error);
//   }
// };
// export const sendAPN2Notification = async (deviceToken: any) => {
//   try {
//     var options = {
//       token: {
//         key: KEY_PATH,
//         keyId: KEY_ID,
//         teamId: APPLE_TEAM_ID
//       },
//       production: false
//     };
//     var apnProvider = new apn.Provider(options);
//     var note = new apn.Notification();
//     note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
//     // note.badge = 3;
//     // note.sound = "ringtone.wav";
//     // note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
//     note.payload = {
//        "aps": {
//         "content-available": 1
//       },
//     };
//     note.topic = "com.krendus.repairfindcontractor";
//     apnProvider.send(note, deviceToken).then((result) => {
//       // console.log(result.failed[0].response)
//       console.log(result)
//     });
//     console.log('Notification sent successfully');
//   } catch (error) {
//     console.error('Error sending APN notification:', error);
//   }
// };
