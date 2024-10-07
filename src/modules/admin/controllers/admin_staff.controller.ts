import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { NextFunction, Response } from "express";
import AdminRegModel from "../../../database/admin/models/admin.model";
import { generateOTP } from "../../../utils/otpGenerator";
import { AdminStatus } from "../../../database/admin/interface/admin.interface";
import PermissionModel from "../../../database/admin/models/permission.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { applyAPIFeature } from "../../../utils/api.feature";
import { EmailService } from "../../../services";
import { GenericEmailTemplate } from "../../../templates/common/generic_email";




export const getAdminStaffs = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        const {

        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const admin = req.admin;
        const adminId = admin.id

        const checkAdmin = await AdminRegModel.findOne({ _id: adminId });

        if (!checkAdmin?.superAdmin) {
            return res
                .status(401)
                .json({ success: false, message: "Only super admin can perform this action" });
        }

        const { data, error } = await applyAPIFeature(AdminRegModel.find()
                                        .select('-password')
                                        .populate({path: 'permissions', model: 'permissions', select: '_id name'}), req.query)

        return res.json({ success: true, data });

    } catch (error: any) {
        next(new InternalServerError("An error occurred", error))
    }

}



export const changeStaffStatus = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        const {
            staffId,
            status
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const admin = req.admin;
        const adminId = admin.id

        const checkAdmin = await AdminRegModel.findOne({ _id: adminId });

        if (!checkAdmin?.superAdmin) {
            return res
                .status(401)
                .json({ message: "super admin role" });
        }

        const subAdmin = await AdminRegModel.findOne({ _id: staffId })

        if (!subAdmin) {
            return res
                .status(401)
                .json({ message: "staff does not exist" });
        }

        subAdmin.status = status;
        await subAdmin.save()

        res.json({
            message: `staff status change to ${status}`,
        });


    } catch (error: any) {
        next(new InternalServerError("An error occurred", error))
    }

}



export const addStaff = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        const {
            email,
            password = generateOTP(),
            firstName,
            lastName,
            phoneNumber,
            permisions
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const admin = req.admin;
        const adminId = admin.id

        const checkAdmin = await AdminRegModel.findOne({ _id: adminId });

        if (!checkAdmin?.superAdmin) {
            return res
                .status(401)
                .json({success: false, message: "You do not have permission to perform this action" });
        }

        // try find user with the same email
        const adminEmailExists = await AdminRegModel.findOne({ email });

        let superAdmin = false;
        let validation = true;

        // check if user exists
        if (adminEmailExists) {
            return res
                .status(401)
                .json({success: false, message: "Staff with same email already exists" });
        }

        //validate permission
        // for (let i = 0; i < permisions.length; i++) {
        //     const permision = permisions[i];
        //     const checkPermission = await PermissionModel.findOne({ _id: permision })

        //     if (!checkPermission) {
        //         return res
        //             .status(401)
        //             .json({ success: false,  message: "Invalid permission assigned" });
        //     }
        // }

        const otp = generateOTP()

        const createdTime = new Date();

        const emailOtp = {
            otp,
            createdTime,
            verified: true
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        let emailSubject = 'New Staff Account'
        let emailContent = `
                <p style="color: #333333;">A staff account has been provisioned with your email on Repairfind</p>
                <div style="background: whitesmoke;padding: 10px; border-radius: 10px;">
                <p style="border-bottom: 1px solid lightgray; padding-bottom: 5px;"><strong>Temporary Password:</strong> ${password}</p>
                </div>
                <p style="color: #333333;">Do well to login and change your password </p>
                `
        let html = GenericEmailTemplate({ name: firstName, subject: emailSubject, content: emailContent })
        EmailService.send(email, emailSubject, html)


        const newStaff = new AdminRegModel({
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber,
            superAdmin: superAdmin,
            permissions: permisions,
            status: AdminStatus.ACTIVE,
            password: hashedPassword,
            hasWeakPassword: true,
            validation: validation,
            emailOtp
        });

        let staffSaved = await newStaff.save();

        res.json({success: true,  message: "Admin Staff added successfully"});

    } catch (error: any) {
        next(new InternalServerError("An error occurred", error))
    }

}


export const addPermissionToStaff = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        const {
            staffId,
            permissions
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const admin = req.admin;
        const adminId = admin.id

        const checkAdmin = await AdminRegModel.findOne({ _id: adminId });

        if (!checkAdmin?.superAdmin) {
            return res
                .status(401)
                .json({success: false, message: "You do not have permission to perform this action" });
        }

        const subAdmin = await AdminRegModel.findOne({ _id: staffId })

        if (!subAdmin) {
            return res
                .status(404)
                .json({ message: "staff does not exist" });
        }

        const validPermissions = await PermissionModel.find({ _id:{ $in: permissions } });

        if (validPermissions.length === 0) {
            subAdmin.permissions = [];
            await subAdmin.save();
            return res
                .json({message: "All permissions are invalid. Staff's permissions cleared.", addedPermissions: [], invalidPermissions: permissions  });
        }

        const validPermissionIds = validPermissions.map((permission)=> permission._id.toString());
        const invalidPermissions = permissions.filter((permission: string)=> !validPermissionIds.includes(permission));

        const existingPermissions = subAdmin.permissions.map((permission)=> permission.toString());
        const newPermissions = Array.from(new Set([...existingPermissions, ...validPermissionIds]));

        // Check if the permission have changed
        if (existingPermissions.length === newPermissions.length) {
            return res.json({
                success: true,
                message: "No new persmissions added.",
                addedPermissions: [],
                invalidPermissions
            });
        }

        subAdmin.permissions = newPermissions;
        await subAdmin.save()

        res.json({
            message: `Permissions added successfully`,
            addedPermissions: validPermissions,
            invalidPermissions
        });


    } catch (error: any) {
        next(new InternalServerError("An error occurred", error))
    }

}


export const removePermissionFromStaff = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {
        const {
            staffId,
            permision
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array() });
        }

        const admin = req.admin;
        const adminId = admin.id

        const checkAdmin = await AdminRegModel.findOne({ _id: adminId });

        if (!checkAdmin?.superAdmin) {
            return res
                .status(401)
                .json({success: false, message: "You do not have permission to perform this action" });
        }

        const subAdmin = await AdminRegModel.findOne({ _id: staffId })

        if (!subAdmin) {
            return res
                .status(401)
                .json({success: false, message: "Staff does not exist" });
        }

        const checkPermission = await PermissionModel.findOne({ _id: permision })

        if (!checkPermission) {
            return res
                .status(401)
                .json({success: false, message: "Invalid permission" });
        }

        const remainPermission = subAdmin.permissions.filter((availabePermission) => {
            return availabePermission != permision
        })

        subAdmin.permissions = remainPermission
        await subAdmin.save()

        res.json({success: true, message: `permission removed successfully` });


    } catch (error: any) {
        next(new InternalServerError("An error occurred", error))
    }

}





export const AdminStaffController = {
    getAdminStaffs,
    changeStaffStatus,
    addStaff,
    addPermissionToStaff,
    removePermissionFromStaff
}