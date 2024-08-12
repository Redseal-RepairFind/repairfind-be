const { JWT } = require('google-auth-library');
const axios = require('axios');
import { config } from '../../config';


async function getAccessTokenAsync() {
  try {
    const { data: serviceAccount } = await axios.get(config.google.serviceJson);
    const jwtClient = new JWT(
      serviceAccount.client_email,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/cloud-platform']
    );

    const tokens = await jwtClient.authorize();
    return tokens.access_token;
  } catch (error: any) {
    throw new Error(`Failed to get access token: ${error.message}`);
  }
}

const sendFCMv1Notification = async () => {
  try {
    const firebaseAccessToken = await getAccessTokenAsync();
    const deviceToken = process.env.FCM_DEVICE_TOKEN;

    if (!firebaseAccessToken || !deviceToken) {
      throw new Error('Missing Firebase access token or device token');
    }

    const messageBody = {
      message: {
        token: deviceToken,
        data: {
          channelId: 'default',
          message: 'Testing',
          title: 'This is an FCM notification message',
          body: JSON.stringify({ title: 'bodyTitle', body: 'bodyBody' }),
          scopeKey: '@yourExpoUsername/yourProjectSlug',
          experienceId: '@yourExpoUsername/yourProjectSlug',
        },
      },
    };

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_NAME}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${firebaseAccessToken}`,
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageBody),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error ${response.status}: ${error}`);
    }

    const json = await response.json();
    console.log(`Response JSON: ${JSON.stringify(json, null, 2)}`);
  } catch (error) {
    console.error('Error sending FCM notification:', error);
  }
};


export default {sendFCMv1Notification};
