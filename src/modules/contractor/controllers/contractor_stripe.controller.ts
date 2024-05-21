

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StripeService } from '../../../services/stripe';
import CustomerModel from '../../../database/customer/models/customer.model';
import { IStripeCustomer } from '../../../database/customer/interface/customer.interface';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';


export const createSession = async (req: any, res: Response) => {
    try {
        const { mode } = req.body;
        const contractorId = req.contractor.id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        let contractor = await ContractorModel.findById(contractorId)
        if (!contractor) {
            return res.status(400).json({ success: false, message: 'Contractor not found' });
        }

        let stripeCustomer = await StripeService.customer.getCustomer({
            email: contractor.email,
            limit: 1
        })

        // if (!stripeCustomer) {
        stripeCustomer = await StripeService.customer.createCustomer({
            email: contractor.email,
            metadata: {
                userId: contractor.id,
                userType: 'contractors'
            },
            name: `${contractor.firstName} ${contractor.lastName} `,
            phone: `${contractor.phoneNumber.code}${contractor.phoneNumber.number} `,
        })
        // }

        if (stripeCustomer) {
            const stripeSession = await StripeService.session.createSession({
                mode: mode,
                currency: 'usd',
                customer: stripeCustomer.id,
                setup_intent_data: {
                    metadata: {
                        userType: 'contractors',
                        userId: contractorId,
                    }
                }
            })

            contractor.stripeCustomer = <IStripeCustomer>stripeCustomer
            contractor.save()

            return res.status(200).json({ success: true, message: 'Stripe Session created', data: stripeSession });
        }



    } catch (error: any) {
        console.error('Error Creating Session', error);
        return res.status(error.code || 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};


export const createSetupIntent = async (req: any, res: Response) => {
    try {
        const { mode } = req.body;
        const contractorId = req.contractor.id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        let contractor = await ContractorModel.findById(contractorId)
        if (!contractor) {
            return res.status(400).json({ success: false, message: 'Contractor not found' });
        }

        let stripeCustomer = await StripeService.customer.getCustomer({
            email: contractor.email,
            limit: 1
        })

       

        if(!stripeCustomer){
            stripeCustomer = await StripeService.customer.createCustomer({
                email: contractor.email,
                metadata: {
                    userId: contractor.id,
                    userType: 'contractors'
                },
                name: `${contractor.firstName} ${contractor.lastName} `,
                phone: `${contractor.phoneNumber.code}${contractor.phoneNumber.number} `,
            })
        }
        


        // create ephemeral key
        let ephemeralKey = await StripeService.session.createEphemeralKey({
            customer: stripeCustomer.id
        })

        
        const stripeSetupIntent = await StripeService.payment.createSetupIntent({
            customer: stripeCustomer.id,
            payment_method_types: [
                'card'
            ],
            metadata: {
                userType: 'contractors',
                userId: contractorId,
            }

        })

        contractor.stripeCustomer = <IStripeCustomer>stripeCustomer
        contractor.save()

        return res.status(200).json({ success: true, message: 'Stripe setup intent created', data: {
            stripeSetupIntent,
            ephemeralKey,
            stripeCustomer
        } });


    } catch (error: any) {
        console.error('Error Creating Session', error);
        return res.status(error.code || 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};


export const createCustomer = async (req: any, res: Response) => {
    try {
        const { memberId, role } = req.body;
        const contractorId = req.contractor.id;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        let contractor = await ContractorModel.findById(contractorId)
        if (!contractor) {
            return res.status(400).json({ success: false, message: 'Contractor not found' });
        }


        const stripeCustomer = await StripeService.customer.createCustomer({
            email: contractor.email,
            metadata: {},
            name: `${contractor.firstName} ${contractor.lastName} `,
            phone: `${contractor.phoneNumber.code}${contractor.phoneNumber.number} `,
        })



        contractor.stripeCustomer = <IStripeCustomer>stripeCustomer
        contractor.save()

        return res.status(200).json({ success: true, message: 'Stripe Customer created', data: stripeCustomer });

    } catch (error: any) {
        console.error('Error creating stripe customer:', error);
        return res.status(error.code || 500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};


export const ContractorStripeController = {
    createSession,
    createCustomer,
    createSetupIntent,

}

