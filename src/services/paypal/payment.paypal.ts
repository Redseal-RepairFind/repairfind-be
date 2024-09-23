import paypal from '@paypal/checkout-server-sdk';
import { BadRequestError } from '../../utils/custom.errors';

// Set up PayPal environment
const environment = new paypal.core.SandboxEnvironment(<string>process.env.PAYPAL_CLIENT_ID, <string>process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);



// Create a Payment Method (Order) for On-Demand Charges
export const createPaymentOrder = async (payload: any) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'CAD',
        value: (payload.amount / 100).toString(), // Amount in dollars
      },
    }],
    application_context: {
      return_url: 'https://repairfind.ca/payment-success/',
      cancel_url: 'https://cancel.com',
    },
  });

  const response = await client.execute(request);
  return response.result;
};



// Refund Payment
export const refundPayment = async (captureId: string, amountToRefund: number) => {
  const request = new paypal.payments.CapturesRefundRequest(captureId);
  request.requestBody({
    invoice_id: '',
    note_to_payer: "",
    amount: {
      currency_code: 'CAD',
      value: (amountToRefund / 100).toString(), // Amount in dollars
    },
    
  });

  const response = await client.execute(request);
  return response.result;
};


