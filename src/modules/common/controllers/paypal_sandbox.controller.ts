import { Request, response, Response } from "express";
import { StripeService } from "../../../services/stripe";
import { PayPalService } from "../../../services/paypal";
import { Logger } from "../../../services/logger";


export const createOrder = async (
    req: Request,
    res: Response,
) => {

    try {
        const payload = { amount: 1, intent: 'CAPTURE' }
        const response = await PayPalService.payment.createOrder(payload)
        return res.status(200).json(response)
    } catch (err: any) {
        console.log(err)
        res.status(500).json({ success: false, message: err.message });
    }

}





export const captureOrder = async (
    req: Request,
    res: Response,
) => {
    const { orderID } = req.body;

    if (!orderID) {
        return res.status(400).send({ error: 'Order ID is required.' });
    }

    try {
        const {orderData, paymentMethod} = await PayPalService.payment.captureOrder(orderID)
        
        Logger.info('Order captured', [{orderData, paymentMethod}])
        
        return res.status(200).send({ data: orderData });
    } catch (error) {
        console.error('Error retrieving the order:', error);
        return res.status(500).send({ error: 'Failed to capture order.' });
    }

}


export const authorizeOrder = async (
    req: Request,
    res: Response,
) => {
    const { authorizationId } = req.body;

    if (!authorizationId) {
        return res.status(400).send({ error: 'AuthorizationId ID is required.' });
    }

    try {
        const authorization = await PayPalService.payment.captureAuthorization(authorizationId)
        console.log(authorization)
        return res.status(200).send({ data: authorization });
    } catch (error) {
        console.error('Error retrieving the order:', error);
        return res.status(500).send({ error: 'Failed to authorization order.' });
    }

}


export const chargePaymentMethod = async (
    req: Request,
    res: Response,
) => {
    const { authorizationId } = req.body;


    try {
        const payment = await PayPalService.payment.chargeSavedCard({paymentToken: "4x106114g39763503", amount: 1})
        return res.status(200).send({ data: payment });
    } catch (error) {
        console.error('Error retrieving the order:', error);
        return res.status(500).send({ error: 'Failed to authorization order.' });
    }

}


export const createSetupToken = async (
    req: Request,
    res: Response,
) => {
    const { authorizationId } = req.body;

    try {
        const payment = await PayPalService.vault.createSetupToken()
        return res.status(200).send({ data: payment });
    } catch (error) {
        console.error('Error retrieving the order:', error);
        return res.status(500).send({ error: 'Failed to authorization order.' });
    }

}





export const PaypalSandboxController = {
    createOrder,
    captureOrder,
    authorizeOrder,
    chargePaymentMethod,
    createSetupToken
}
