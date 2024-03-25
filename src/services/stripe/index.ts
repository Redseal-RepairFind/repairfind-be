import * as session from './session.stripe'
import * as customer from './customer.stripe'
import * as identity from './identity.stripe'
import * as webhook from './webhook.stripe'
import * as payment from './payment.stripe'
import * as file from './file.stripe'

export const StripeService = {
    session,
    customer,
    identity,
    webhook,
    payment,
    file,
}


