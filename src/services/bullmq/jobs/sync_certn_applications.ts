import { CertnService, NotificationService } from "../..";
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
            "certnDetails.report_status": {$ne: "COMPLETE"}
        }) as IContractor[];

        for (const contractor of contractors) {
            try {
                
                const res = await CertnService.retrieveApplicant(contractor.certnId);
                const certnDetails = castPayloadToDTO(res, res as IContractorCertnDetails)
                contractor.certnDetails = certnDetails
                contractor.save()

                if(certnDetails.report_status == 'COMPLETE'){
                    NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Background Check Complete',
                        type: 'BACKGROUND_CHECK', //
                        message: `Your background check with CERTN is now complete`,
                        heading: { name: `Repairfind`, image: 'https://repairfindtwo.s3.us-east-2.amazonaws.com/repairfind-logo.png' },
                        payload: {
                        }
                    }, { push: true, socket: true, database: true })
                }

                Logger.info(`Successfully synced certn profile for: ${contractor.email}` );
            } catch (error) {
                Logger.error(`Error syncing  certn profile for: ${contractor.email}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error occurred while syncing certn:', error);
    }
};
