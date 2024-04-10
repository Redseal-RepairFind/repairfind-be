import { Request, Response } from "express";
import { TripDayModel, TripDayStatus } from "../../../database/common/trip_day.model";
import { validationResult } from "express-validator";
import { NotificationService } from "../../../services/notifications/index";

//customer comfirm contractor arriver /////////////
export const customerverifiedContractorSiteArrivalController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const { tripDayId } = req.params;
      const { verificationCode } = req.body;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
 
        const customerId = req.customer.id

        const tripDay = await TripDayModel.findOne({_id: tripDayId})
        if (!tripDay) {
            return res.status(403).json({ success: false, message: 'trip not found' });
        }

        if (tripDay.status != TripDayStatus.ARRIVED) {
            return res.status(403).json({ success: false, message: 'contractor has not arrived yet' });
        }
      
        if (tripDay.verified) {
            return res.status(403).json({ success: false, message: 'site already visited' });
        }

        if (tripDay.verificationCode !== verificationCode) {
            return res.status(403).json({ success: false, message: 'incorrect verification code' });
        }

        tripDay.status = TripDayStatus.COMFIRMED
        tripDay.verified = true
        await tripDay.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: JSON.stringify(tripDay.contractor),
                userType: 'contractors',
                title: 'tripDay',
                heading: {},
                type: 'tripDayComfirmed',
                message: 'Customer confirmed your arrival.',
                payload: {tripId: tripDayId, verificationCode}
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )


        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: JSON.stringify(tripDay.customer),
                userType: 'customers',
                title: 'tripDay',
                heading: {},
                type: 'tripDayComfirmed',
                message: "You successfully confirmed the contractor's arrival.",
                payload: {tripId: tripDayId, verificationCode}
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        res.json({  
            success: true,
            message: "contractor arrival successfully comfirmed",
            data: tripDay
        });
      
    } catch (err: any) {
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}

export const CustomerTripDayController = {
    customerverifiedContractorSiteArrivalController
};
