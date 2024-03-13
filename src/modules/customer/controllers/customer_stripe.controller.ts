

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StripeService } from '../../../services/stripe';
import CustomerModel from '../../../database/customer/models/customer.model';
import { IStripeCustomer } from '../../../database/customer/interface/customer.interface';


export const createSession = async (req: any, res: Response) => {
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

        // check if user account exist
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
        
        const stripeSession = await StripeService.session.createSession({
            mode: 'setup',
            currency: 'usd',
            customer: '{{CUSTOMER_ID}}',
            setup_intent_data: {
                metadata: {
                    userType: 'customer',
                    userId: memberId,
                }
            }
        })

        customer.stripeCustomer = <IStripeCustomer>stripeCustomer 
        customer.save()

        return res.status(200).json({ success: true, message: 'Stripe Session created', data: stripeSession });

    } catch (error) {
        console.error('Error creating stripe session:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
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

    } catch (error) {
        console.error('Error creating stripe customer:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};









export const CustomerStripeController = {
    createSession,
    createAccount

}

