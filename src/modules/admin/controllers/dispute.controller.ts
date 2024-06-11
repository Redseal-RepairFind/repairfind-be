import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { JobDisputeModel, JOB_DISPUTE_STATUS } from "../../../database/common/job_dispute.model";

//get job dispute by status /////////////
export const AdminJobDisputeByStatusController = async (
    req: any,
    res: Response,
  ) => {
    try {
      let {  
       page,
       limit,
       status
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

      const jobDisputes = await JobDisputeModel.find({status: status})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(['customer', 'contractor', 'job']);

      const totalJobDispute = await JobDisputeModel.countDocuments({status: status})

      res.json({ 
        currentPage: page,
        totalPages: Math.ceil(totalJobDispute / limit),
        jobDisputes,
        
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}

//get single dispute /////////////
export const AdminGetSingleJobDisputeController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
        const { disputeId } = req.params;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const jobDispute = await JobDisputeModel.findOne({_id: disputeId})
      .populate(['customer', 'contractor', 'job']);

      if (!jobDispute) {
        return res
          .status(401)
          .json({ message: "invalid disputeId" });
      }

      res.json({ 
        jobDispute,
        
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}

//admin accept dispute /////////////
export const AdminAcceptJobDisputeController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
        const { disputeId } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const jobDispute = await JobDisputeModel.findOne({_id: disputeId})
      .populate(['customer', 'contractor']);

      if (!jobDispute) {
        return res
          .status(401)
          .json({ message: "Invalid disputeId" });
      }

      if (jobDispute.status !== JOB_DISPUTE_STATUS.OPEN) {
        return res
          .status(401)
          .json({ message: "Job emergency not open" });
      }

      jobDispute.status = JOB_DISPUTE_STATUS.PENDING_MEDIATION
      jobDispute.acceptedBy = adminId
      await jobDispute.save()
      
      res.json({ 
        message: "Dispute accepted successfully"    
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}

//get  dispute by particular admin /////////////
export const AdminGetJobDisputForAdminController = async (
    req: any,
    res: Response,
  ) => {
    try {
      let {  
       page,
       limit,
       status
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

      const jobDisputes = await JobDisputeModel.find({acceptedBy: adminId, status: status})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(['customer', 'contractor', 'job']);

      const totalJobDisputes = await JobDisputeModel.countDocuments({acceptedBy: adminId, status: status})

      res.json({ 
        currentPage: page,
        totalPages: Math.ceil(totalJobDisputes / limit),
        jobDisputes,
        
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}

//admin settle Dispute /////////////
export const AdminSettleJobDisputeController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
        const { 
          disputeId,
          resolvedWay
        } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const jobDispute = await JobDisputeModel.findOne({_id: disputeId})
  
      if (!jobDispute) {
        return res
          .status(401)
          .json({ message: "Invalid disputeId" });
      }
  
      if (jobDispute.status != JOB_DISPUTE_STATUS.PENDING_MEDIATION) {
        return res
          .status(401)
          .json({ message: "Dispute not yet accepted" });
      }
  
      if (jobDispute.acceptedBy != adminId) {
        return res
          .status(401)
          .json({ message: "you do not accepted this dispute" });
      }
  
      jobDispute.status = JOB_DISPUTE_STATUS.CLOSED
      jobDispute.resolvedWay = resolvedWay
      await jobDispute.save()
      
      res.json({ 
        message: "Dispute resolved successfully"    
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  }

export const dispute = {
    AdminJobDisputeByStatusController,
    AdminGetSingleJobDisputeController,
    AdminAcceptJobDisputeController,
    AdminGetJobDisputForAdminController, 
    AdminSettleJobDisputeController
}