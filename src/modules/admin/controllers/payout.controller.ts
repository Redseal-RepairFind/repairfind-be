import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import CustomerRegModel from "../../../database/customer/models/customer.model";
import JobModel from "../../../database/contractor/models/job.model";
import PayoutModel from "../../../database/admin/models/payout.model";

//get pending Payout detail /////////////
export const AdminGetPendingPayoutDetailController = async (
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

        const Payouts = await PayoutModel.find({status: "pending"})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        let pendingPayout = [];

        const totalPendigPayout = await PayoutModel.countDocuments({status: "pending"})

        for (let i = 0; i < Payouts.length; i++) {
            const Payout = Payouts[i];

            const job = await JobModel.findOne({_id: Payout.jobId})
            if (!job) continue

            const customer = await CustomerRegModel.findOne({_id: job.customerId})
            if (!customer) continue

            const contractor = await ContractorModel.findOne({_id: job.contractorId})
            if (!contractor) continue

          
            const obj = {
                Payout,
                job,
                customer,
                contractor,
            }

            pendingPayout.push(obj)
        }

      res.json({  
        totalPendigPayout,
        pendingPayout
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}


//get completed Payout detail /////////////
export const AdminGetCompletedPayoutDetailController = async (
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

        const Payouts = await PayoutModel.find({status: "completed"})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        let completedPayout = [];

        const totalCompletedPayout = await PayoutModel.countDocuments({status: "completed"})

        for (let i = 0; i < Payouts.length; i++) {
            const Payout = Payouts[i];

            const job = await JobModel.findOne({_id: Payout.jobId})
            if (!job) continue

            const customer = await CustomerRegModel.findOne({_id: job.customerId})
            if (!customer) continue

            const contractor = await ContractorModel.findOne({_id: job.contractorId})
            if (!contractor) continue

         
            const obj = {
                Payout,
                job,
                customer,
                contractor,
            }

            completedPayout.push(obj)
        }

      res.json({  
        totalCompletedPayout,
        completedPayout
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}


//get single Payout detail /////////////
export const AdminGetSinglePayoutDetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
      payoutId
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        const payout = await PayoutModel.findOne({_id: payoutId})
        if (!payout) {
            return res
            .status(401)
            .json({ message: "incorrect payout Id" });
        }

        const job = await JobModel.findOne({_id: payout.jobId})
        if (!job) return

        const customer = await CustomerRegModel.findOne({_id: job.customerId})
        if (!customer) return

        const contractor = await ContractorModel.findOne({_id: job.contractorId})
        if (!contractor) return

      

        const obj = {
            payout,
            job,
            customer,
            contractor,
        }


      res.json({  
        obj
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}



//admin pay contractor /////////////
export const AdminPayContractorController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
      payoutId
      } = req.body;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        const payout = await PayoutModel.findOne({_id: payoutId, status: "pending"})
        if (!payout) {
            return res
            .status(401)
            .json({ message: "incorrect payout Id or not pending payout" });
        }

        payout.status = "completed";
        await payout.save();

        res.json({  
            message: "payment succefully"
        });
        
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}