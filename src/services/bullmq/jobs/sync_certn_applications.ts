import { CertnService } from "../..";
import TransactionModel, { ITransaction, TRANSACTION_STATUS } from "../../../database/common/transaction.model";
import { IContractor, IContractorCertnDetails } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { castPayloadToDTO } from "../../../utils/interface_dto.util";
import { Logger } from "../../logger";
import { StripeService } from "../../stripe";


export const syncCertnApplications = async () => {
    try {

        const contractors = await ContractorModel.find({
            certnId: {$ne: null},
            "certnDetails.result": {$ne: "CLEARED"}
        }) as IContractor[];

        for (const contractor of contractors) {
            try {
                
                const res = await CertnService.retrieveApplicant(contractor.certnId);
                contractor.certnDetails = castPayloadToDTO(res, res as IContractorCertnDetails)
                contractor.save()
                Logger.info(`Successfully synced certn profile for: ${contractor.email}` );
            } catch (error) {
                Logger.error(`Error syncing  certn profile for: ${contractor.email}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error occurred while syncing certn:', error);
    }
};
