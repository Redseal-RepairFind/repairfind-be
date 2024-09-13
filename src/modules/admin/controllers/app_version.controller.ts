import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { InternalServerError } from "../../../utils/custom.errors";
import { AppVersionModel } from "../../../database/common/app_versions.model";

export const addAppVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { version, changelogs, type, status, isCurrent } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
        }

        if (isCurrent) {
            await AppVersionModel.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
        }

        const newAppVersion = await AppVersionModel.findOneAndUpdate(
            { version, type },
            { version, changelogs, type, status, isCurrent },
            { upsert: true, new: true }
        );

        return res.json({ success: true, message: "App version successfully added or updated.", data: { newAppVersion } });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while adding or updating app version", err));
    }
};



export const getAppVersions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const appVersions = await AppVersionModel.find();

        res.json({ success: true, message: "App versions retrieved successfully", data: appVersions });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while retrieving app versions", err));
    }
};

export const getAppVersionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const appVersion = await AppVersionModel.findById(id);

        if (!appVersion) {
            return res.status(404).json({ success: false, message: "App version not found" });
        }

        res.json({ success: true, message: "App version retrieved successfully", data: appVersion });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while retrieving app version", err));
    }
};

export const updateAppVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { version, changelogs, type, status, isCurrent } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (isCurrent) {
            await AppVersionModel.updateMany({ isCurrent: true }, { $set: { isCurrent: false } });
        }

        const updatedAppVersion = await AppVersionModel.findByIdAndUpdate(
            id,
            { version, changelogs, type, status, isCurrent },
            { new: true }
        );

        if (!updatedAppVersion) {
            return res.status(404).json({ success: false, message: "App version not found" });
        }

        res.json({ success: true, message: "App version updated successfully", data: updatedAppVersion });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while updating app version", err));
    }
};

export const deleteAppVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const deletedAppVersion = await AppVersionModel.findByIdAndDelete(id);

        if (!deletedAppVersion) {
            return res.status(404).json({ success: false, message: "App version not found" });
        }

        res.json({ success: true, message: "App version deleted successfully" });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while deleting app version", err));
    }
};

export const AppVersionController = {
    addAppVersion,
    getAppVersions,
    getAppVersionById,
    updateAppVersion,
    deleteAppVersion,
};
