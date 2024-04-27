import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import JobModel from "../../../database/contractor/models/job.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import TransactionModel from "../../../database/common/transaction.model";


//get app detail /////////////
export const AdminGetAppDetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
       
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        // get total customer
        const totalCustomer = await CustomerRegModel.countDocuments();

        // get total contractor
        const totalContractor = await ContractorModel.countDocuments();

        //get total job
        const totalJob = await JobModel.countDocuments();

        // get total reject quesby contractor
        const totalRequestRejectedJobByContrator = await JobModel.countDocuments({status: "job reject"})

        //get total pending job detail
        let totalPendingJob = 0
        const totalPendingJobOne = await JobModel.countDocuments({status: "sent request"})
        const totalPendingJobTwo = await JobModel.countDocuments({status: "sent qoutation"})
        const totalPendingJobTre = await JobModel.countDocuments({status: "qoutation payment open"})
        const totalPendingJobFor = await JobModel.countDocuments({status: "inspection payment open"})
        totalPendingJob = totalPendingJobOne + totalPendingJobTwo + totalPendingJobTre + totalPendingJobFor;

        //get total progress work
        let totalProgressJob = 0
        const totalProgressJobOne = await JobModel.countDocuments({status: "qoutation payment confirm and job in progress"})
        const totalProgressJobTwo = await JobModel.countDocuments({status: "completed"})
        totalProgressJob = totalProgressJobOne + totalProgressJobTwo

        //get total completed job detail
        const totalCompletedJob = await JobModel.countDocuments({status: "comfirmed"})


        //get total complain job detail
        const totalComplainedJob = await JobModel.countDocuments({status: "complain"})

        // get total revenue
        let totalRevenue = 0;
        const transactions = await TransactionModel.find({type: "credit"})

        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            if(transaction.amount){
              totalRevenue = totalRevenue + transaction.amount
            }
            
        }

        
      res.json({  
        totalCustomer,
        totalContractor,
        totalJob,
        totalRequestRejectedJobByContrator,
        totalPendingJob,
        totalProgressJob,
        totalCompletedJob,
        totalComplainedJob,
        totalRevenue,
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}
