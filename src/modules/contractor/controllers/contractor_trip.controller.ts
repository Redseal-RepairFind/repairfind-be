import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { generateOTP } from "../../../utils/otpGenerator";
import { NotificationService } from "../../../services/notifications/index";
import { TRIP_STATUS, TripModel } from "../../../database/common/trip.model";

export const startTrip = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const { jobId } = req.params;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
 
        const contractorId = req.contractor.id

        // Find the job request by ID
        const jobRequest = await JobModel.findOne({ _id: jobId, contractor: contractorId, status: JOB_STATUS.ACCEPTED });

        // Check if the job request exists
        if (!jobRequest) {
            return res.status(403).json({ success: false, message: 'Job request not found' });
        }

        //check if site already visited
        const checkSiteVisited = await TripModel.findOne({job: jobId, verified: true})
        if (checkSiteVisited) {
            return res.status(403).json({ success: false, message: 'site already visited' });
        }

        const newTripDay = new TripModel({
            customer: jobRequest.customer,
            contractor: contractorId,
            job: jobId,
            status: TRIP_STATUS.STARTED
        })

        const saveNewTripDay = await newTripDay.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractors',
                title: 'tripDay',
                heading: {},
                type: 'tripDayStart',
                message: 'trip successfully started',
                payload: {tripId: saveNewTripDay._id}
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
                user: JSON.stringify(jobRequest.customer),
                userType: 'customers',
                title: 'tripDay',
                heading: {},
                type: 'tripDayStart',
                message: 'Contractor starts trip to your site.',
                payload: {tripId: saveNewTripDay._id}
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

    

        res.json({  
            success: true,
            message: "trip successfully started",
            data: {jobLocation: jobRequest.location, trip: saveNewTripDay}
        });
      
    } catch (err: any) {
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}


export const confirmArrival = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const { tripDayId } = req.params;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
 
        const contractorId = req.contractor.id

        const tripDay = await TripModel.findOne({_id: tripDayId})
        if (!tripDay) {
            return res.status(403).json({ success: false, message: 'trip not found' });
        }

        if (tripDay.status != TRIP_STATUS.STARTED) {
            return res.status(403).json({ success: false, message: 'trip not started yet' });
        }
      
        if (tripDay.verified) {
            return res.status(403).json({ success: false, message: 'site already visited' });
        }

        const verificationCode = generateOTP()

        tripDay.verificationCode = parseInt(verificationCode)
        tripDay.status = TRIP_STATUS.ARRIVED
        await tripDay.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractors',
                title: 'tripDay',
                heading: {},
                type: 'tripDayarrived',
                message: 'you successfully arrrived at site, wait for comfirmation from customer.',
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
                type: 'tripDayarrived',
                message: 'Contractor is at your site.',
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
            message: "you successfully arrrived at site, wait for comfirmation from customer",
            data: verificationCode
        });
      
    } catch (err: any) {
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}

export const ContractorTripController = {
    startTrip,
    confirmArrival
};