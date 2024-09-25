import * as webhook from './webhook.paypal'
import * as payment from './payment.paypal'
import * as payout from './payout.paypal'
import * as vault from './vault.paypal'

export const PayPalService = {
    webhook,
    payment,
    payout,
    vault
}

