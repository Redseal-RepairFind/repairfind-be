import { Request, Response } from "express";
import CustomerDeviceModel from "../../../database/customer/models/customer_devices.model";
import ContractorDeviceModel from "../../../database/contractor/models/contractor_devices.model";
import BlacklistedToken from "../../../database/common/blacklisted_tokens.schema";
import { validationResult } from "express-validator";


export const clearAuthSession = async (
    req: Request,
    res: Response,
) => {

    try {

         const errors = validationResult(req);
         if (!errors.isEmpty()) {
             return res.status(400).json({success:false, errors: errors.array() });
         }

        const { deviceToken, accessToken, userId, userType } = req.body

        if(userType == 'customers'){
            await CustomerDeviceModel.deleteMany({
                $or: [
                    { expoToken: deviceToken }, 
                    { deviceToken: deviceToken }
                ]
            })
        }

        if(userType == 'contractors'){
            await ContractorDeviceModel.deleteMany({
                $or: [
                  { expoToken: deviceToken }, 
                  { deviceToken: deviceToken }
                ]
              });
        }

        BlacklistedToken.create({token: accessToken})
       
    
        res.json({
            status: true,
            message: 'Session cleared',
        });
    } catch (error: any) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }

}






export const SessionController = {
    clearAuthSession,
}

