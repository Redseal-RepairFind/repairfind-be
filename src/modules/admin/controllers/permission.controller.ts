import { validationResult } from "express-validator";
import { Request, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import PermissionModel from "../../../database/admin/models/permission.model";

//super create permision /////////////
export const PermissionCreationController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
       name
      } = req.body;
        // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const checkAdmin = await AdminRegModel.findOne({_id: adminId});
  
      if (!checkAdmin?.superAdmin) {
        return res
        .status(401)
        .json({ message: "super admin role" });
      }

      const checkPermission = await PermissionModel.findOne({name})
      if (checkPermission) {
        return res
        .status(401)
        .json({ message: "permission already created" });
      }

      const newPermission = new PermissionModel({name})
      await newPermission.save()
   
      res.json({
        message: "permission created Successfully"
      });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//super get  permision /////////////
export const GetPermissionController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
       
      } = req.body;
        // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const checkAdmin = await AdminRegModel.findOne({_id: adminId});
  
      if (!checkAdmin?.superAdmin) {
        return res
        .status(401)
        .json({ message: "super admin role" });
      }

      const permissions = await PermissionModel.find()
      
      res.json({
        permissions
      });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}

//super edit  permision /////////////
export const EditPermissionController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
       name,
       permissionId
      } = req.body;
        // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const admin =  req.admin;
      const adminId = admin.id
  
      const checkAdmin = await AdminRegModel.findOne({_id: adminId});
  
      if (!checkAdmin?.superAdmin) {
        return res
        .status(401)
        .json({ message: "super admin role" });
      }

      const permission = await PermissionModel.findOne({_id: permissionId})
      if (!permission) {
        return res
        .status(401)
        .json({ message: "incorrect permission ID" });
      }

      permission.name = name
      await permission.save()
      
      res.json({
        message: "permission updated successfully"
      });
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


export const Permission = {
    PermissionCreationController,
    GetPermissionController,
    EditPermissionController
}