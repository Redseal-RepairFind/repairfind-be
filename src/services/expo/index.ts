import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushReceipt, ExpoPushSuccessTicket } from 'expo-server-sdk';
import { Logger } from '../logger';

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendPushNotifications(pushTokens: string[], message: any): Promise<void> {
  
  // Prepare push notification messages
  const messages: ExpoPushMessage[] = pushTokens
    .filter(token => Expo.isExpoPushToken(token)) // Filter out invalid tokens
    .map(token => ({
      to: token,
      sound: 'default',
      ...message,
    }));

  // Split messages into chunks to send in batches
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  // Send each chunk of messages
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      Logger.error(error);
    }
  }

  // Extract receipt IDs for error notifications
  const receiptIds: string[] = tickets
    .filter(ticket => ticket.status !== 'error')
    //@ts-ignore
    .map(ticket => (ticket as ExpoPushReceipt).id); // Access id property for error receipts

  // Split receipt IDs into chunks to retrieve receipt information
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);


  // Retrieve receipt information for each receipt ID chunk
  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      // Process receipt information
      for (const receiptId in receipts) {
        const { status, details }: ExpoPushReceipt = receipts[receiptId];
        if (status == 'error') {
          Logger.error(`There was an error sending a notification: ${message}`);
          if (details && details.error) {
            Logger.error(`The error code is ${details.error}`);
          }
        }else{
          Logger.info(`Nofication sent ${status}`);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}



