import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { CONTRACTOR_TYPES, ContractorModel } from "../../../database/contractor/models/contractor.model";
import { Document, PipelineStage as MongoosePipelineStage } from 'mongoose'; // Import Document type from mongoose
import { getContractorIdsWithDateInSchedule } from "../../../utils/schedule.util";
import { applyAPIFeature } from "../../../utils/api.feature";


type PipelineStage =
    | MongoosePipelineStage
    | { $lookup: { from: string; localField: string; foreignField: string; as: string, pipeline?: any } }
    | { $unwind: string | { path: string; includeArrayIndex?: string; preserveNullAndEmptyArrays?: boolean } }
    | { $match: any }
    | { $addFields: any }
    | { $project: any }
    | { $sort: { [key: string]: 1 | -1 } }
    | { $group: any };

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
            gstNumber,
            page = 1, // Default to page 1
            limit = 10, // Default to 10 items per page
            sort // Sort field and order (-fieldName or fieldName)
        } = req.query;

        const availableDaysArray = availableDays ? availableDays.split(',') : [];
        const skip = (parseInt(page) - 1) * parseInt(limit);

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
                    stripeIdentity: 0,
                    stripeCustomer: 0,
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
            pipeline.push({ $match: { "profile.isOffDuty": isOffDuty === "true" || null } });
        }
        if (gstNumber) {
            pipeline.push({ $match: { "profile.gstNumber": gstNumber } });
        }
        if (date) {
            const contractorIdsWithDateInSchedule = await getContractorIdsWithDateInSchedule(new Date(date));
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
                                { $pow: [{ $subtract: [{ $toDouble: "$profile.location.latitude" }, parseFloat(latitude)] }, 2] },
                                { $pow: [{ $subtract: [{ $toDouble: "$profile.location.longitude" }, parseFloat(longitude)] }, 2] }
                            ]
                        }
                    }
                }
            });
            pipeline.push({ $match: { "distance": { $lte: parseInt(distance) } } });
        }

        if (sort) {
            const [sortField, sortOrder] = sort.startsWith('-') ? [sort.slice(1), -1] : [sort, 1];
            const sortStage: PipelineStage = {
                //@ts-ignore
                $sort: { [sortField]: sortOrder }
            };
            pipeline.push(sortStage);
        }

        // Add $facet stage for pagination
        pipeline.push({
            $facet: {
                metadata: [
                    { $count: "totalItems" },
                    { $addFields: { page, limit, currentPage: parseInt(page), lastPage: { $ceil: { $divide: ["$totalItems", parseInt(limit)] } } } }
                ],
                data: [{ $skip: skip }, { $limit: parseInt(limit) }]
            }
        });

        // Execute pipeline
        const result = await ContractorModel.aggregate(pipeline); // Assuming Contractor is your Mongoose model
        const contractors = result[0].data;
        const metadata = result[0].metadata[0];

        // Send response
        res.status(200).json({success: true, data: {...metadata, data: contractors } });
        
    } catch (err: any) {
        console.error("Error fetching contractors:", err);
        res.status(400).json({ message: 'Something went wrong' });
    }
}





export const CustomerExploreController = {
    exploreContractors
}