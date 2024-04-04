import { Request, Response } from "express";
import { TripDayModel, TripDayStatus } from "../../../database/common/trip_day.model";
import { validationResult } from "express-validator";
import { JobModel, JobStatus, JobType } from "../../../database/common/job.model";
import { generateOTP } from "../../../utils/otpGenerator";
import { NotificationService } from "../../../services/notifications/index";

//contractor start trip /////////////
export const contractorStartTripController = async (
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
        const jobRequest = await JobModel.findOne({ _id: jobId, contractor: contractorId, status: JobStatus.ACCEPTED });

        // Check if the job request exists
        if (!jobRequest) {
            return res.status(403).json({ success: false, message: 'Job request not found' });
        }

        //check if site already visited
        const checkSiteVisited = await TripDayModel.findOne({job: jobId, verified: true})
        if (checkSiteVisited) {
            return res.status(403).json({ success: false, message: 'site already visited' });
        }

        const newTripDay = new TripDayModel({
            customer: jobRequest.customer,
            contractor: contractorId,
            job: jobId,
            status: TripDayStatus.STARTED
        })

        const saveNewTripDay = await newTripDay.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractor',
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
                userType: 'customer',
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


//contractor arrived site /////////////
export const contractorArrivedSiteController = async (
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

        const tripDay = await TripDayModel.findOne({_id: tripDayId})
        if (!tripDay) {
            return res.status(403).json({ success: false, message: 'trip not found' });
        }

        if (tripDay.status != TripDayStatus.STARTED) {
            return res.status(403).json({ success: false, message: 'trip not started yet' });
        }
      
        if (tripDay.verified) {
            return res.status(403).json({ success: false, message: 'site already visited' });
        }

        const verificationCode = generateOTP()

        tripDay.verificationCode = parseInt(verificationCode)
        tripDay.status = TripDayStatus.ARRIVED
        await tripDay.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractor',
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
                userType: 'customer',
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

export const ContractorTripDayController = {
    contractorStartTripController,
    contractorArrivedSiteController
};