import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { JobModel, JOB_STATUS, JobType } from "../../../database/common/job.model";
import { generateOTP } from "../../../utils/otpGenerator";
import { NotificationService } from "../../../services/notifications/index";
import { TRIP_STATUS, TripModel } from "../../../database/common/trip.model";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";


export const startTrip = async (
    req: any,
    res: Response,
) => {

    try {
        const { jobId } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contractorId = req.contractor.id

        // Find the job request by ID
        const job = await JobModel.findOne({ _id: jobId, contractor: contractorId, status: JOB_STATUS.BOOKED });

        // Check if the job request exists
        if (!job) {
            return res.status(403).json({ success: false, message: 'Job request not found' });
        }

        // Check if an active trip already exists for the specified job
        const activeTrip = await TripModel.findOne({ job: jobId, status: TRIP_STATUS.STARTED });

        if (activeTrip) {
            return res.status(400).json({ success: false, message: 'An active trip already exists for this job' });
        }

        const trip = await TripModel.create({
            customer: job.customer,
            contractor: contractorId,
            job: jobId,
            status: TRIP_STATUS.STARTED,
            type: job.schedule.type
        })

        // send notification to contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractors',
                title: 'trip',
                heading: {},
                type: 'tripDayStart',
                message: 'trip successfully started',
                payload: { tripId: trip._id }
            },
            {
                push: true,
                socket: true,
                database: true
            }
        )

        // send notification to customer
        NotificationService.sendNotification(
            {
                user: job.customer.toString(),
                userType: 'customers',
                title: 'trip',
                heading: {},
                type: 'tripDayStart',
                message: 'Contractor starts trip to your site.',
                payload: { tripId: trip._id }
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
            data: { jobLocation: job.location, trip: trip }
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
        const { tripId } = req.params;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const contractorId = req.contractor.id
        const contractor = await ContractorModel.findById(contractorId)
        if (!contractor) {
            return res.status(404).json({ success: false, message: 'Contractor not found' });
        }

        const trip = await TripModel.findOne({ _id: tripId })
        if (!trip) {
            return res.status(403).json({ success: false, message: 'trip not found' });
        }

        if (!(trip.status === TRIP_STATUS.STARTED || trip.status === TRIP_STATUS.ARRIVED)) {
            return res.status(403).json({ success: false, message: 'Trip not started yet' });
        }

        if (trip.verified) {
            return res.status(403).json({ success: false, message: 'Trio already visited' });
        }

        const verificationCode = generateOTP()

        trip.verificationCode = parseInt(verificationCode)
        trip.status = TRIP_STATUS.ARRIVED
        await trip.save()

        // send notification to  contractor
        NotificationService.sendNotification(
            {
                user: contractorId,
                userType: 'contractors',
                title: 'trip',
                heading: {},
                type: 'JOB_DAY_ARRIVAL',
                message: 'you successfully arrrived at site, wait for comfirmation from customer.',
                payload: { tripId: tripId, verificationCode }
            },
            {
                push: true,
                socket: true,
            }
        )


        // send notification to  customer
        NotificationService.sendNotification(
            {
                user: trip.customer.toString(),
                userType: 'customers',
                title: 'trip',
                heading: {name: contractorId, image: contractorId},
                type: 'JOB_DAY_ARRIVAL',
                message: 'Contractor is at your site.',
                payload: { tripId: tripId, verificationCode }
            },
            {
                push: true,
                socket: true,
            }
        )

        res.json({
            success: true,
            message: "you successfully arrrived at site, wait for comfirmation from customer",
            data: {verificationCode}
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