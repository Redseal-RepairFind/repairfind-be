import { NextFunction, Response } from "express";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import TransactionModel, { ITransaction, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";




// Controller method to fetch customer transactions
export const getTransactions = async (req: any, res: Response, next: NextFunction) => {
    const contractorId = req.contractor.id; // Assuming contractorId is passed in the request params

    try {

        let filter: any = {
            type: {$ne: TRANSACTION_TYPE.ESCROW},
            $or: [
                { fromUser: contractorId, fromUserType: 'contractors' },
                { toUser: contractorId, toUserType: 'contractors' }
            ]
        }

        // Fetch transactions for the specified customer
        const { data, error } = await applyAPIFeature(TransactionModel.find(filter).populate([{ path: 'fromUser' }, { path: 'toUser' }]), req.query);

        if (data) {
            await Promise.all(data.data.map(async (transaction: ITransaction) => {
                transaction.isCredit = await transaction.getIsCredit(contractorId)
            }));
        }

        // Return the transactions in the response
        res.status(200).json({ success: true, data });
    } catch (error: any) {
        next(new InternalServerError('Error fetching contractor transactions', error))
    }
};


export const getSingleTransaction = async (req: any, res: Response, next: NextFunction) => {
    const contractorId = req.contractor.id;
    const transactionId = req.params.transactionId;

    try {

        const transaction = await TransactionModel.findById(transactionId)
            .populate([{ path: 'fromUser' }, { path: 'toUser' }]) as ITransaction | null;

        if (transaction) {
            transaction.isCredit = await transaction.getIsCredit(contractorId);
        }

        res.status(200).json({ message: 'transaction retrieved successfully', success: true, data: transaction });
    } catch (error: any) {
        next(new InternalServerError('Error fetching customer transactions', error))
    }
};


export const getTransactionSummary = async (req: any, res: Response, next: NextFunction) => {
    try {


        const contractorId = req.contractor.id; // Assuming customerId is passed in the request params

        const contractor = await ContractorModel.findById(contractorId);
        if (!contractor) {
            return res.status(400).json({ success: false, message: 'Customer not found' })
        }



        // Calculate amount in holding from TransactionModel
        const transactions: ITransaction[] = await TransactionModel.find({ toUser: contractorId, type: TRANSACTION_TYPE.ESCROW, status: TRANSACTION_STATUS.PENDING });
        const amountInHoldingFromTransactions: number = transactions.reduce((total, transaction) => {
            if (transaction.toUser.toString() === contractorId && transaction.getIsCredit(contractorId)) {
                return total + transaction.amount;
            }
            return total;
        }, 0);

        // Calculate total amount in holding
        const totalAmountInHolding: number = amountInHoldingFromTransactions;

        res.json({
            success: true,
            message: 'Transaction summary retrieved',
            data: { amountInHolding: totalAmountInHolding }
        });
    } catch (error: any) {
        next(new InternalServerError('Error retrieving transaction summary', error));
    }
};


export const ContractorTransactionController = {
    getTransactions,
    getSingleTransaction,
    getTransactionSummary

}


