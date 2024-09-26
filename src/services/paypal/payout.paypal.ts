import axios from 'axios';
import { BadRequestError } from '../../utils/custom.errors';
import { config } from '../../config';
import { v4 as uuidv4 } from 'uuid';

// Function to generate PayPal OAuth token
const getPayPalAccessToken = async () => {
  const auth = Buffer.from(
    `${config.paypal.clientId}:${config.paypal.secretKey}`
  ).toString('base64');

  const response = await axios({
    url: config.paypal.apiUrl + '/v1/oauth2/token',
    method: 'post',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: 'grant_type=client_credentials',
  });

  return response.data.access_token;
};

// Transfer Funds to PayPal Email (Payouts)
export const transferToEmail = async (recipientEmail: string, amount: number, currency: string = 'USD') => {
  const accessToken = await getPayPalAccessToken();

  const response = await axios.post(
    config.paypal.apiUrl + '/v1/payments/payouts',
    {
      sender_batch_header: {
        sender_batch_id: uuidv4(), // Unique ID for the batch
        email_subject: 'You have a payment from RepairFind!',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: amount.toString(), // Amount in dollars
            currency: currency,
          },
          receiver: recipientEmail,
          note: 'Payment for your completed job on RepairFind',
          sender_item_id: uuidv4(), // Unique ID for the transaction
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.batch_header.batch_status !== 'SUCCESS') {
    throw new BadRequestError('Failed to send payment.');
  }

  return response.data;
};




// Check the status of a payout item
export const checkPayoutStatus = async (payoutItemId: string) => {
    const accessToken = await getPayPalAccessToken();
  
    try {
      const response = await axios.get(
        config.paypal.apiUrl +`${payoutItemId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Payout item status:', response.data.transaction_status);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching payout item status:', error.response ? error.response.data : error.message);
      throw error;
    }
  };
  