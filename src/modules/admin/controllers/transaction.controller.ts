import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";
import TransactionModel from "../../../database/common/transaction.model";
import { JobModel } from "../../../database/common/job.model";


//get transaction detail /////////////
export const AdminGetTransactionDetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
       page,
       limit
      } = req.query;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      page = page || 1;
      limit = limit || 50;

      const skip = (page - 1) * limit;

      const transactions = await TransactionModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(['initiatorUser', 'fromUser', 'toUser', 'job', 'payment']);
    

      const totalTansactions = await TransactionModel.countDocuments()

      let transactionDetail = []

      for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        let job = await JobModel.findOne({_id: transaction.job})

        if (!job) {
          job = null
        }

        let obj = {
          transaction, 
          job
        }

        transactionDetail.push(obj)
      }

      res.json({  
        currentPage: page,
        totalPages: Math.ceil(totalTansactions / limit),
        totalTansactions,
        transactions: transactionDetail
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  
}




//get transaction single detail /////////////
export const AdminGetSingleTransactionDetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
       transactionId
      } = req.params;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
    
      const transaction = await TransactionModel.findOne({_id: transactionId}).populate(['initiatorUser', 'fromUser', 'toUser', 'job', 'payment']);

      if (!transaction) {
          return res
          .status(401)
          .json({ message: "invalid transaction ID" });
      }

      let job = await JobModel.findOne({_id: transaction.job})

      if (!job) {
        job = null
    }


      res.json({  
        transaction,
        job
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  
}


export const TransactionDetailController = {
  AdminGetTransactionDetailController,
  AdminGetSingleTransactionDetailController,
}
