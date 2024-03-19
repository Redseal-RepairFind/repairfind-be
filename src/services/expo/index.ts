import { Expo, ExpoPushMessage, ExpoPushTicket, ExpoPushReceipt, ExpoPushSuccessTicket } from 'expo-server-sdk';

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
      console.log('ticketChunk line 24', ticketChunk);
      tickets.push(...ticketChunk);
      console.log('tickets line 26', tickets);
    } catch (error) {
      console.error(error);
    }
  }

  // Extract receipt IDs for error notifications
  const receiptIds: string[] = tickets
    .filter(ticket => ticket.status !== 'error')
    //@ts-ignore
    .map(ticket => (ticket as ExpoPushReceipt).id); // Access id property for error receipts

  // Split receipt IDs into chunks to retrieve receipt information
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  console.log('receiptIds', receiptIds)

  // Retrieve receipt information for each receipt ID chunk
  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log('receipts 47', receipts);

      // Process receipt information
      for (const receiptId in receipts) {
        const { status, details }: ExpoPushReceipt = receipts[receiptId];
        if (status == 'error') {
          console.error(`There was an error sending a notification: ${message}`);
          if (details && details.error) {
            console.error(`The error code is ${details.error}`);
          }
        }else{
          console.error(`Nofication sent ${status}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}



