import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import PermissionModel from "../../../database/admin/models/permission.model";


export const addSinglePermission = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
       name
      } = req.body;
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({success: false, errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const checkAdmin = await AdminRegModel.findOne({_id: adminId});
  
      if (!checkAdmin?.superAdmin) {
        return res
        .status(401)
        .json({success: false,  message: "super admin role" });
      }

      const checkPermission = await PermissionModel.findOne({name})
      if (checkPermission) {
        return res
        .status(401)
        .json({success: false, message: "permission already created" });
      }

      const newPermission = new PermissionModel({name})
      await newPermission.save()
   
      res.json({success: true, message: "permission created Successfully" });
  
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  
}

export const addBulkPermission = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
       permissions
      } = req.body;
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({success: false, errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const checkAdmin = await AdminRegModel.findOne({_id: adminId});
  
      if (!checkAdmin?.superAdmin) {
        return res
        .status(401)
        .json({success: false,  message: "super admin role" });
      }
      permissions.forEach(async (permission: any) => {
        let existing = await PermissionModel.findOne({ name: permission });   
        if(existing)return 
         await PermissionModel.findOneAndUpdate({ name: permission }, {name: permission}, { upsert: true, new: true, setDefaultsOnInsert: true });   
      });


      res.json({success: true, message: "permissions added Successfully"});
  
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  
}


export const getPermissions = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
       
      } = req.body;
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({success: false, errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const checkAdmin = await AdminRegModel.findOne({_id: adminId});
  
      if (!checkAdmin?.superAdmin) {
        return res
        .status(401)
        .json({success: false, message: "You do not have permission to perform this action" });
      }

      const permissions = await PermissionModel.find()
      
      return res.json({ success: true, data: permissions});
  
    } catch (err: any) {
      res.status(500).json({success: false, message: err.message });
    }
  
}

export const updatePermission = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {name} = req.body;
      const {permissionId} = req.params;
        // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const checkAdmin = await AdminRegModel.findOne({_id: adminId});
  
      if (!checkAdmin?.superAdmin) {
        return res
        .status(401)
        .json({ success: false, message: "super admin role" });
      }

      const permission = await PermissionModel.findOne({_id: permissionId})
      if (!permission) {
        return res
        .status(401)
        .json({ success: false, message: "incorrect permission ID" });
      }

      permission.name = name
      await permission.save()
      
      res.json({
        success: true,
        message: "permission updated successfully"
      });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({success: false, message: err.message });
    }
  
}


export const AdminPermissionController = {
    addSinglePermission,
    getPermissions,
    updatePermission,
    addBulkPermission
}