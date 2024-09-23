import paypalRest from 'paypal-rest-sdk';



// Configure PayPal SDK for Payouts
paypalRest.configure({
    mode: 'sandbox', // or 'live'
    client_id: <string>process.env.PAYPAL_CLIENT_ID,
    client_secret: <string>process.env.PAYPAL_CLIENT_SECRET,
});


// Define interfaces for the payout item and error if needed
// This is an example of basic type annotation; you can enhance these based on the actual API response.

interface PayoutError {
    name: string;
    message: string;
    information_link?: string;
    debug_id?: string;
}

interface PayoutItem {
    transaction_status: string;
    payout_item_id: string;
    [key: string]: any; // Additional properties as needed
}



// Method to create a transfer to an email
export const createEmailPayout = async (email: string, amount: number, currency: string = 'CAD') => {
    const createPayoutJson = {
        sender_batch_header: {
            sender_batch_id: Math.random().toString(36).substring(9),
            email_subject: 'You have a payout!',
            email_message: 'You have received a payout. Thanks for using our service!',
        },
        items: [
            {
                recipient_type: 'EMAIL',
                amount: {
                    value: amount.toFixed(2),
                    currency: currency,
                },
                receiver: email,
                note: 'Thank you for your business.',
                sender_item_id: Math.random().toString(36).substring(9),
            },
        ],
    };

    try {
        const response = await new Promise<PayoutItem>((resolve, reject) => {
            paypalRest.payout.create(createPayoutJson, (error: PayoutError, payout: PayoutItem) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(payout);
                }
            });
        });

        console.log('Transfer created successfully:', response);
        return response;
    } catch (error) {
        console.error('Error creating transfer:', error);
        throw error;
    }
};





// Check Payout Item Status
const checkPayoutStatus = async (payoutItemId: string) => {
    try {
        const response = await new Promise<PayoutItem>((resolve, reject) => {
            paypalRest.payoutItem.get(
                payoutItemId,
                (error: PayoutError | null, payoutItem: PayoutItem | null) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(payoutItem as PayoutItem);
                    }
                }
            );
        });

        console.log('Payout item status:', response.transaction_status);
        return response;
    } catch (error) {
        console.error('Error fetching payout item status:', error);
        throw error;
    }
};
