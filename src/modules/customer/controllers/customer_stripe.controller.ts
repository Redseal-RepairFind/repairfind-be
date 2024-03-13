

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StripeService } from '../../../services/stripe';
import CustomerModel from '../../../database/customer/models/customer.model';
import { IStripeCustomer } from '../../../database/customer/interface/customer.interface';


export const createSession = async (req: any, res: Response) => {
    try {
        const { mode } = req.body;
        const customerId = req.customer.id;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        let customer =  await CustomerModel.findById(customerId)
        if(!customer){
            return res.status(400).json({ success: false, message: 'Customer not found' });
        }

        let stripeCustomer = await StripeService.customer.getCustomer({
            email: customer.email,
            limit: 1
        })

        if(!stripeCustomer){
             stripeCustomer  = await StripeService.customer.createCustomer({
                email: customer.email,
                metadata:{},
                name: `${customer.firstName} ${customer.lastName} `,
                phone:  `${customer.phoneNumber.code}${customer.phoneNumber.number} `, 
            })
        }
        
        if(stripeCustomer){
            const stripeSession = await StripeService.session.createSession({
                mode: mode,
                currency: 'usd',
                customer: stripeCustomer.id,
                setup_intent_data: {
                    metadata: {
                        userType: 'customer',
                        userId: customer.id,
                    }
                }
            })
            customer.stripeCustomer = <IStripeCustomer>stripeCustomer 
            customer.save()
            return res.status(200).json({ success: true, message: 'Stripe Session created', data: stripeSession });
        }

    } catch (error: any) {
        console.error('Error creating stripe session:', error);
        return res.status(error.code || 500).json({ success: false, message:  error.message || 'Internal Server Error' });
    }
};


export const createAccount = async (req: any, res: Response) => {
    try {
        const { memberId, role } = req.body;
        const customerId = req.customer.id;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        let customer =  await CustomerModel.findById(customerId)
        if(!customer){
            return res.status(400).json({ success: false, message: 'Customer not found' });
        }


        const stripeCustomer  = await StripeService.customer.createCustomer({
            email: customer.email,
            metadata:{},
            name: `${customer.firstName} ${customer.lastName} `,
            phone:  `${customer.phoneNumber.code}${customer.phoneNumber.number} `, 
        })
        
        
       
        customer.stripeCustomer = <IStripeCustomer>stripeCustomer 
        customer.save()

        return res.status(200).json({ success: true, message: 'Stripe Customer created', data: stripeCustomer });

    } catch (error:any) {
        console.error('Error creating stripe customer:', error);
        return res.status(error.code || 500).json({ success: false, message:  error.message || 'Internal Server Error' });
    }
};









export const CustomerStripeController = {
    createSession,
    createAccount

}

