import { NextFunction, Request, Response } from "express";
import { StripeService } from "../../../services/stripe";
import { Log } from "../../../utils/logger";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { castPayloadToDTO } from "../../../utils/interface_dto.util";
import { IStripeAccount } from "../../../database/common/stripe_account.schema";
import { InternalServerError } from "../../../utils/custom.errors";


export const removeStripeAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const {contractorId} = req.params;
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }
        //@ts-ignore
        contractor.stripeAccount = null
        await contractor.save()

        return res.json({ success: true, message: 'Stripe account  removed', data: contractor });
    } catch (error: any) {
        return next(new InternalServerError( 'Error removing stripe account', error))
    }

}


export const attachStripeAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const {stripeAccountId = 'acct_1P4N6NRdmDaBvbML'} = req.body;
        const {contractorId} = req.params;
        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        const account: unknown = await StripeService.account.getAccount(stripeAccountId); //acct_1P4N6NRdmDaBvbML ,acct_1P7XvFRZlKifQSOs
        const stripeAccount = castPayloadToDTO(account, account as IStripeAccount)
        contractor.stripeAccount = stripeAccount
        await contractor.save()
        return res.json({ success: true, message: 'Stripe account  attached', data: contractor });
    } catch (error: any) {
        return next(new InternalServerError( `Error attaching stripe account: ${error.message}`, error))
    }

}

export const AdminContractorController = {
    removeStripeAccount,
    attachStripeAccount
}