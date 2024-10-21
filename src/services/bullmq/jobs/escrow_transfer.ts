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

        Logger.info(`Found ${transactions.length} escrow transactions to process.`);

        for (const transaction of transactions) {
            try {
                Logger.info(`Processing escrow transfer for transaction ${transaction.id}`);

                const toUser = await ContractorModel.findById(transaction.toUser);
                if (!toUser) {
                    Logger.error(`Contractor not found for transaction ${transaction.id}`);
                    throw 'Contractor not found';
                }

                const payment = await PaymentModel.findById(transaction.payment);
                if (!payment) {
                    Logger.error(`Payment not found for transaction ${transaction.id}`);
                    continue;
                }

                let transferDetails;

                if (payment.channel === 'stripe') {
                    Logger.info(`Processing Stripe transfer for transaction ${transaction.id}`);

                    const toUserStripeConnectAccount = toUser?.stripeAccount;
                    if (!toUserStripeConnectAccount) {
                        Logger.error(`No active Stripe connect account found for contractor ${toUser.id}`);
                        throw 'Contractor does not have an active connect account';
                    }

                    const connectAccountId = toUserStripeConnectAccount.id;
                    const amount = (transaction.amount * 100);  // Change to base currency

                    const transactionMeta = transaction.metadata ?? {};
                    let metadata: any = { ...transactionMeta, transactionId: transaction.id, paymentId: payment.id };

                    const stripeTransfer = await StripeService.transfer.createTransfer(connectAccountId, amount, metadata);
                    metadata.transfer = stripeTransfer;
                    transaction.metadata = metadata;
                    transaction.status = TRANSACTION_STATUS.SUCCESSFUL;
                    transferDetails = stripeTransfer;

                    await transaction.save();
                    Logger.info(`Stripe transfer successful for transaction ${transaction.id}`);

                    TransactionEvent.emit('ESCROW_TRANSFER_SUCCESSFUL', transaction);
                    
                    await sendEscrowTransferEmail(toUser, transaction, payment, transferDetails);
                }

                if (payment.channel === 'paypal') {
                    Logger.info(`Processing PayPal transfer for transaction ${transaction.id}`);

                    try {
                        const amount = transaction.amount;
                        const paypalTransfer = await PayPalService.payout.transferToEmail(toUser.email, amount, 'CAD');
                        
                        const transactionMeta = transaction.metadata ?? {};
                        let metadata: any = { ...transactionMeta, transactionId: transaction.id, paymentId: payment.id, transfer: paypalTransfer };
    
                        transaction.metadata = metadata;
                        transaction.status = TRANSACTION_STATUS.SUCCESSFUL;
                        transferDetails = paypalTransfer;

                        Logger.info(`PayPal transfer successful for transaction ${transaction.id}`);
                        TransactionEvent.emit('ESCROW_TRANSFER_SUCCESSFUL', transaction);
                        await sendEscrowTransferEmail(toUser, transaction, payment, transferDetails);

                    } catch (error: any) {
                        Logger.error(`PayPal transfer error for transaction ${transaction.id}:`, error);

                        // Extract PayPal error details if available
                        if (error.response && error.response.data) {
                            const { name, message, details } = error.response.data;

                            Logger.error(`PayPal Error Name: ${name}`);
                            Logger.error(`PayPal Error Message: ${message}`);
                            
                            if (details && Array.isArray(details)) {
                                details.forEach((detail: any) => {
                                    Logger.error(`PayPal Error Detail: ${JSON.stringify(detail)}`);
                                });
                            }

                            // Specific handling of known error (e.g., Authorization issue)
                            if (name === 'Authorization' && details.some((detail: any) => detail.issue === 'CAPTURE_FULLY_REFUNDED')) {
                                Logger.info(`Transaction authorization failed: ${transaction.id}`);
                                transaction.status = TRANSACTION_STATUS.FAILED;
                            }
                        }

                        // Re-throw error for further handling if it's not a known issue
                        throw error;
                    }
                }

            } catch (error) {
                Logger.error(`Error processing payout transfer for transaction ${transaction.id}:`, error);
            } finally {
                // Ensure transaction is saved regardless of success or failure
                await transaction.save();
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
        <p style="color: #333333;">Thank you for using RepairFind!</p>
        <p style="color: #333333;">If you have any issues, feel free to contact us via support.</p>
    `;

    const html = GenericEmailTemplate({ name: contractor.name, subject: emailSubject, content: emailContent });

    try {
        await EmailService.send(contractor.email, emailSubject, html);
        Logger.info(`Escrow transfer email sent to ${contractor.email} for transaction ${transaction.id}`);
    } catch (error) {
        Logger.error(`Failed to send escrow transfer email to ${contractor.email} for transaction ${transaction.id}:`, error);
    }
};
