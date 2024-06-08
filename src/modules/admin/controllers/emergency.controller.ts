import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { JobEmergencyModel, EmergencyStatus } from "../../../database/common/job_emergency.model";

//get new emergency /////////////
export const AdminGeNewEmergencyJobController = async (
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

      const jobEmergencies = await JobEmergencyModel.find({status: EmergencyStatus.PENDING})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(['customer', 'contractor']);

      const totalJobEmergency = await JobEmergencyModel.countDocuments()

      res.json({ 
        currentPage: page,
        totalPages: Math.ceil(totalJobEmergency / limit),
        jobEmergencies,
        
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}


//get single emergency /////////////
export const AdminGetSingleEmergencyJobController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
        const { emergencyId } = req.params;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const jobEmergency = await JobEmergencyModel.findOne({_id: emergencyId})
      .populate(['customer', 'contractor']);

      if (!jobEmergency) {
        return res
          .status(401)
          .json({ message: "invalid emergencyId" });
      }

      res.json({ 
        jobEmergency,
        
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}

//admin accept emergency /////////////
export const AdminAcceptEmergencyJobController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
        const { emergencyId } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id

      const jobEmergency = await JobEmergencyModel.findOne({_id: emergencyId})
      .populate(['customer', 'contractor']);

      if (!jobEmergency) {
        return res
          .status(401)
          .json({ message: "invalid emergencyId" });
      }

      jobEmergency.status = EmergencyStatus.IN_PROGRESS
      jobEmergency.acceptedBy = adminId
      await jobEmergency.save()
      
      res.json({ 
        message: "emergency accepted successfully"    
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}



//admin resolve emergency /////////////
export const AdminResolvedEmergencyJobController = async (
  req: any,
  res: Response,
) => {

  try {
      const { 
        emergencyId,
        resolvedWay
      } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin =  req.admin;
    const adminId = admin.id

    const jobEmergency = await JobEmergencyModel.findOne({_id: emergencyId})

    if (!jobEmergency) {
      return res
        .status(401)
        .json({ message: "invalid emergencyId" });
    }

    if (jobEmergency.status != EmergencyStatus.IN_PROGRESS) {
      return res
        .status(401)
        .json({ message: "emergency not yet accepted" });
    }

    if (jobEmergency.acceptedBy != adminId) {
      return res
        .status(401)
        .json({ message: "you do not accepted this emergency" });
    }

    jobEmergency.status = EmergencyStatus.RESOLVED
    jobEmergency.resolvedWay = resolvedWay
    await jobEmergency.save()
    
    res.json({ 
      message: "emergency resolved successfully"    
    });
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get acctive emergency by particular admin /////////////
export const AdminGetActiveEmergencyJobController = async (
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

      const jobEmergencies = await JobEmergencyModel.find({acceptedBy: adminId, status: EmergencyStatus.IN_PROGRESS})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(['customer', 'contractor']);

      const totalJobEmergency = await JobEmergencyModel.countDocuments()

      res.json({ 
        currentPage: page,
        totalPages: Math.ceil(totalJobEmergency / limit),
        jobEmergencies,
        
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}


//get resolve emergency by particular admin /////////////
export const AdminGetResolveEmergencyJobController = async (
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

      const jobEmergencies = await JobEmergencyModel.find({acceptedBy: adminId, status: EmergencyStatus.RESOLVED})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(['customer', 'contractor']);

      const totalJobEmergency = await JobEmergencyModel.countDocuments()

      res.json({ 
        currentPage: page,
        totalPages: Math.ceil(totalJobEmergency / limit),
        jobEmergencies,
        
      });
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
}

export const ermergency = {
    AdminGeNewEmergencyJobController,
    AdminGetSingleEmergencyJobController,
    AdminAcceptEmergencyJobController,
    AdminResolvedEmergencyJobController,
    AdminGetActiveEmergencyJobController,
    AdminGetResolveEmergencyJobController
}