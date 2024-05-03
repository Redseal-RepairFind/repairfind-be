import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import { JobModel } from "../../../database/common/job.model";
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
        const totalPendingJobOne = await JobModel.countDocuments({status: "PENDING"})
        const totalPendingJobTwo = await JobModel.countDocuments({status: "DECLINED"})
        const totalPendingJobTre = await JobModel.countDocuments({status: "ACCEPTED"})
        const totalPendingJobFor = await JobModel.countDocuments({status: "EXPIRED"})
        const totalPendingJobfiv = await JobModel.countDocuments({status: "BOOKED"})
        
        totalPendingJob = totalPendingJobOne + totalPendingJobTwo + totalPendingJobTre + totalPendingJobFor + totalPendingJobfiv;

        //get total progress work
        let totalProgressJob = 0
        const totalProgressJobOne = await JobModel.countDocuments({status: "BOOKED"})
        const totalProgressJobTwo = await JobModel.countDocuments({status: "ACCEPTED"})
        totalProgressJob = totalProgressJobOne + totalProgressJobTwo

        //get total completed job detail
        const totalCompletedJob = await JobModel.countDocuments({status: "COMPLETED"})


        //get total complain job detail
        const totalComplainedJob = await JobModel.countDocuments({status: "DISPUTED"})

        // get total revenue
        let totalRevenue = 0;
       
        // const result = await Transaction.aggregate([
        //   {
        //     $match: {
        //       transactionType: "credit" // Assuming 'transactionType' is the field name for transaction type
        //     }
        //   },
        //   {
        //     $group: {
        //       _id: null,
        //       totalAmount: { $sum: '$amount' }
        //     }
        //   }
        // ]);
        

        const transactions = await TransactionModel.aggregate([
          {
            $group: {
              _id: null,
              totalAmount: { $sum: '$amount' }
            }
          }
        ]);

        totalRevenue = transactions[0].totalAmount

        
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
