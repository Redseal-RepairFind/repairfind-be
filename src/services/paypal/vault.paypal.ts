import axios from 'axios';
import { config } from '../../config';

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



export async function createSetupToken() {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: config.paypal.apiUrl + '/v3/vault/setup-tokens',
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                payment_source: {
                    "card": {}
                },

            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error creating setup token:', error.response?.data || error.message);
        throw error;
    }
}




// Function to create a PayPal Payment Token
export async function createPaymentToken(setupToken: string) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: config.paypal.apiUrl + '/v3/vault/payment-tokens',
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                "payment_source": {
                "token": {
                    "id": setupToken,
                    "type": "SETUP_TOKEN"
                }
      }
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error creating payment token:', error.response?.data || error.message);
        throw error;
    }
}



// Function to make a vault payment using the payment token
export async function makeVaultPayment(paymentTokenId: string) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: config.paypal.apiUrl + '/v2/checkout/orders',
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: '10.00', // Pass actual amount dynamically
                        },
                    },
                ],
                payment_source: {
                    token: {
                        id: paymentTokenId,
                        type: 'PAYMENT_TOKEN',
                    },
                },
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error making vault payment:', error.response?.data || error.message);
        throw error;
    }
}




// Function to retrieve payment tokens for a customer
export const getPaymentTokens = async (customerId: string) => {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v3/vault/payment-tokens?customer_id=${customerId}`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error retrieving payment tokens:', error.response?.data || error.message);
        throw error;
    }
};




// Function to create a billing agreement token
export async function createBillingAgreementToken() {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v1/billing-agreements/agreement-tokens`,
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                description: "Billing Agreement for future purchases",
                payer: {
                    payment_method: "PAYPAL"
                },
                plan: {
                    type: "MERCHANT_INITIATED_BILLING",
                    merchant_preferences: {
                        return_url: "https://your-return-url.com/success", // Redirect after approval
                        cancel_url: "https://your-cancel-url.com/cancel",  // Redirect on cancellation
                        accepted_pymt_type: "INSTANT",
                        skip_shipping_address: true
                    }
                }
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('Error creating billing agreement token:', error.response?.data || error.message);
        throw error;
    }
}



// Function to capture the billing agreement using the token
export async function captureBillingAgreement(billingToken: string) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v1/billing-agreements/agreements`,
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                token_id: billingToken
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('Error capturing billing agreement:', error.response?.data || error.message);
        throw error;
    }
}
