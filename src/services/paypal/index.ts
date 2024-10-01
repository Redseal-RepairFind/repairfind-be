import * as webhook from './webhook.paypal'
import * as payment from './payment.paypal'
import * as payout from './payout.paypal'
import * as customer from './customer.paypal'

export const PayPalService = {
    webhook,
    payment,
    payout,
    customer,
}

