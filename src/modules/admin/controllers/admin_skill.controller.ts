import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import SkillRegrModel from "../../../database/admin/models/skill.model";
import { InternalServerError } from "../../../utils/custom.errors";


export const AddNew = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        let { name } = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
        }
        const checkSkill = await SkillRegrModel.findOne({ name })

        if (checkSkill) {
            return res.status(401).json({ success: false, message: "skill already exist" });
        }

        const newSkill = new SkillRegrModel({ name });
        await newSkill.save()

        return res.json({ success: true, message: "skill successfully added." });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred adding skill", err))
    }
}


export const AddMultipleSkills = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        let { skills } = req.body;

        if(!Array.isArray(skills) && skills.length <= 0) {
            return res.json({ success: false, message: "Array is empty" });
        }

        skills.forEach(async (skill: string) => {
            await SkillRegrModel.findOneAndUpdate({name: skill},{name: skill}, {new: true, upsert: true})
        });

        return res.json({ success: true, message: "skill successfully added." });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred adding skill", err))
    }
}

export const GetSkills = async (
    req: any,
    res: Response,
    next: NextFunction,
) => {
    try {
        let {

        } = req.body;

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const skills = await SkillRegrModel.find()

        res.json({ success: true, message: "Skills retrieved successfully", data: skills });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred adding skill", err))
    }
}


export const AdminSkillController = {
    AddNew,
    GetSkills,
    AddMultipleSkills
}