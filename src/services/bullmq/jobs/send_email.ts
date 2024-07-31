import { SendMailOptions } from "nodemailer";
import { EmailService } from "../..";
import TransactionModel, { ITransaction, TRANSACTION_STATUS } from "../../../database/common/transaction.model";
import { IContractor, IContractorCertnDetails } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { castPayloadToDTO } from "../../../utils/interface_dto.util";
import { Logger } from "../../logger";
import { StripeService } from "../../stripe";


export const sendEmail = async (job: any) => {
    try {

        const mailOptions : SendMailOptions = job.data
        await EmailService.createTransport().sendMail(mailOptions);
        Logger.info(`Email sent successfully to ${mailOptions.to} with CC to ${mailOptions.cc}`);

    } catch (error) {
        Logger.error('Error occurred while sending mail:', error);
    }
};
