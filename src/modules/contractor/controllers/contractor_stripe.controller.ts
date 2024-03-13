

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StripeService } from '../../../services/stripe';
import CustomerModel from '../../../database/customer/models/customer.model';
import { IStripeCustomer } from '../../../database/customer/interface/customer.interface';
import { ContractorModel } from '../../../database/contractor/models/contractor.model';


export const createSession = async (req: any, res: Response) => {
    try {
        const { memberId, role } = req.body;
        const contractorId = req.contractor.id;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        let contractor =  await ContractorModel.findById(contractorId)
        if(!contractor){
            return res.status(400).json({ success: false, message: 'Contractor not found' });
        }

        // check if user account exist
        let stripeCustomer = await StripeService.customer.getCustomer({
            email: contractor.email,
            limit: 1
        })

        if(!stripeCustomer){
             stripeCustomer  = await StripeService.customer.createCustomer({
                email: contractor.email,
                metadata:{},
                name: `${contractor.firstName} ${contractor.lastName} `,
                phone:  `${contractor.phoneNumber.code}${contractor.phoneNumber.number} `, 
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

        contractor.stripeCustomer = <IStripeCustomer>stripeCustomer 
        contractor.save()

        return res.status(200).json({ success: true, message: 'Stripe Session created', data: stripeSession });

    } catch (error) {
        console.error('Error inviting to team:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const createAccount = async (req: any, res: Response) => {
    try {
        const { memberId, role } = req.body;
        const contractorId = req.contractor.id;


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation errors", errors: errors.array() });
        }

        let contractor =  await ContractorModel.findById(contractorId)
        if(!contractor){
            return res.status(400).json({ success: false, message: 'Contractor not found' });
        }


        const stripeCustomer  = await StripeService.customer.createCustomer({
            email: contractor.email,
            metadata:{},
            name: `${contractor.firstName} ${contractor.lastName} `,
            phone:  `${contractor.phoneNumber.code}${contractor.phoneNumber.number} `, 
        })
        
        
       
        contractor.stripeCustomer = <IStripeCustomer>stripeCustomer 
        contractor.save()

        return res.status(200).json({ success: true, message: 'Stripe Customer created', data: stripeCustomer });

    } catch (error) {
        console.error('Error creating stripe customer:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};









export const ContractorStripeController = {
    createSession,
    createAccount

}

