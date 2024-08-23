const { JWT } = require('google-auth-library');
const axios = require('axios');
import { config } from '../../config';
import fs from 'fs';
import jwt from 'jsonwebtoken'; // Ensure correct import of 'jsonwebtoken'
import apn from 'apn'
import { ApnsClient, Notification, SilentNotification, Errors } from 'apns2';
import { Logger } from '../logger';


const IS_PRODUCTION = false // config.apple.env === 'production';

async function getAccessAPNTokenAsync() {
  try {
    const authorizationToken = jwt.sign(
      {
        iss: config.apple.teamId,
        iat: Math.round(new Date().getTime() / 1000),
      },
      fs.readFileSync('./apn.p8', "utf8"),
      {
        header: {
          alg: "ES256",
          kid: config.apple.keyId,
        },
      }
    );

    return authorizationToken;
  } catch (error: any) {
    throw new Error(`Failed to get access token: ${error.message}`);
  }
}



export const sendAPNNotification = async (deviceToken: any) => {
  try {
    const url = IS_PRODUCTION
      ? 'https://api.push.apple.com/3/device/' + deviceToken
      : 'https://api.sandbox.push.apple.com/3/device/' + deviceToken;

    const AUTHORIZATION_TOKEN = await getAccessAPNTokenAsync()
    const http2 = require('http2');
    const client = http2.connect(
      IS_PRODUCTION ? 'https://api.push.apple.com' : 'https://api.sandbox.push.apple.com'
    );

    const request = client.request({
      ':method': 'POST',
      ':scheme': 'https',
      'apns-topic': 'com.krendus.repairfindcontractor',
      "apns-priority": "10", // Priority set to 10 for immediate delivery
      // "apns-push-type": "background", // Set to 'voip' for VoIP notifications
      ':path': '/3/device/' + deviceToken, // This is the native device token you grabbed client-side
      authorization: `bearer ${AUTHORIZATION_TOKEN}`, // This is the JSON web token generated in the "Authorization" step
    });

    request.setEncoding('utf8');

    request.write(
      JSON.stringify({
        aps: {
          'content-available': 1,
          "sound": "ringtone.wav",
          alert: {
            title: "📧 You've got mail!",
            body: 'Hello world! 🌐',
          },
        },
      })
    );
    request.end()

    // Handle the response
    request.on('response', (headers: any) => {
      console.log('Response headers:', headers);
    });

    let responseBody = '';
    request.on('data', (chunk: string) => {
      responseBody += chunk;
    });

    request.on('end', () => {
      console.log('Response body:', responseBody);
      client.close(); // Close the connection
    });

    request.on('error', (error: any) => {
      console.error('Request error:', error);
      client.close(); // Ensure connection is closed on error
    });


    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending APN notification:', error);
  }
};



export const sendAPN2Notification = async (deviceToken: string): Promise<void> => {
  const options = {
    token: {
      key: './apn.p8',
      keyId: config.apple.keyId,
      teamId: config.apple.teamId,
    },
    production: IS_PRODUCTION,
  };

  const apnProvider = new apn.Provider(options);

  const note = new apn.Notification({
    expiry: Math.floor(Date.now() / 1000) + 3600, // Expires 1 hour from now
    badge: 3,
    priority: 10,
    mutableContent: true,
    aps: {
      'content-available': 1,
      'mutable-content': 1,
    },
  
    sound: 'ringtone.wav',
    alert: '\uD83D\uDCE7 \u2709 You have a new message',
    contentAvailable: true,
    payload: {},
    topic: 'com.krendus.repairfindcontractor',
  });

  
  try {
    const result = await apnProvider.send(note, deviceToken);
    if (result.failed.length > 0) {
      Logger.error('Failed to send notification:', result.failed[0].response);
    } else {
      Logger.info(result)
      Logger.info('Notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending APN notification:', error);
  } finally {
    apnProvider.shutdown();
  }
};


// Function to send a notification
export const sendNotification = async (
  deviceTokens: string[],
  alert: any,
  options: object,
  data?: Record<string, unknown>, // Explicitly typed as Record<string, unknown>
): Promise<void> => {

  // Initialize the APNs client
  const client = new ApnsClient({
    team: config.apple.teamId,
    keyId: config.apple.keyId,
    signingKey: fs.readFileSync('./apn.p8'),
    defaultTopic: 'com.krendus.repairfindcontractor',
    requestTimeout: 0, // optional, Default: 0 (without timeout)
    keepAlive: true, // optional, Default: 5000
    host: 'api.sandbox.push.apple.com'
  });

  // Error handling
  client.on(Errors.badDeviceToken, (err) => {
    Logger.error('Bad device token:', err);
    // Handle bad device token accordingly (e.g., remove from database)
  });

  client.on(Errors.error, (err) => {
    Logger.error('APNs error:', err);
    // Handle other errors
  });


  const notifications = deviceTokens.map(token => new Notification(token, {
    alert,
    data,
    ...options,
  }));

  try {
    await client.sendMany(notifications);
    Logger.info('Notifications sent successfully');
  } catch (err: any) {
    Logger.info('Error sending notifications:', err.reason);
  }
};

// Function to send a silent notification
export const sendSilentNotification = async (deviceTokens: string[]): Promise<void> => {


  // Initialize the APNs client
  const client = new ApnsClient({
    team: config.apple.teamId,
    keyId: config.apple.keyId,
    signingKey: fs.readFileSync('./apn.p8'),
    defaultTopic: 'com.krendus.repairfindcontractor',
    requestTimeout: 0, // optional, Default: 0 (without timeout)
    keepAlive: true, // optional, Default: 5000
    host: 'api.sandbox.push.apple.com'
  });

  // Error handling
  client.on(Errors.badDeviceToken, (err) => {
    Logger.error('Bad device token:', err);
    // Handle bad device token accordingly (e.g., remove from database)
  });

  client.on(Errors.error, (err) => {
    Logger.error('APNs error:', err);
    // Handle other errors
  });


  const notifications = deviceTokens.map(token => new SilentNotification(token));

  try {
    await client.sendMany(notifications);
    Logger.info('Silent notifications sent successfully');
  } catch (err: any) {
    Logger.error('Error sending silent notifications:', err.reason);
  }
};




export const APNNotification = {
  sendNotification,
  sendSilentNotification,
  sendAPN2Notification
}