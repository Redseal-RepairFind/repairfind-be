import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { CONTRACTOR_TYPES, ContractorModel } from "../../../database/contractor/models/contractor.model";
import { Document, PipelineStage as MongoosePipelineStage } from 'mongoose'; // Import Document type from mongoose
import { getContractorIdsWithDateInSchedule } from "../../../utils/schedule.util";


type PipelineStage =
    | MongoosePipelineStage
    | { $lookup: { from: string; localField: string; foreignField: string; as: string, pipeline?: any } }
    | { $unwind: string | { path: string; includeArrayIndex?: string; preserveNullAndEmptyArrays?: boolean } }
    | { $match: any }
    | { $addFields: any }
    | { $project: any }
    | { $sort: { [key: string]: 1 | -1 } } // Adjusted $sort type to match Mongoose's Sort type
    | { $group: any }; // Adding $sort type to PipelineStage

export const exploreContractors = async (
    req: any,
    res: Response,
) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try {
        const {
            distance,
            latitude,
            longitude,
            emergencyJobs,
            category,
            location,
            city,
            country,
            address,
            accountType,
            date,
            isOffDuty,
            availableDays,
            experienceYear,
            gstNumber
        } = req.query; // Ensure correct type for query parameters if available

        const availableDaysArray = availableDays ? availableDays.split(',') : [];

        // Construct the pipeline stages based on the parameters
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "contractor_profiles",
                    localField: "profile",
                    foreignField: "_id",
                    as: "profile"
                }
            },
            { $unwind: "$profile" },

            {
                $addFields: {
                    name: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$accountType', CONTRACTOR_TYPES.INDIVIDUAL] },
                                    { $eq: ['$accountType', CONTRACTOR_TYPES.EMPLOYEE] }
                                ]
                            },
                            then: { $concat: ['$firstName', ' ', '$lastName'] },
                            else: '$companyName'
                        }
                    }
                }
            },



            {
                $project: {
                    stripeIdentity: 0, // Exclude stripeIdentity field from query results
                    stripeCustomer: 0, // 
                    stripePaymentMethods: 0,
                    stripePaymentMethod: 0,
                    passwordOtp: 0,
                    password: 0,
                    emailOtp: 0,
                    dateOfBirth: 0,
                    "profile.previousJobPhotos": 0,
                    "profile.previousJobVideos": 0,
                }
            }
        ];

        // Add stages conditionally based on query parameters
        if (category) {
            pipeline.push({ $match: { "profile.skill": { $regex: new RegExp(category, 'i') } } });
        }
        if (country) {
            pipeline.push({ $match: { "profile.location.country": { $regex: new RegExp(country, 'i') } } });
        }
        if (city) {
            pipeline.push({ $match: { "profile.location.city": { $regex: new RegExp(city, 'i') } } });
        }
        if (address) {
            pipeline.push({ $match: { "profile.location.address": { $regex: new RegExp(address, 'i') } } });
        }
        if (accountType) {
            pipeline.push({ $match: { "accountType": accountType } });
        }
        if (experienceYear) {
            pipeline.push({ $match: { "profile.experienceYear": parseInt(experienceYear) } });
        }
        if (emergencyJobs !== undefined) {
            pipeline.push({ $match: { "profile.emergencyJobs": emergencyJobs === "true" } });

        }
        if (isOffDuty !== undefined) {
            pipeline.push({ $match: { "profile.isOffDuty": isOffDuty  === "true" || null} });
        }
        if (gstNumber) {
            pipeline.push({ $match: { "profile.gstNumber": gstNumber } });
        }

        if (date) {
            const contractorIdsWithDateInSchedule = await getContractorIdsWithDateInSchedule(new Date(date));
            // console.log(contractorIdsWithDateInSchedule)
            pipeline.push({ $match: { "profile.contractor": { $in: contractorIdsWithDateInSchedule } } });
        }


        if (availableDays) {
            pipeline.push({ $match: { "profile.availableDays": { $in: availableDaysArray } } });
        }
        if (distance && latitude && longitude) {
            pipeline.push({
                $addFields: {
                    distance: {
                        $sqrt: {
                            $sum: [
                                { $pow: [{ $subtract: [{$toDouble: "$profile.location.latitude"}, parseFloat(latitude)] }, 2] },
                                { $pow: [{ $subtract: [{$toDouble: "$profile.location.longitude"}, parseFloat(longitude)] }, 2] }
                            ]
                        }
                    }
                }
            });
            pipeline.push({ $match: { "distance": { $lte: parseInt(distance) } } });
        }

        const contractors = await ContractorModel.aggregate<Document>(pipeline);

        return res.status(200).json({
            success: true,
            message: "Contractors retrieved successfully",
            data: contractors
        });
    } catch (err: any) {
        // Handle error
        console.error("Error fetching contractors:", err);
        res.status(500).json({ message: err.message });
    }

}




export const CustomerExploreController = {
    exploreContractors
}