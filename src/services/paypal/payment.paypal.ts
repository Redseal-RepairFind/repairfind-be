import axios from 'axios';
import { BadRequestError } from '../../utils/custom.errors';
import { config } from '../../config';
import { v4 as uuidv4 } from 'uuid';
import { IPaypalPaymentMethod } from '../../database/common/paypal_paymentmethod.schema';
import { Logger } from '../logger';


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

// Create a Payment Order (Standard Payment)
export const createOrder = async (payload: any) => {
  try {
    const accessToken = await getPayPalAccessToken();
    const response = await axios.post(
      config.paypal.apiUrl + '/v2/checkout/orders',
      {
        intent: payload.intent, // CAPTURE or AUTHORIZE
        purchase_units: [
          {
            custom_id: payload.metaId,
            reference_id: payload.metaId,
            description: payload.description,
            amount: {
              currency_code: 'CAD',
              value: (payload.amount).toString(), // Amount in dollars
            },
          },
        ],
        payment_source: {
          card: {
            attributes: {
              vault: {
                store_in_vault: "ON_SUCCESS"
              }
            },
            // experience_context: {
            //   shipping_preference: "NO_SHIPPING",
            // }
          }
        },
        application_context: {
          return_url: payload.returnUrl ?? 'https://repairfind.ca/payment-success',
          cancel_url: 'https://repairfind.ca/action-cancelled-successfully',
          // shipping_preference: "NO_SHIPPING" // Set to NO_SHIPPING
          
        },

        
        payer: {
          name: {
            given_name: payload.payer.firstName, // Payer's first name
            surname: payload.payer.lastName, // Payer's last name
          },
          // phone: payload.payer.phoneNumber ? {
          //   phone_number: {
          //       national_number: payload.payer.phoneNumber,
          //   }
          // } : null,
          email_address: payload.payer.email, // Payer's email address
          // address: {
          //   address_line_1: payload.payer.address ?? '123 ABC Street',
          //   admin_area_2: payload.payer.city ?? 'San Jose',
          //   admin_area_1:  payload.payer.state ?? 'CA',
          //   postal_code: payload.payer.zip ?? 95121,
          //   country_code: payload.payer.country ?? 'US'
          // },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    Logger.error("Error creating order:", error.response.data);
    throw new Error(error.response?.data?.message || error.message);
  }
};





// Capture the Full Payment for an Order using orderId
export const captureOrder = async (orderId: string) => {
  const accessToken = await getPayPalAccessToken();
  let paymentMethod = null
  try {
    // Capture the full order payment
    const captureResponse = await axios.post(
      `${config.paypal.apiUrl}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const orderData = captureResponse.data;

    // Check if the payment source has a vaulted card and extract the token
    const vault = orderData?.payment_source?.card?.attributes?.vault;

    if (vault && vault.id) {
      const vaultToken = vault.id;
      const paypalCustomer = vault.customer?.id;

      const cardDetails = {
        lastDigits: orderData.payment_source.card.last_digits,
        expiry: orderData.payment_source.card.expiry,
        brand: orderData.payment_source.card.brand,
      };

      paymentMethod = {
        vault_id: vaultToken,
        customer: paypalCustomer,
        status: "active",
        card: {
          last_digits: cardDetails.lastDigits,  // Last 4 digits of the card
          expiry: cardDetails.expiry,           // Card expiration date
          brand: cardDetails.brand,             // Card brand (e.g., Visa, Mastercard)
        },
        created_at: new Date(),  // Timestamp of when the token was saved
      } as IPaypalPaymentMethod
    }

    return { orderData, paymentMethod };
  } catch (error: any) {
    Logger.error("Error capturing order:", error.response.data);
    throw new Error(error.response?.data?.message || error.message);
  }
};


// Capture the Full Authorized Amount
export const captureAuthorization = async (authorizationId: string) => {
  const accessToken = await getPayPalAccessToken();

  // Fetch the authorization details to get the authorized amount
  const authorizationResponse = await axios.get(
    config.paypal.apiUrl + `/v2/payments/authorizations/${authorizationId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // Get the full authorized amount from the response
  const authorizedAmount = authorizationResponse.data.amount;

  const captureResponse = await axios.post(
    config.paypal.apiUrl + `/v2/payments/authorizations/${authorizationId}/capture`,
    {
      amount: {
        currency_code: authorizedAmount.currency_code,
        value: authorizedAmount.value,
      },
      final_capture: true,
      invoice_id: 'INV-' + Math.floor(Math.random() * 1000000),
      note_to_payer: 'Thank you for your purchase!',
      soft_descriptor: 'RepairFind',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return captureResponse.data;
};


// Authorize a Payment (without capturing)
export const authorizeOrder = async (orderId: string, custom_id?: string) => {
  const accessToken = await getPayPalAccessToken();
  let paymentMethod = null;

  try {
    // Authorize the payment for the given orderId
    const response = await axios.post(
      `${config.paypal.apiUrl}/v2/checkout/orders/${orderId}/authorize`,
      {
        customer_id: custom_id
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const orderData = response.data;

    // Check if the payment source has a vaulted card and extract the token
    const vault = orderData?.payment_source?.card?.attributes?.vault;

    if (vault && vault.id) {
      const vaultToken = vault.id;
      const paypalCustomer = vault.customer?.id;

      const cardDetails = {
        lastDigits: orderData.payment_source.card.last_digits,
        expiry: orderData.payment_source.card.expiry,
        brand: orderData.payment_source.card.brand,
      };

      paymentMethod = {
        vault_id: vaultToken,
        customer: paypalCustomer,
        status: "active",
        card: {
          last_digits: cardDetails.lastDigits,  // Last 4 digits of the card
          expiry: cardDetails.expiry,           // Card expiration date
          brand: cardDetails.brand,             // Card brand (e.g., Visa, Mastercard)
        },
        created_at: new Date(),  // Timestamp of when the token was saved
      } as IPaypalPaymentMethod;
    }

    return { orderData, paymentMethod }; // Return both the authorization and payment method details
  } catch (error: any) {
    Logger.error("Error authorizing order:", error.response.data);
    throw new Error(error.response?.data?.message || error.message);
  }
};



// Void an Authorization
export const voidAuthorization = async (authorizationId: string) => {
  const accessToken = await getPayPalAccessToken();

  try {
    // Void the authorization
    const response = await axios.post(
      `${config.paypal.apiUrl}/v2/payments/authorizations/${authorizationId}/void`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    Logger.error("Error voiding authorization:", error.response.data);
    throw new Error(error.response?.data?.message || error.message);
  }
};



// Create a Payment Order (Standard Payment)
export const chargeSavedCard = async (payload: any) => {
  const accessToken = await getPayPalAccessToken();
  const requestId = uuidv4();  // Generate a unique request ID


  try {
    const response = await axios.post(
      config.paypal.apiUrl + '/v2/checkout/orders',
      {
        intent: 'CAPTURE', // CAPTURE or AUTHORIZE
        purchase_units: [
          {
            custom_id: payload.metaId,
            reference_id: payload.metaId,
            description: payload.description,
            amount: {
              currency_code: 'CAD',
              value: (payload.amount).toString(), // Amount in dollars
            },
          },
        ],
        "payment_source": {
          "card": {
            "vault_id": payload.paymentToken
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': requestId,  // Unique PayPal Request ID
        },
      }
    );

    return response.data;

  } catch (error: any) {
    Logger.error("Error charging saved card:", error.response.data);
    throw new Error(error.response?.data?.message || error.message);
  }


};



// Refund a Payment
export const refundPayment = async (captureId: string, amountToRefund: number) => {
  const accessToken = await getPayPalAccessToken();

  const response = await axios.post(
    config.paypal.apiUrl + `/v2/payments/captures/${captureId}/refund`,
    {
      amount: {
        currency_code: 'CAD',
        value: (amountToRefund).toString(),
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// Retrieve Payment Method from Order
export const retrievePaymentMethod = async (orderId: string) => {
  const accessToken = await getPayPalAccessToken();

  try {
    const response = await axios.get(
      config.paypal.apiUrl + `/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract payment method information
    const paymentSource = response.data.payment_source;

    if (paymentSource) {
      return {
        paymentMethod: paymentSource, // Return the payment source information
        orderDetails: response.data, // You may also return complete order details if needed
      };
    } else {
      throw new BadRequestError('No payment source found for this order.');
    }
  } catch (error: any) {
    throw new BadRequestError(`Error retrieving payment method: ${error.message}`);
  }
};
