import { NextFunction, Response } from "express";
import { BadRequestError, InternalServerError } from "../../../utils/custom.errors";
import TransactionModel, { ITransaction, TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { applyAPIFeature } from "../../../utils/api.feature";




// Controller method to fetch customer transactions
export const getTransactions = async (req: any, res: Response, next: NextFunction) => {
    const customerId = req.customer.id; // Assuming customerId is passed in the request params

    try {

        let filter: any = { 
            $or: [
                { fromUser: customerId, fromUserType: 'customers'},
                { toUser: customerId, toUserType: 'customers'}
            ]
        }

        // Fetch transactions for the specified customer
        const { data, error } = await applyAPIFeature(TransactionModel.find(filter).populate([{path:'fromUser'}, {path:'toUser'}]), req.query);
        
        if(data){
            await Promise.all(data.data.map(async (transaction: ITransaction) => {
                 transaction.isCredit = await transaction.getIsCredit(customerId)
            }));
        }

        // Return the transactions in the response
        res.status(200).json({ success: true, data });
    } catch (error:any) {
        next(new InternalServerError('Error fetching customer transactions', error))
    }
};


export const getSingleTransactions = async (req: any, res: Response, next: NextFunction) => {
    const customerId = req.customer.id; 
    const transactionId = req.params.transactionId;

    try {

       const transaction =  await TransactionModel.findById(transactionId).populate([{path:'fromUser'}, {path:'toUser'}]);
        if(transaction){
            transaction.isCredit = await transaction.getIsCredit(customerId)
        }

        res.status(200).json({message: 'transaction retrieved successfully', success: true, data: transaction });
    } catch (error:any) {
        next(new InternalServerError('Error fetching customer transactions', error))
    }
};



export const CustomerTransactionController = {
    getTransactions,
    getSingleTransactions

}


