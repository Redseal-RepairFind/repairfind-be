import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { NotificationService } from "../../../services/notifications/index";
import { TRIP_STATUS, TripModel } from "../../../database/common/trip.model";


export const confirmTrip = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const { tripId } = req.params;
      const { verificationCode } = req.body;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
 
        const customerId = req.customer.id

        const trip = await TripModel.findOne({_id: tripId})
        if (!trip) {
            return res.status(403).json({ success: false, message: 'trip not found' });
        }

        if (trip.status != TRIP_STATUS.ARRIVED) {
            return res.status(403).json({ success: false, message: 'contractor has not arrived yet' });
        }
      
        if (trip.verified) {
            return res.status(403).json({ success: false, message: 'site already visited' });
        }

        if (trip.verificationCode !== verificationCode) {
            return res.status(403).json({ success: false, message: 'incorrect verification code' });
        }

        trip.status = TRIP_STATUS.CONFIRMED
        trip.verified = true
        await trip.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: trip.contractor.toString(),
                userType: 'contractors',
                title: 'trip',
                heading: {},
                type: 'tripDayComfirmed',
                message: 'Customer confirmed your arrival.',
                payload: {tripId: tripId, verificationCode}
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
                user: trip.customer,
                userType: 'customers',
                title: 'trip',
                heading: {},
                type: 'tripDayComfirmed',
                message: "You successfully confirmed the contractor's arrival.",
                payload: {tripId: tripId, verificationCode}
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
            data: trip
        });
      
    } catch (err: any) {
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}

export const CustomerTripController = {
    confirmTrip
};
