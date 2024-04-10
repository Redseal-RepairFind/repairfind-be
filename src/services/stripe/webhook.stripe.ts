

import Stripe from 'stripe';
import { BadRequestError } from '../../utils/custom.errors';
import { Request, Response } from "express";
import { Log } from '../../utils/logger';
import {EventEmitter} from 'events';
import { eventEmitter } from '../../events';
import { StripeService } from '.';
import { ContractorModel } from '../../database/contractor/models/contractor.model';
import CustomerModel from '../../database/customer/models/customer.model';
import { sendPushNotifications } from '../expo';
import ContractorDeviceModel from '../../database/contractor/models/contractor_devices.model';
import { castPayloadToDTO } from '../../utils/interface_dto.util';
import { IStripeAccount } from '../../database/common/stripe_account.schema';
import { IPayment, PaymentModel } from '../../database/common/payment.schema';
import { IPaymentCapture, PaymentCaptureModel } from '../../database/common/payment_captures.schema';


const STRIPE_SECRET_KEY = <string>process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = <string>process.env.STRIPE_WEBHOOK_SECRET;
const stripeClient = new Stripe(STRIPE_SECRET_KEY);

export const StripeWebhookHandler = async (req: Request) => {
    try {

        const payloadString = JSON.stringify(req.body);

        const sig = <string>req.headers['stripe-signature'];
        
        const event = stripeClient.webhooks.constructEvent(
            //@ts-ignore
            req.rawBody,
            sig,
            STRIPE_WEBHOOK_SECRET
        );

        const eventType = event.type;
        const eventData = event.data;

        // console.log(event)
        // Log.info(event)
        
        switch (eventType) {
            
            // Setup Intent
            case 'setup_intent.created':
                setupIntentCreated(eventData.object);
                break;
            case 'setup_intent.succeeded':
                setupIntentSucceeded(eventData.object);
                break;

            // Identity
            case 'identity.verification_session.created':
                identityVerificationCreated(eventData.object);
                break;
            case 'identity.verification_session.processing':
                break
            case 'identity.verification_session.requires_input': 
                identityVerificationRequiresInput(eventData.object)
                break
             case 'identity.verification_session.verified':
                // All the verification checks passed
                identityVerificationVerified(eventData.object)
                break

            // Payment Method
            case 'payment_method.attached':
                paymentMethodAttached(eventData.object);
                break;
            case 'payment_method.detached':
                paymentMethodDetached(eventData.object);
                break;

            // Customer
            case 'customer.updated':
                customerUpdated(eventData.object);
                break;
            case 'customer.created':
                customerCreated(eventData.object);
                break;

            // Account
            case 'account.updated':
                accountUpdated(eventData.object);
                break;

            // Payment and Intents
            case 'payment_intent.succeeded':
                // paymentIntentSucceeded(eventData.object);
                break;
            case 'charge.succeeded':
                chargeSucceeded(eventData.object);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`, eventData.object);
                break;
        }
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        console.log(error.message || "Something went wrong inside stripe webhook")
    }
};


export const setupIntentCreated = async (payload: any) => {
    try {
        //  const customer = await StripeService.customer.getCustomerById(payload.customer)
        //  console.log('Customer from setupIntentCreated', customer)
         
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};



export const setupIntentSucceeded = async (payload: any) => {

    console.log('Stripe Event Handler: setupIntentSucceeded', payload)
    try {
        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.payment_method)
        
        //  instead of trying to retreive meta from customer get it from the payload metadata
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

        const existingPaymentMethodIndex = user.stripePaymentMethods.findIndex((pm: any) => pm.id === paymentMethod.id)
        if (existingPaymentMethodIndex !== -1) {
            // If paymentMethod already exists, update it
            user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod
        } else {
            // If paymentMethod doesn't exist, push it to the array
            user.stripePaymentMethods.push(paymentMethod)
        }

        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};



export const customerUpdated = async (payload: any) => {
    console.log('Stripe Event Handler: customerUpdated', payload)
    try {

        // if(payload.object != 'customer') return
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        if (!userType || !userId) return // Ensure userType and userId are valid
        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists
        user.stripeCustomer = payload
        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};

export const customerCreated = async (payload: any) => {
    console.log('Stripe Event Handler: customerCreated', payload)
    try {

        // if(payload.object != 'customer') return
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        if (!userType || !userId) return // Ensure userType and userId are valid
        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists
        user.stripeCustomer = payload
        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};


export const paymentMethodAttached = async (payload: any) => {
    console.log('Stripe Event Handler: paymentMethodAttached', payload)
    try {

        if(payload.object != 'payment_method') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)

        console.log('customer', customer)
        const paymentMethod: any = await StripeService.payment.getPaymentMethod(payload.id)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId


        
        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

        const existingPaymentMethodIndex = user.stripePaymentMethods.findIndex((pm: any) => pm.id === paymentMethod.id)
        if (existingPaymentMethodIndex !== -1) {
            // If paymentMethod already exists, update it
            user.stripePaymentMethods[existingPaymentMethodIndex] = paymentMethod
        } else {
            // If paymentMethod doesn't exist, push it to the array
            user.stripePaymentMethods.push(paymentMethod)
        }

        console.log(user)

        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};

export const paymentMethodDetached = async (payload: any) => {
    try {

        if(payload.object != 'payment_method') return
        const paymentMethodId = payload.id;
        const user = await CustomerModel.findOne({ "stripePaymentMethods.id": paymentMethodId });
        if (!user) return; // User not found with the detached payment method
        // Remove the detached payment method from user's stripePaymentMethods array
        user.stripePaymentMethods = user.stripePaymentMethods.filter((pm: any) => pm.id !== paymentMethodId);

        await user.save();
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};


export const identityVerificationCreated = async (payload: any) => {
    try {
        
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        
        let user= null
        let deviceTokens :string[] = []
        let devices  = []

        if(userType == 'contractors'){
            user  = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
            // console.log('deviceTokens', deviceTokens)
        }else{
            user  = await CustomerModel.findById(userId)
        }

        if(user){
            user.stripeIdentity = payload
            user.save()

          

        }


        
         
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};

export const identityVerificationRequiresInput = async (payload: any) => {
    try {

        console.log('Verification check failed: ' + payload.last_error.reason);

        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        
        let user= null
        let deviceTokens :string[] = []
        let devices  = []

        if(userType == 'contractors'){
            user  = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }else{
            user  = await CustomerModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }

        if(!user) return

        let message =  'Verification check failed: ' + payload.last_error.reason

        // Handle specific failure reasons
        switch (payload.last_error.code) {
          case 'document_unverified_other': {
            // The document was invalid

            break;
          }
          case 'document_expired': {
            // The document was expired
            break;
          }
          case 'document_type_not_supported': {
            // document type not supported
            break;
          }
          default: {
            // ...
          }
        }


        if(!user) return

         //fetch and expand
         let verification  = await StripeService.identity.retrieveVerificationSession(payload.id)
         console.log(verification)
        
 
         // update user profile picture here
         //@ts-ignore
         const {fileLink, s3fileUrl} = await StripeService.file.createFileLink({
              //@ts-ignore
             file: verification?.last_verification_report?.selfie?.selfie,
             expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
         }, true)
         console.log('fileLink from stripe', fileLink)
         console.log('s3fileUrl of file uploaded to s3', s3fileUrl)
 
          
         user.stripeIdentity = verification
          //@ts-ignore
         user.profilePhoto = {url: s3fileUrl}
         user.save()

        
        
        sendPushNotifications( deviceTokens , {
            title: 'Identity Verification',
            icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
            body: message,
            data: { 
                event: 'identity.verification_session.requires_input',
                user:{
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                },
                payload: {
                    status: payload.status,
                    type: payload.type,
                    reason: payload.last_error.reason,
                    code: payload.last_error.code,
                    options: payload.options
                }
            },
        })


       
    } catch (error: any) {
         new BadRequestError(error.message || "Something went wrong");
    }
};

export const identityVerificationVerified = async (payload: any) => {
    try {

        console.log('Verification session verified: ' + payload.status);
        console.log(payload)
        if(payload.object != 'identity.verification_session')return

        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        
        let user= null
        let deviceTokens :string[] = []
        let devices  = []

        if(userType == 'contractors'){
            user  = await ContractorModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }else{
            user  = await CustomerModel.findById(userId)
            devices = await ContractorDeviceModel.find({contractor: user?.id}).select('deviceToken')
            deviceTokens = devices.map(device => device.deviceToken);
        }

        if(!user) return

       
        //fetch and expand
        let verification  = await StripeService.identity.retrieveVerificationSession(payload.id)
        console.log(verification)
       

        // update user profile picture here
        //@ts-ignore
        const {fileLink, s3fileUrl} = await StripeService.file.createFileLink({
             //@ts-ignore
            file: verification?.last_verification_report?.selfie?.document,
            expires_at: Math.floor(Date.now() / 1000) + 30,  // link expires in 30 seconds
        }, true)
        console.log('fileLink from stripe', fileLink)
        console.log('s3fileUrl of file uploaded to s3', s3fileUrl)

        
        user.stripeIdentity = verification
         //@ts-ignore
        user.profilePhoto = {url: s3fileUrl}
        user.save()
        
        sendPushNotifications( deviceTokens , {
            title: 'Identity Verification',
            icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
            body: 'Identity verification session verified',
            data: { 
                event: 'identity.verification_session.verified',
                user:{
                    email: user.email,
                    profilePhoto: user.profilePhoto,
                },
                payload: {
                    status: payload.status,
                    type: payload.type,
                    options: payload.options
                }
            },
        })

       
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }
};



export const accountUpdated = async (payload: any) => {
    console.log('Stripe Event Handler: accountUpdated', payload)
    try {

        if(payload.object != 'account') return
        const userType = payload?.metadata?.userType
        const userId = payload?.metadata?.userId
        const email = payload?.metadata?.email
        if (!userType || !email) return // Ensure userType and email are valid,  userId can change on our end
        const user = userType === 'contractors' ? await ContractorModel.findOne({email}) : await CustomerModel.findOne({email})
        if (!user) return // Ensure user exists
        
    
        // Casting payload to DTO
        const stripeAccountDTO: IStripeAccount = castPayloadToDTO(payload, {} as IStripeAccount);
        user.stripeAccount = stripeAccountDTO

        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        console.log('accountUpdated', error)
    }

};


// Payment
export const paymentIntentSucceeded = async (payload: any) => {
    console.log('Stripe Event Handler: paymentIntentSucceeded', payload)
    try {

        if(payload.object != 'payment_intent') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

       
        await user.save()
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
    }

};

export const chargeSucceeded = async (payload: any) => {
    console.log('Stripe Event Handler: chargeSucceeded', payload)
    try {

        if(payload.object != 'charge') return

        const customer: any = await StripeService.customer.getCustomerById(payload.customer)
        const userType = customer?.metadata?.userType
        const userId = customer?.metadata?.userId

        if (!userType || !userId) return // Ensure userType and userId are valid

        const user = userType === 'contractors' ? await ContractorModel.findById(userId) : await CustomerModel.findById(userId)
        if (!user) return // Ensure user exists

        let stripeChargeDTO: IPayment = castPayloadToDTO(payload, payload as IPayment);
        stripeChargeDTO.reference = payload.id
        delete (stripeChargeDTO as { id?: any }).id;

        stripeChargeDTO.user = user.id
        stripeChargeDTO.userType = userType+'s'

        let payment = await PaymentModel.findOneAndUpdate({reference:stripeChargeDTO.reference }, stripeChargeDTO, {
            new: true, upsert: true
        })

        // handle things here
        //1 handle transfer payment method options if it requires future capturing to another model ?
        if(!payment.captured){
            //save payment capture here
            let paymentCaptureDto: IPaymentCapture = castPayloadToDTO(payload, payload as IPaymentCapture);
            paymentCaptureDto.payment_intent = payload.payment_intent
            paymentCaptureDto.payment_method = payload.payment_method
            paymentCaptureDto.user = userId
            paymentCaptureDto.userType = userType
            paymentCaptureDto.payment = payment.id

            let paymentCapture = await PaymentCaptureModel.findOneAndUpdate({payment:payment.id }, paymentCaptureDto, {
                new: true, upsert: true
            })
        }
       
    } catch (error: any) {
        // throw new BadRequestError(error.message || "Something went wrong");
        console.log('Error handling chargeSucceeded stripe webhook event', error)
    }

};





// Unhandled event type: charge.succeeded {
//     id: 'ch_3P3daTDdPEZ0JirQ3SK39yiG',
//     object: 'charge',
//     amount: 13043760,
//     amount_captured: 13043760,
//     amount_refunded: 0,
//     application: null,
//     application_fee: null,
//     application_fee_amount: null,
//     balance_transaction: 'txn_3P3daTDdPEZ0JirQ3M89jkVj',
//     billing_details: {
//       address: {
//         city: null,
//         country: 'GB',
//         line1: null,
//         line2: null,
//         postal_code: '10001',
//         state: null
//       },
//       email: null,
//       name: null,
//       phone: null
//     },
//     calculated_statement_descriptor: 'WWW.REDSEALFINDER.COM',
//     captured: true,
//     created: 1712664941,
//     currency: 'usd',
//     customer: 'cus_PnDm8LSG4YbMTE',
//     description: null,
//     destination: null,
//     dispute: null,
//     disputed: false,
//     failure_balance_transaction: null,
//     failure_code: null,
//     failure_message: null,
//     fraud_details: {},
//     invoice: null,
//     livemode: false,
//     metadata: {
//       type: 'payment',
//       jobId: '660ee1399d6b9b025754a0fc',
//       customerId: '65ed8470d1ff49cca85e0b10',
//       transactionId: '"6615316c88e2b1bd768ff3f7"'
//     },
//     on_behalf_of: null,
//     order: null,
//     outcome: {
//       network_status: 'approved_by_network',
//       reason: null,
//       risk_level: 'normal',
//       risk_score: 31,
//       seller_message: 'Payment complete.',
//       type: 'authorized'
//     },
//     paid: true,
//     payment_intent: 'pi_3P3daTDdPEZ0JirQ3P53IZ4V',
//     payment_method: 'pm_1P00BvDdPEZ0JirQhBqMa6yn',
//     payment_method_details: {
//       card: {
//         amount_authorized: 13043760,
//         brand: 'visa',
//         checks: [Object],
//         country: 'US',
//         exp_month: 3,
//         exp_year: 2025,
//         extended_authorization: [Object],
//         fingerprint: 'n5Q7oY3x0n2OB4xX',
//         funding: 'credit',
//         incremental_authorization: [Object],
//         installments: null,
//         last4: '4242',
//         mandate: null,
//         multicapture: [Object],
//         network: 'visa',
//         network_token: [Object],
//         overcapture: [Object],
//         three_d_secure: null,
//         wallet: null
//       },
//       type: 'card'
//     },
//     radar_options: {},
//     receipt_email: null,
//     receipt_number: null,
//     receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xT0NYRGJEZFBFWjBKaXJRKO7i1LAGMgaQdLOl6KY6LBb6NwK_cABt972olvJD7G0Q29DNruJ7OT5voKDejEai6imD-YfeIsxTnnfH',
//     refunded: false,
//     review: null,
//     shipping: null,
//     source: null,
//     source_transfer: null,
//     statement_descriptor: null,
//     statement_descriptor_suffix: null,
//     status: 'succeeded',
//     transfer_data: null,
//     transfer_group: null
//   }




// Unhandled event type: payment_intent.succeeded {
//     id: 'pi_3P3daTDdPEZ0JirQ3P53IZ4V',
//     object: 'payment_intent',
//     amount: 13043760,
//     amount_capturable: 0,
//     amount_details: { tip: {} },
//     amount_received: 13043760,
//     application: null,
//     application_fee_amount: null,
//     automatic_payment_methods: null,
//     canceled_at: null,
//     cancellation_reason: null,
//     capture_method: 'automatic',
//     client_secret: 'pi_3P3daTDdPEZ0JirQ3P53IZ4V_secret_Y2XB5Qbtr8DiCjz0P4OORQBoW',
//     confirmation_method: 'automatic',
//     created: 1712664941,
//     currency: 'usd',
//     customer: 'cus_PnDm8LSG4YbMTE',
//     description: null,
//     invoice: null,
//     last_payment_error: null,
//     latest_charge: 'ch_3P3daTDdPEZ0JirQ3SK39yiG',
//     livemode: false,
//     metadata: {
//       type: 'payment',
//       jobId: '660ee1399d6b9b025754a0fc',
//       customerId: '65ed8470d1ff49cca85e0b10',
//       transactionId: '"6615316c88e2b1bd768ff3f7"'
//     },
//     next_action: null,
//     on_behalf_of: null,
//     payment_method: 'pm_1P00BvDdPEZ0JirQhBqMa6yn',
//     payment_method_configuration_details: null,
//     payment_method_options: {
//       card: {
//         installments: null,
//         mandate_options: null,
//         network: null,
//         request_three_d_secure: 'automatic'
//       }
//     },
//     payment_method_types: [ 'card' ],
//     processing: null,
//     receipt_email: null,
//     review: null,
//     setup_future_usage: null,
//     shipping: null,
//     source: null,
//     statement_descriptor: null,
//     statement_descriptor_suffix: null,
//     status: 'succeeded',
//     transfer_data: null,
//     transfer_group: null
//   }








// id: 'pi_3P3vmvDdPEZ0JirQ2yKajALb',
// object: 'payment_intent',
// amount: 2500,
// amount_capturable: 2500,
// amount_details: { tip: {} },
// amount_received: 0,
// application: null,
// application_fee_amount: 400,
// automatic_payment_methods: null,
// canceled_at: null,
// cancellation_reason: null,
// capture_method: 'manual',
// client_secret: 'pi_3P3vmvDdPEZ0JirQ2yKajALb_secret_SvYQqTBu8M380jfF70s0yPhko',
// confirmation_method: 'automatic',
// created: 1712734905,
// currency: 'usd',
// customer: 'cus_PqM711wEIbwiSQ',
// description: null,
// invoice: null,
// last_payment_error: null,
// latest_charge: 'ch_3P3vmvDdPEZ0JirQ2xRv0EWn',
// livemode: false,
// metadata: {
//   constractorId: '65ed8470d1ff49cca85e0b0f',
//   type: 'job_booking',
//   customerId: '65ed8470d1ff49cca85e0b10',
//   transactionId: '"661642b729b15a8053a66788"',
//   remark: 'initial_job_payment',
//   jobId: '660ee1399d6b9b025754a0fc',
//   email: 'customer@repairfind.com',
//   quotationId: '661175defad58dbc5fe92121'
// },
// next_action: null,
// on_behalf_of: 'acct_1P3hWOD6b3RbuotL',
// payment_method: 'pm_1P3ghoDdPEZ0JirQOGLz3IcW',
// payment_method_configuration_details: null,
// payment_method_options: {
//   card: {
//     capture_method: 'manual',
//     installments: null,
//     mandate_options: null,
//     network: null,
//     request_three_d_secure: 'automatic'
//   }
// },
// payment_method_types: [ 'card' ],
// processing: null,
// receipt_email: null,
// review: null,
// setup_future_usage: null,
// shipping: null,
// source: null,
// statement_descriptor: null,
// statement_descriptor_suffix: null,
// status: 'requires_capture',
// transfer_data: { destination: 'acct_1P3hWOD6b3RbuotL' },
// transfer_group: 'group_pi_3P3vmvDdPEZ0JirQ2yKajALb'
// }