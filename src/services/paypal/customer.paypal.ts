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


// Function to create a new PayPal customer
export async function createPayPalCustomer(payerInfo: {
    email: string,
    firstName: string,
    lastName: string,
}) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: config.paypal.apiUrl + '/v1/customer/partners/partner-id/customers',
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                customer: {
                    email: payerInfo.email,
                    first_name: payerInfo.firstName,
                    last_name: payerInfo.lastName,
                    customer_type: 'PERSONAL', // Can be BUSINESS if needed
                },
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error creating PayPal customer:', error.response?.data || error.message);
        throw error;
    }
}



// Function to get PayPal customer details
export async function getPayPalCustomerDetails(customerId: string) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v1/customer/partners/partner-id/customers/${customerId}`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error retrieving PayPal customer details:', error.response?.data || error.message);
        throw error;
    }
}



// Function to update PayPal customer details
export async function updatePayPalCustomer(customerId: string, updatedInfo: {
    email?: string,
    firstName?: string,
    lastName?: string,
}) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v1/customer/partners/partner-id/customers/${customerId}`,
            method: 'patch',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                customer: {
                    email: updatedInfo.email,
                    first_name: updatedInfo.firstName,
                    last_name: updatedInfo.lastName,
                },
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error updating PayPal customer:', error.response?.data || error.message);
        throw error;
    }
}



// Function to create a PayPal setup token for vaulting payment method
export async function createSetupToken(customerId?: string) {
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
                    card: {
                        // You can add card details here if available, or leave it for customer input during checkout
                    },
                },
                customer_id: customerId, // Optional: Link setup token to an existing customer
                usage_type: 'MERCHANT_INITIATED_BILLING', // or 'FIRST_ORDER' if it's the first setup
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error creating setup token:', error.response?.data || error.message);
        throw error;
    }
}




// Vault payment method for PayPal customer
export async function vaultCustomerPaymentMethod(customerId: string, setupToken: string) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v3/vault/payment-tokens`,
            method: 'post',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                payment_source: {
                    token: {
                        id: setupToken,
                        type: 'SETUP_TOKEN',
                    },
                },
                customer_id: customerId, // Link to existing customer
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error vaulting customer payment method:', error.response?.data || error.message);
        throw error;
    }
}





// Function to retrieve PayPal vaulted payment methods
export async function getVaultedPaymentMethods(customerId: string) {
    const accessToken = await getPayPalAccessToken();

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v3/vault/payment-tokens?customer_id=${customerId}`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Error retrieving vaulted payment methods:', error.response?.data || error.message);
        throw error;
    }
}



// Function to delete a PayPal Vault Payment Token
export async function deleteVaultPaymentToken(paymentTokenId: string) {
    const accessToken = await getPayPalAccessToken(); // Make sure you have this function to get the access token

    try {
        const response = await axios({
            url: `${config.paypal.apiUrl}/v3/vault/payment-tokens/${paymentTokenId}`,
            method: 'delete',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Payment token deleted successfully.');
        return response.data; // Optionally, you can return the response
    } catch (error: any) {
        console.error('Error deleting payment token:', error.response?.data || error.message);
        throw error;
    }
}