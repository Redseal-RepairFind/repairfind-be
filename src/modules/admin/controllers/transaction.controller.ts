import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import TransactionModel from "../../../database/admin/models/transaction.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import JobModel from "../../../database/contractor/models/job.model";
import ContractorDocumentValidateModel from "../../../database/contractor/models/contractorDocumentValidate.model";


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
        .limit(limit);

        let transactionDetail = [];

        const totalTansactions = await TransactionModel.countDocuments()

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];

            let from: any;
            let to: any;

            if (transaction.to == 'customer') {
                to = await CustomerRegModel.findOne({_id: transaction.fromId}).select('-password');
                if (!to) continue
                
            }else if(transaction.to == 'contractor'){
                to = await ContractorModel.findOne({_id: transaction.fromId}).select('-password'); 
                if (!to) continue 
            } else {
                to = 'admin'
            }

            if (transaction.from == 'customer') {
                from = await CustomerRegModel.findOne({_id: transaction.fromId}).select('-password');
                if (!from) continue
                
            }else if(transaction.from == 'contractor'){
                from = await ContractorModel.findOne({_id: transaction.fromId}).select('-password');
                if (!from) continue;

            } else {
                from = 'admin'
            }

            const job = await JobModel.findOne({_id: transaction.jobId})
            if (!job) continue

            const customer = await CustomerRegModel.findOne({_id: job.customerId})
            if (!customer) continue

            const contractor = await ContractorModel.findOne({_id: job.contractorId})
            if (!contractor) continue

            const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: contractor._id})
            if (!contractorDocument) continue

            const obj = {
                transaction,
                to,
                from,
                job,
                customer,
                contractor,
                contractorDocument
            }

            transactionDetail.push(obj)
        }

      res.json({  
        totalTansactions,
        transactionDetail
      });
      
    } catch (err: any) {
      // signup error
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
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id
      
        const transaction = await TransactionModel.findOne({_id: transactionId});
        
        if (!transaction) {
            return res
            .status(401)
            .json({ message: "invalid transaction ID" });
        }

        let from: any;
        let to: any;

        if (transaction.to == 'customer') {
            to = await CustomerRegModel.findOne({_id: transaction.fromId}).select('-password');
            
        }else if(transaction.to == 'contractor'){
            to = await ContractorModel.findOne({_id: transaction.fromId}).select('-password');  
        } else {
            to = 'admin'
        }

        if (transaction.from == 'customer') {
            from = await CustomerRegModel.findOne({_id: transaction.fromId}).select('-password');
            
        }else if(transaction.from == 'contractor'){
            from = await ContractorModel.findOne({_id: transaction.fromId}).select('-password');  
        } else {
            from = 'admin'
        }

        let job = await JobModel.findOne({_id: transaction.jobId})
        if (!job) {
            job = null
        }

        let customer = await CustomerRegModel.findOne({_id: job?.customerId})
        if (!customer){
          customer = null
        }

        let contractor = await ContractorModel.findOne({_id: job?.contractorId})
        if (!contractor) {
          contractor = null
        }

        let contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: contractor?._id})
        if (!contractorDocument) {
          contractorDocument = null
        }

        const obj = {
          transaction,
          to,
          from,
          job,
          customer,
          contractor,
          contractorDocument
        }
    
      res.json({  
        obj
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}
