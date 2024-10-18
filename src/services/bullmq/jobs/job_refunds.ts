import { EmailService, NotificationService } from "../..";
import { IJob, JobModel } from "../../../database/common/job.model";
import { IPayment, PaymentModel } from "../../../database/common/payment.schema";
import TransactionModel, { ITransaction, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { IContractor } from "../../../database/contractor/interface/contractor.interface";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { ICustomer } from "../../../database/customer/interface/customer.interface";
import CustomerModel from "../../../database/customer/models/customer.model";
import { i18n } from "../../../i18n";
import { GenericEmailTemplate } from "../../../templates/common/generic_email";
import { Logger } from "../../logger";
import { PayPalService } from "../../paypal";
import { StripeService } from "../../stripe";

export const handleJobRefunds = async () => {
    try {
        const transactions = await TransactionModel.find({
            type: TRANSACTION_TYPE.REFUND,
            status: TRANSACTION_STATUS.PENDING
        });

        for (const transaction of transactions) {
            try {
                const fromUser = (transaction.fromUserType === 'customers') ? 
                    await CustomerModel.findById(transaction.fromUser) : 
                    await ContractorModel.findById(transaction.fromUser);

                const toUser = (transaction.toUserType === 'customers') ? 
                    await CustomerModel.findById(transaction.toUser) : 
                    await ContractorModel.findById(transaction.toUser);

                const job = await JobModel.findById(transaction.job);

                if (fromUser && toUser && job) {
                    const payment = await PaymentModel.findById(transaction.payment);
                    if (!payment) {
                        Logger.error(`Error processing refund transaction: Payment not found`);
                        continue; // Skip to next transaction if payment not found
                    }

                    if (payment.channel === 'stripe') {
                        const amount = (transaction.amount * 100);
                        const charge = payment.charge_id;
                        let metadata: any = transaction.metadata ?? {};
                        metadata.transactionId = transaction.id;
                        metadata.paymentId = payment.id;
                        await StripeService.payment.refundCharge(charge, amount, metadata); // Refund
                        transaction.status = TRANSACTION_STATUS.SUCCESSFUL; // Update status
                    }

                    if (payment.channel === 'paypal') {
                        Logger.info(`Error processing refund transaction: Payment is paypal`);
                        const amount = transaction.amount;
                        const capture_id = payment.capture_id;
                        let metadata: any = transaction.metadata ?? {};
                        metadata.transactionId = transaction.id;
                        metadata.paymentId = payment.id;

                        try {
                            const paypalRefund = await PayPalService.payment.refundPayment(capture_id, amount);
                            await sendRefundReceiptEmail({fromUser, toUser, transaction, payment, job});
                            transaction.status = TRANSACTION_STATUS.SUCCESSFUL; // Update status
                            Logger.info(`Paypal refund completed: ${transaction.id}`, paypalRefund);
                        } catch (error: any) {
                            const { name, message, details } = error.response.data;

                            // Check for 'CAPTURE_FULLY_REFUNDED' error and handle it
                            if (name === 'UNPROCESSABLE_ENTITY' && details.some((detail: any) => detail.issue === 'CAPTURE_FULLY_REFUNDED')) {
                                // Set transaction status to SUCCESSFUL to prevent further attempts
                                transaction.status = TRANSACTION_STATUS.SUCCESSFUL;
                                Logger.info(`Transaction already fully refunded: ${transaction.id}`);
                            } else {
                                throw error; // Re-throw other errors
                            }
                        }
                    }
                }
            } catch (error: any) {
                Logger.error(`Error processing refund transaction: ${transaction.id}`, error.response?.data);
            } finally {
                // Ensure transaction is saved regardless of success or failure
                await transaction.save();
                Logger.info(`Processing refund finally`, transaction);
            }
        }
    } catch (error) {
        Logger.error('Error processing refund transactions:', error);
    }
};



export const sendRefundReceiptEmail = async ({
    fromUser,
    toUser,
    transaction,
    payment,
    job
}: {
    fromUser: ICustomer | IContractor;
    toUser: ICustomer | IContractor;
    transaction: ITransaction;
    payment: IPayment;
    job: IJob;
}) => {
    let emailSubject = 'Job Refund';
    let emailContent = `
        <h2>${emailSubject}</h2>
        <p style="color: #333333;">Hello ${toUser.name},</p>
        <p style="color: #333333;">You have received a refund for the job payment you made on RepairFind.</p>
        <p><strong>Job Title:</strong> ${job.description}</p>
        <p><strong>Original Payment Date:</strong> ${new Date(payment.created).toLocaleDateString()}</p>
        <hr>
        <p><strong>Refund Details</strong></p>
        <p><strong>Job Title:</strong> ${job.description}<br>
        <strong>Refund Amount:</strong> $${transaction.amount.toFixed(2)}</p>

        <p><strong>Original Payment:</strong><br>
        - Payment Method: ${payment.channel === 'stripe' ? 'Credit/Debit Card (Stripe)' : 'PayPal'}<br>
        - Transaction ID: RPT${transaction.id}</p>

        <p style="color: #333333;">The amount has been refunded to your original payment method.</p>
        <p style="color: #333333;">If you have any issues or questions, please contact us via support.</p>
        <p style="color: #333333;">Thank you for using RepairFind!</p>
    `;


    let html = GenericEmailTemplate({ name: toUser.name, subject: emailSubject, content: emailContent });
    const translatedHtml = await i18n.getTranslation({ phraseOrSlug: html, targetLang: toUser.language, saveToFile: false, useGoogle: true, contentType: 'html' }) || html;
    const translatedSubject = await i18n.getTranslation({ phraseOrSlug: emailSubject,  targetLang: toUser.language }) || emailSubject;

    try {
        await EmailService.send(toUser.email, translatedSubject, translatedHtml);
        Logger.info(`Refund receipt email sent to ${toUser.email}`);
    } catch (error) {
        Logger.error(`Failed to send refund receipt email to ${toUser.email}:`, error);
    }
};

