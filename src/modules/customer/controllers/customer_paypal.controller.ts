

import { NextFunction, Request, Response } from 'express';
import CustomerModel from '../../../database/customer/models/customer.model';
import { config } from '../../../config';
import { PayPalService } from '../../../services/paypal';
import { Logger } from '../../../services/logger';
import { PaypalCheckoutTemplate } from '../../../templates/common/paypal_checkout';
import { BadRequestError } from '../../../utils/custom.errors';



export const createPaymentMethodOrder = async (
    req: any,
    res: Response,
) => {

    const customerId = req.customer.id
    try {
        const customer = await CustomerModel.findById(customerId)
        if(!customer){
            return res.status(400).json({success: false, message: "customer not found"})
        }

        //create paypal customer here if not exists
        // const paypalCustomer = PayPalService.customer.createPayPalCustomer({email: customer.email, firstName: customer.firstName, lastName: customer.lastName})
        // console.log("paypalCustomer", paypalCustomer)

        const payload = { amount: 1, intent: 'AUTHORIZE', returnUrl: 'https://repairfind.ca/card-connected-successfully'  }
        const response = await PayPalService.payment.createOrder(payload)
        return res.status(200).json(response)
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }

}



export const authorizePaymentMethodOrder = async (
    req: any,
    res: Response,
) => {
    const { orderID } = req.body;
    const customerId = req.customer.id
    console.log("orderID",orderID)
    if (!orderID) {
        return res.status(400).send({success: false, message: 'Order ID is required.' });
    }

    try {

        const customer = await CustomerModel.findById(customerId)
        if(!customer){
            return res.status(400).send({success: false,  message: 'Customer not found' });
        }
        const {orderData, paymentMethod} = await PayPalService.payment.authorizeOrder(orderID)
        
        // create payment method here
        if (paymentMethod) {
            const existingPaymentMethodIndex: any = customer.paypalPaymentMethods.findIndex((pm: any) => pm.vault_id === paymentMethod.vault_id)
            if (existingPaymentMethodIndex !== -1) {
                customer.paypalPaymentMethods[existingPaymentMethodIndex] = paymentMethod
            } else {
                customer.paypalPaymentMethods.push(paymentMethod)
            }

        }

        await customer.save()

        if (
            orderData &&
            Array.isArray(orderData.purchase_units) &&
            orderData.purchase_units.length > 0 &&
            orderData.purchase_units[0].payments &&
            Array.isArray(orderData.purchase_units[0].payments.authorizations) &&
            orderData.purchase_units[0].payments.authorizations.length > 0 &&
            orderData.purchase_units[0].payments.authorizations[0].id
        ) {
            const authorizationId =  orderData.purchase_units[0].payments.authorizations[0].id;
            if(authorizationId){
                const voidAuthorization = await PayPalService.payment.voidAuthorization(authorizationId) 
                console.log("voidAuthorization", [voidAuthorization, voidAuthorization])
            }
        } 
        return res.status(200).send({success: true,  data: [orderData,paymentMethod] });
    } catch (error) {
        console.error('Error retrieving the order:', error);
        return res.status(500).send({success:false,  error: 'Failed to capture order.' });
    }

}


export const loadCreatePaymentMethodView = async (
    req: any,
    res: Response,
) => {
    try {
        const {token} =req.query;
        const paypalClientId = config.paypal.clientId

        let html = PaypalCheckoutTemplate({token, paypalClientId})
        return res.send(html);
    } catch (error) {
        console.error('Error retrieving the order:', error);
        return res.status(500).send({ error: 'Failed to capture order.' });
    }

}



export const deletePaypalPaymentMethod = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        // Find the customer document by ID
        const vaultId = req.params.vaultId
        const customerId = req.customer.id
        const customer = await CustomerModel.findById(customerId);

        // Check if the customer document exists
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const paymentMethodIndex = customer.paypalPaymentMethods.findIndex(method => method.vault_id === vaultId);

        // Check if the payment method exists in the array
        if (paymentMethodIndex === -1) {
            return res.status(404).json({ success: false, message: "Payment method not found" });
        }

        // Remove the payment method from the stripePaymentMethods array using splice
        customer.paypalPaymentMethods.splice(paymentMethodIndex, 1);

        //attempt to remove on paypal
        await PayPalService.customer.deleteVaultPaymentToken(vaultId);


        // Save the updated customer document
        const updatedCustomer = await customer.save();

        return res.status(200).json({ success: true, message: "Payment method removed successfully", data: updatedCustomer });
    } catch (err: any) {
        next(new BadRequestError(err.message, err))
    }
}


export const CustomerPaypalController = {
    createPaymentMethodOrder,
    authorizePaymentMethodOrder,
    loadCreatePaymentMethodView,
    deletePaypalPaymentMethod
}



