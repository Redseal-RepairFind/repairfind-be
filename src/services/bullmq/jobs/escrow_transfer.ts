import { NotificationService } from "../..";
import { IJob } from "../../../database/common/job.model";
import { PaymentModel } from "../../../database/common/payment.schema";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { IContractor } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { TransactionEvent } from "../../../events/transaction.events";
import { Logger } from "../../logger";
import { PayPalService } from "../../paypal";
import { StripeService } from "../../stripe";
import { EmailService } from "../../email";  // Import the email service
import { GenericEmailTemplate } from "../../../templates/common/generic_email";

export const handleEscrowTransfer = async () => {
    try {
        const transactions = await TransactionModel.find({
            type: TRANSACTION_TYPE.ESCROW,
            status: TRANSACTION_STATUS.APPROVED
        });

        for (const transaction of transactions) {
            try {

                const toUser = await ContractorModel.findById(transaction.toUser);
                if (!toUser) throw 'Contractor not found';

                const payment = await PaymentModel.findById(transaction.payment);
                if (!payment) return;

                let transferDetails;
                if (payment.channel === 'stripe') {
                    const toUserStripeConnectAccount = toUser?.stripeAccount;
                    if (!toUserStripeConnectAccount) throw 'Contractor does not have an active connect account';

                    const connectAccountId = toUserStripeConnectAccount.id;
                    const amount = (transaction.amount * 100);  // Change to base currency

                    const transactionMeta = transaction.metadata;
                    let metadata: any = { ...transactionMeta } ?? {};
                    metadata.transactionId = transaction.id;
                    metadata.paymentId = payment.id;

                    const stripeTransfer = await StripeService.transfer.createTransfer(connectAccountId, amount, metadata);
                    metadata.transfer = stripeTransfer;
                    transaction.metadata = metadata;
                    transaction.status = TRANSACTION_STATUS.SUCCESSFUL;

                    transferDetails = stripeTransfer;
                }

                if (payment.channel === 'paypal') {
                    const amount = transaction.amount;
                    const paypalTransfer = await PayPalService.payout.transferToEmail(toUser.email, amount, 'CAD');
                    const transactionMeta = transaction.metadata;
                    let metadata: any = { ...transactionMeta } ?? {};
                    metadata.transactionId = transaction.id;
                    metadata.paymentId = payment.id;
                    metadata.transfer = paypalTransfer;
                    transaction.metadata = metadata;
                    transaction.status = TRANSACTION_STATUS.SUCCESSFUL;
                    transferDetails = paypalTransfer;
                }

                // Save transaction updates
                await transaction.save();

                // Handle other stuffs like payout accumulated bonus from event
                TransactionEvent.emit('ESCROW_TRANSFER_SUCCESSFUL', transaction);

                // Send notification email to the contractor
                await sendEscrowTransferEmail(toUser, transaction, payment, transferDetails);

            } catch (error) {
                Logger.info(`Error processing payout transfer: ${transaction.id}`, error);
            }
        }

    } catch (error) {
        Logger.error('Error processing handleEscrowTransfer:', error);
    }
};

// Function to send email after successful escrow transfer
const sendEscrowTransferEmail = async (contractor: IContractor, transaction: any, payment: any, transferDetails: any) => {
    const emailSubject = 'Escrow Payment Received';
    const emailContent = `
        <h2>${emailSubject}</h2>
        <p style="color: #333333;">Hello ${contractor.name},</p>
        <p style="color: #333333;">The payment for the job has been released from escrow and transferred to your account.</p>
        <p><strong>Job Description:</strong> ${transaction.jobDescription}</p>
        <p><strong>Transaction Amount:</strong> $${transaction.amount.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${payment.channel === 'stripe' ? 'Stripe' : 'PayPal'}</p>
        <p><strong>Transfer Details:</strong> ${JSON.stringify(transferDetails)}</p>
        <p style="color: #333333;">Thank you for using RepairFind!</p>
        <p style="color: #333333;">If you have any issues, feel free to contact us via support.</p>
    `;

    const html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent });

    try {
        await EmailService.send(contractor.email, emailSubject, html);
        Logger.info(`Escrow transfer email sent to ${contractor.email}`);
    } catch (error) {
        Logger.error(`Failed to send escrow transfer email to ${contractor.email}:`, error);
    }
};
