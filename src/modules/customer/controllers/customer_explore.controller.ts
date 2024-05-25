import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { Document, PipelineStage as MongoosePipelineStage } from 'mongoose'; // Import Document type from mongoose
import { generateExpandedSchedule, getContractorIdsWithDateInSchedule } from "../../../utils/schedule.util";
import { applyAPIFeature } from "../../../utils/api.feature";
import { BadRequestError } from "../../../utils/custom.errors";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { endOfMonth, endOfYear, format, getDate, isValid, startOfMonth, startOfYear } from "date-fns";
import { ContractorScheduleModel } from "../../../database/contractor/models/contractor_schedule.model";
import { CONTRACTOR_TYPES } from "../../../database/contractor/interface/contractor.interface";


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
            listing,
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
                                    { $eq: ['$accountType', CONTRACTOR_TYPES.Individual] },
                                    { $eq: ['$accountType', CONTRACTOR_TYPES.Employee] }
                                ]
                            },
                            then: { $concat: ['$firstName', ' ', '$lastName'] },
                            else: '$companyName'
                        }
                    },
                    rating: { $avg: '$reviews.averageRating' } // Calculate average rating using $avg

                }
            },
            {
                $project: {
                    stripeIdentity: 0,
                    stripeCustomer: 0,
                    stripeAccount: 0,
                    stripePaymentMethods: 0,
                    stripePaymentMethod: 0,
                    passwordOtp: 0,
                    password: 0,
                    emailOtp: 0,
                    dateOfBirth: 0,
                    reviews: 0,
                    onboarding: 0,

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


        switch (listing) {
            case 'recommended':
                // Logic to fetch recommended contractors
                // pipeline.push(
                //     { $match: { rating: { $gte: 4.5 } } }, // Fetch contractors with rating >= 4.5
                //     { $sort: { rating: -1 } } // Sort by rating in descending order
                // );
                pipeline.push(
                    { $sample: { size: 10 } } // Randomly sample 10 contractors
                );
                break;
            case 'top-rated':
                // Logic to fetch top-rated contractors
                // pipeline.push(
                //     { $match: { rating: { $exists: true } } }, // Filter out contractors with no ratings
                //     { $sort: { rating: -1 } } // Sort by rating in descending order
                // );

                pipeline.push({ $match: { averageRating: { $exists: true } } });

                break;
            case 'featured':
                // Logic to fetch featured contractors
                pipeline.push(
                    { $match: { isFeatured: true } } // Filter contractors marked as featured
                );
                break;
            default:
                // Default logic if type is not specified or invalid
                // You can handle this case based on your requirements
                break;
        }


        // Add $facet stage for pagination
        pipeline.push({
            $facet: {
                metadata: [
                    { $count: "totalItems" },
                    { $addFields: { page, limit, currentPage: parseInt(page), lastPage: { $ceil: { $divide: ["$totalItems", parseInt(limit)] } }, listing } }
                ],
                data: [{ $skip: skip }, { $limit: parseInt(limit) }]
            }
        });

        // Execute pipeline
        const result = await ContractorModel.aggregate(pipeline);
        const contractors = result[0].data;
        const metadata = result[0].metadata[0];

        // Send response
        res.status(200).json({ success: true, data: { ...metadata, data: contractors } });

    } catch (err: any) {
        console.error("Error fetching contractors:", err);
        res.status(400).json({ message: 'Something went wrong' });
    }
}






export const getSingleContractor = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.params.contractorId
        const contractor = await ContractorModel.findById(contractorId).populate([
            { path: 'profile' }
        ]);

    if (!contractor) {
        return res.status(400).json({ success: false, message: 'Contractor not found' })
    }

    const contractorResponse = {
        //@ts-ignore
        ...contractor.toJSON({ includeReviews: {status: true, limit: 20},  }), // Convert to plain JSON object
      };


    // schedule
    //reviews etc here
    return res.status(200).json({ success: true, message: 'Contractor  found', data: contractorResponse })
} catch (error: any) {
    next(new BadRequestError('An error occured', error))
}
}


export const getContractorSchedules = async (req: any, res: Response) => {
    try {
        let { year, month } = req.query;
        const contractorId = req.params.contractorId;

        const contractorProfile = await ContractorProfileModel.findOne({ contractor: contractorId })

        if (!contractorProfile) {
            return res.status(400).json({ success: false, message: 'Contractor not found' });
        }
        if (year && !isValid(new Date(`${year}-01-01`))) {
            return res.status(400).json({ success: false, message: 'Invalid year format' });
        }

        let startDate: number | Date, endDate: number | Date;
        if (!year) {
            year = new Date().getFullYear().toString();
        }

        if (month) {
            // If month is specified, retrieve schedules for that month
            if (!isValid(new Date(`${year}-${month}-01`))) {
                return res.status(400).json({ success: false, message: 'Invalid month format' });
            }

            startDate = startOfMonth(new Date(`${year}-${month}-01`));
            endDate = endOfMonth(new Date(`${year}-${month}-01`));
        } else {
            // If no month specified, retrieve schedules for the whole year
            startDate = startOfYear(new Date(`${year}-01-01`));
            endDate = endOfYear(new Date(`${year}-12-31`));
        }


        // Group schedules by year and month

        const expandedSchedules = generateExpandedSchedule(contractorProfile.availableDays, year).filter(schedule => {
            return schedule.date >= startDate && schedule.date <= endDate;
        });


        // Fetch existing schedules within the specified timeframe
        const existingSchedules = await ContractorScheduleModel.find({
            contractor: contractorId,
            date: { $gte: startDate, $lte: endDate },
        });




        // Concatenate expandedSchedules and existingSchedules
        const mergedSchedules = [...expandedSchedules, ...existingSchedules];

        // Remove duplicates based on the date, retaining existing schedules
        const uniqueSchedules = mergedSchedules.filter((schedule, index) => {
            const date = schedule.date.toDateString();
            // Check if the current schedule's date is unique within the mergedSchedules array
            const isFirstOccurrence = mergedSchedules.findIndex((s) => s.date.toDateString() === date) === index;
            // Retain the existing schedule and the first occurrence of other dates
            return schedule.events ? schedule : isFirstOccurrence;
        });


        const groupedSchedules = uniqueSchedules.reduce((acc: any, schedule) => {
            const key = format(new Date(schedule.date), 'yyyy-M');
            if (!acc[key]) {
                acc[key] = { schedules: [], summary: {}, events: [] };
            }
            schedule.contractor = contractorId
            acc[key].schedules.push(schedule);

            // Use the event type as the key for the summary object
            if (!acc[key].summary[schedule.type]) {
                acc[key].summary[schedule.type] = [];
            }
            acc[key].summary[schedule.type].push(getDate(new Date(schedule.date)));

            // console.log((new Date(schedule.date + 'GMT+800').getDate()), schedule.date)

            // Include events summary if events are defined
            if (schedule.events) {
                const eventsSummary = schedule.events.map((event: any) => ({
                    title: event.title,
                    booking: event.booking,
                    date: event.date,
                    startTime: event.startTime,
                    endTime: event.endTime,
                }));

                acc[key].events = acc[key].events.concat(eventsSummary);
            }

            return acc;
        }, {});



        res.json({ success: true, message: 'Contractor schedules retrieved successfully', data: groupedSchedules });
    } catch (error) {
        console.error('Error retrieving schedules:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



export const CustomerExploreController = {
    exploreContractors,
    getSingleContractor,
    getContractorSchedules
}