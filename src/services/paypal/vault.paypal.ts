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
                    paypal: {
                        experience_context: {
                            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                            payment_method_selected: 'PAYPAL',
                            brand_name: 'Your Brand', // Customize your brand name
                            locale: 'en-US',
                            landing_page: 'LOGIN', // Options: LOGIN or BILLING
                            user_action: 'CONTINUE', // CONTINUE or PAY_NOW
                            return_url: 'https://your-return-url.com/success', // URL after PayPal approval
                            cancel_url: 'https://your-cancel-url.com/cancel',  // URL if user cancels
                        },
                    },
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
            url: config.paypal.apiUrl + '/v3/vault/payment-ttokens',
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                setup_token: setupToken,
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
