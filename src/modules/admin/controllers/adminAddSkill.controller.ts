import { validationResult } from "express-validator";
import { Request, Response } from "express";
import SkillRegrModel from "../../../database/admin/models/skill.model";


//admin add new skill to database/////////////
export const AdminAddNewSkillController = async (
    req: any,
    res: Response,
  ) => {
    try {
        let {  
        name
        } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const admin =  req.admin;
        const adminId = admin.id

        const checkSkill = await SkillRegrModel.findOne({name})

        if (checkSkill) {
            return res
            .status(401)
            .json({ message: "skill already exist" });
        }

        const newSkill = new SkillRegrModel({name});

        await newSkill.save()

        res.json({  
            message: "skill successfully added." 
        });
        
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}

//admin get all skill/////////////
export const AdminGetSkillController = async (
    req: any,
    res: Response,
  ) => {
    try {
        let {  
        
        } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const admin =  req.admin;
        const adminId = admin.id

        const skills = await SkillRegrModel.find()

        res.json({  
            skills
        });
        
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}