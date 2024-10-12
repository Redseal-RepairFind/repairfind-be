import PermissionModel from "../admin/models/permission.model";
import { PROMOTION_STATUS, PROMOTION_TARGET, PROMOTION_VALUE_TYPE, PromotionModel } from "../common/promotion.schema";

export const PromotionSeeder = async (options: Object) => {
    try {
        promotions.forEach(async (promotion) => {
            const existingPromotion = await PromotionModel.findOne({ code: promotion.code });
            if (existingPromotion) return
            await PromotionModel.findOneAndUpdate({ name: promotion.name }, promotion, { upsert: true });
        });
    } catch (error) {
        console.log("Error seeding promotions", error)
    }
};


const promotions = [
    {
        "name": "Referral Bonus",
        "code": "REFERRAL",
        "startDate": "2024-06-01",
        "target": PROMOTION_TARGET.BOTH,
        "criteria": "Referral bonus of $25",
        "value": 25,
        "valueType": PROMOTION_VALUE_TYPE.FIXED,
        "description": "Get $25 cash bonus off when you refer",
        "status": PROMOTION_STATUS.ACTIVE,
        "contractorLimit": 150,
        "customerLimit": 100
    },
    {
        "name": "Early Bird Contractor",
        "code": "EARLYBIRDCONTRACTOR",
        "startDate": "2024-10-01",
        "target": PROMOTION_TARGET.CONTRACTORS,
        "criteria": "First 200 contractors",
        "value": 50,
        "valueType": PROMOTION_VALUE_TYPE.PERCENTAGE,
        "description": "Get 50% off on Repairfind service fee on your quotations",
        "status": PROMOTION_STATUS.ACTIVE,
        "customerLimit": 150,
        "contractorLimit": 100,
    }
    
]




