import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { latitudeLongitudeCal } from "../../../utils/latitudeLogitudeCal";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";


export const customerFilterContractoController = async (
    req: any,
    res: Response,
) => {

    try {
        const {
            distance,
            emergency,
            category,
            location,
            accountType,
            date
        } = req.query;

        const files = req.files;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const customer = req.customer;
        const customerId = customer.id

        const lanLong = latitudeLongitudeCal(parseFloat(distance), 180)

        const searchContractors = await ContractorProfileModel.find({
            $and: [
                { emergencyJobs: emergency },
                {
                    $or: [
                        { "location.address": { $regex: new RegExp(location, 'i') } },
                        { "location.city": { $regex: new RegExp(location, 'i') } },
                        { "location.region": { $regex: new RegExp(location, 'i') } },
                        { "location.country": { $regex: new RegExp(location, 'i') } },
                        { "location.latitude": { $regex: new RegExp(lanLong.latitude.toString(), 'i') } },
                        { "location.longitude": { $regex: new RegExp(lanLong.longitude.toString(), 'i') } },
                    ]
                },
                { availableDays: { $regex: new RegExp(date, 'i') } },
                { skill: { $regex: new RegExp(category, 'i') } },
            ]

        }).limit(50);

        const output = []

        for (let i = 0; i < searchContractors.length; i++) {
            const searchContractor = searchContractors[i];

            const contractorProfile = await ContractorModel.findOne({
                $and: [
                    { _id: searchContractor.contractor },

                    { accountType: { $regex: new RegExp(accountType, 'i') } },
                ]
            }).select('-password')

            const obj = {
                searchContractor,
                contractorProfile
            }

            output.push(obj)

        }

        res.json({
            success: true,
            data: output
        });

    } catch (err: any) {
        // signup error
        console.log("error", err)
        res.status(500).json({ message: err.message });
    }

}

export const ExploreContractors = async (
    req: any,
    res: Response,
) => {

    try {
        const {
            distance,
            latitude,
            longitude,
            emergencyJobs,
            category,
            location,
            accountType,
            date,
            isOffDuty,
            availableDays,
            experienceYear,
            gstNumber
        } = req.query

        const availableDaysArray = availableDays.split(',');

        // Construct the pipeline stages based on the parameters
        const pipeline = [
            {
                $lookup: {
                    from: "contractor_profiles",
                    localField: "profile",
                    foreignField: "_id",
                    as: "profile"
                }
            },
            { $unwind: "$profile" },
            // Add a new field "distance" with the calculated distance
            {
                $addFields: {
                    distance: {
                        $sqrt: {
                            $sum: [
                                { $pow: [{ $subtract: ["$profile.location.latitude", latitude] }, 2] },
                                { $pow: [{ $subtract: ["$profile.location.longitude", longitude] }, 2] }
                            ]
                        }
                    }
                }
            },
            {
                $match: {
                    "skill": { $regex: new RegExp(category, 'i') },
                    "profile.location.country": location,
                    "accountType": accountType,
                    "experienceYear": experienceYear,
                    "profile.emergencyJobs": emergencyJobs,
                    "profile.isOffDuty": isOffDuty,
                    // "profile.availableDays": { $in: availableDaysArray },
                    "profile.availableDays": { $regex: new RegExp(date, 'i') },
                    "distance": { $lte: distance } // Filter by distance
                }
            }
        ];


        const customer = req.customer;
        const customerId = customer.id

        const contractors = await ContractorModel.aggregate(pipeline);
        console.log("Contractors found:", contractors);


        const lanLong = latitudeLongitudeCal(parseFloat(distance), 180)

        const searchContractors = await ContractorProfileModel.find({
            $and: [
                // { emergencyJobs: emergency },
                {
                    $or: [
                        { "location.address": { $regex: new RegExp(location, 'i') } },
                        { "location.city": { $regex: new RegExp(location, 'i') } },
                        { "location.region": { $regex: new RegExp(location, 'i') } },
                        { "location.country": { $regex: new RegExp(location, 'i') } },
                        { "location.latitude": { $regex: new RegExp(lanLong.latitude.toString(), 'i') } },
                        { "location.longitude": { $regex: new RegExp(lanLong.longitude.toString(), 'i') } },
                    ]
                },
                { availableDays: { $regex: new RegExp(date, 'i') } },
                { skill: { $regex: new RegExp(category, 'i') } },
            ]

        }).limit(50);

        const output = []



    } catch (err: any) {
        // signup error
        console.log("error", err)
        res.status(500).json({ message: err.message });
    }

}




export const CustomerExplore = {
    customerFilterContractoController
}