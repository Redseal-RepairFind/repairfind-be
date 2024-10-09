import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { InternalServerError } from "../../../utils/custom.errors";
import { PromotionModel } from "../../../database/common/promotion.schema";
import { applyAPIFeature } from "../../../utils/api.feature";



// retrieve promotions
export const getPromotions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {data, error} = await  applyAPIFeature(PromotionModel.find({}), req.query);
        return res.json({ success: true, message: "Promotions retrieved successfully.", data: data });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while retrieving promotions", err));
    }
};

// Delete a promotion
export const getSinglePromotion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const promotion = await PromotionModel.findById(id);

        if (!promotion) {
            return res.status(404).json({ success: false, message: "Promotion not found." });
        }

        //TODO: Prevent deletion if promotion has been used
        return res.json({ success: true, message: "Promotion  retrieved.", data: promotion });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while retrieving promotion", err));
    }
};


// Add a new promotion
export const addPromotion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, code, startDate, endDate, target, criteria, value, valueType, description, status } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
        }

        const newPromotion = new PromotionModel({
            name,
            code,
            startDate,
            endDate,
            target,
            criteria,
            value,
            valueType,
            description,
            status,
        });

        await newPromotion.save();

        return res.json({ success: true, message: "Promotion successfully added.", data: newPromotion });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while adding promotion", err));
    }
};


// Update an existing promotion
export const updatePromotion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, code, startDate, endDate, target, criteria, value, description, status } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
        }

        const updatedPromotion = await PromotionModel.findByIdAndUpdate(
            id,
            { name, code, startDate, endDate, target, criteria, value, description, status },
            { new: true }
        );

        if (!updatedPromotion) {
            return res.status(404).json({ success: false, message: "Promotion not found." });
        }

        return res.json({ success: true, message: "Promotion successfully updated.", data: updatedPromotion });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while updating promotion", err));
    }
};

// Delete a promotion
export const deletePromotion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const deletedPromotion = await PromotionModel.findByIdAndDelete(id);

        if (!deletedPromotion) {
            return res.status(404).json({ success: false, message: "Promotion not found." });
        }

        //TODO: Prevent deletion if promotion has been used
        return res.json({ success: true, message: "Promotion successfully deleted.", data: deletedPromotion });

    } catch (err: any) {
        return next(new InternalServerError("Error occurred while deleting promotion", err));
    }
};






export const PromotionController = {
    addPromotion,
    updatePromotion,
    deletePromotion,
    getPromotions,
    getSinglePromotion,
};