import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { Document, PipelineStage as MongoosePipelineStage, Types } from 'mongoose'; // Import Document type from mongoose
import { generateExpandedSchedule, getContractorIdsWithDateInSchedule } from "../../../utils/schedule.util";
import { applyAPIFeature } from "../../../utils/api.feature";
import { BadRequestError } from "../../../utils/custom.errors";
import { ContractorProfileModel } from "../../../database/contractor/models/contractor_profile.model";
import { endOfMonth, endOfYear, format, getDate, isValid, startOfMonth, startOfYear } from "date-fns";
import { ContractorScheduleModel } from "../../../database/contractor/models/contractor_schedule.model";
import { CONTRACTOR_TYPES } from "../../../database/contractor/interface/contractor.interface";
import { REVIEW_TYPE, ReviewModel } from "../../../database/common/review.model";
import CustomerFavoriteContractorModel from "../../../database/customer/models/customer_favorite_contractors.model";
import CustomerModel from "../../../database/customer/models/customer.model";
import { JobModel } from "../../../database/common/job.model";
import { JobQuotationModel } from "../../../database/common/job_quotation.model";


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
    const customerId = req?.customer?.id

    if (!customerId) {
        const { data, error } = await applyAPIFeature(ContractorModel.find({accountType: CONTRACTOR_TYPES.Individual }), {})
        return res.status(200).json({ success: true, message: 'Contractors retrieved successfully', data: data });
    }


    const customer = await CustomerModel.findById(customerId);
    try {

        let {
            searchName,
            listing,
            minDistance,
            maxDistance,
            radius,
            latitude = Number(customer?.location?.latitude), //if latitude is not provided, use the stored location of the customer
            longitude = Number(customer?.location?.longitude),
            emergencyJobs,
            category,
            location,
            city,
            country,
            address,
            accountType,
            date,
            isOffDuty,
            availability,
            experienceYear,
            gstNumber,
            page = 1, // Default to page 1
            limit = 10, // Default to 10 items per page
            sort, // Sort field and order (-fieldName or fieldName)
            minResponseTime,
            maxResponseTime,
            sortByResponseTime,
        } = req.query;

        const availableDaysArray = availability ? availability.split(',') : [];
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const toRadians = (degrees: number) => degrees * (Math.PI / 180);
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
                    rating: { $avg: '$reviews.averageRating' }, // Calculate average rating using $avg
                    reviewCount: { $size: '$reviews' }, // Calculate average rating using $avg

                    stripeAccountStatus: {
                        details_submitted: "$stripeAccount.details_submitted",
                        payouts_enabled: "$stripeAccount.payouts_enabled",
                        charges_enabled: "$stripeAccount.charges_enabled",

                        // transfers_enabled: { $ifNull: ["$stripeAccount.capabilities.transfers", "inactive"] },
                        // card_payments_enabled: { $ifNull: ["$stripeAccount.capabilities.card_payments", "inactive"] },

                        transfers_enabled: {
                            $cond: {
                                if: { $ifNull: ["$stripeAccount.capabilities.transfers", "inactive"] }, //{ $eq: ["$stripeAccount.capabilities.transfers", "active"] },
                                then: true,
                                else: false
                            }
                        },
                        card_payments_enabled: {
                            $cond: {
                                if: { $ifNull: ["$stripeAccount.capabilities.card_payments", "inactive"] },//{ $eq: ["$stripeAccount.capabilities.card_payments", "active"] },
                                then: true,
                                else: false
                            }
                        },

                        status: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $eq: ["$stripeAccount.capabilities.card_payments", "active"] },
                                        { $eq: ["$stripeAccount.capabilities.transfers", "active"] }
                                    ]
                                },
                                then: 'active',
                                else: 'inactive'
                            }
                        }
                    }

                }
            },
            {
                $lookup: {
                    from: "job_quotations",
                    localField: "_id",
                    foreignField: "contractor",
                    as: "quotations"
                }
            },
            {
                $addFields: {
                    distance: {
                        $round: [
                            {
                                $multiply: [
                                    6371, // Earth's radius in km
                                    {
                                        $acos: {
                                            $add: [
                                                {
                                                    $multiply: [
                                                        { $sin: toRadians(latitude) },
                                                        { $sin: { $toDouble: { $multiply: [{ $toDouble: "$profile.location.latitude" }, (Math.PI / 180)] } } }
                                                    ]
                                                },
                                                {
                                                    $multiply: [
                                                        { $cos: toRadians(latitude) },
                                                        { $cos: { $toDouble: { $multiply: [{ $toDouble: "$profile.location.latitude" }, (Math.PI / 180)] } } },
                                                        { $cos: { $subtract: [{ $toDouble: { $multiply: [{ $toDouble: "$profile.location.longitude" }, (Math.PI / 180)] } }, toRadians(longitude)] } }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            0
                        ]
                    },

                }
            },
            {
                $addFields: {
                    avgResponseTime: {
                        $avg: "$quotations.responseTime"
                    },
                    expiresIn: {
                        $cond: {
                            if: { $and: [{ $gt: ["$expiryDate", null] }, { $gt: ["$createdAt", null] }] },
                            then: {
                                $ceil: {
                                    $divide: [
                                        { $subtract: ["$expiryDate", "$$NOW"] },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            },
                            else: null
                        }
                    }
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
            },

            //example filter out who do not have stripe account
            // { $match: { "stripeAccountStatus.status": 'active' } },


            // filter out contractors without certn approval
            { $match: { "certnDetails.report_status": 'COMPLETE' } },

            //example filter out employees and contractors 
            { $match: { accountType: { $ne: CONTRACTOR_TYPES.Employee } } },

            { $match: { "profile.isOffDuty": { $eq: false } } }
        ];


        if (customerId) {
            pipeline.push(
                {
                    $lookup: {
                        from: "blocked_users",
                        let: { contractorId: "$_id" }, // Passing contractor's ID as a variable
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$customer", new Types.ObjectId(customerId)] }, // Customer is the one checking
                                            { $eq: ["$contractor", "$$contractorId"] } // Contractor is blocked
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "blockStatus" // Save the result of the lookup in the "blockStatus" field
                    }
                },
                {
                    // Exclude contractors who have block statuses in the "blockStatus" array
                    $match: {
                        blockStatus: { $eq: [] } // Ensure only contractors who are not blocked by the customer are included
                    }
                }
            );
        }


        if (searchName) {
            pipeline.push({ $match: { "name": { $regex: new RegExp(searchName, 'i') } } });
        }
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
        if (availability) {
            pipeline.push({ $match: { "profile.availability": { $in: availableDaysArray } } });
        }
        if (radius) {
            pipeline.push({ $match: { "distance": { $lte: parseInt(radius) } } });
        }

        if (minDistance !== undefined) {
            pipeline.push({ $match: { "distance": { $gte: parseInt(minDistance) } } });
        }

        if (maxDistance !== undefined) {
            pipeline.push({ $match: { "distance": { $lte: parseInt(maxDistance) } } });
        }


        if (minResponseTime !== undefined) {
            minResponseTime = minResponseTime * 1000
            pipeline.push({ $match: { "avgResponseTime": { $gte: parseInt(minResponseTime) } } });
        }

        if (maxResponseTime !== undefined) {
            maxResponseTime = maxResponseTime * 1000
            pipeline.push({ $match: { "avgResponseTime": { $lte: parseInt(maxResponseTime) } } });
        }

        // if (sortByResponseTime !== undefined) {
        //     const sortOrder = sortByResponseTime === "asc" ? 1 : -1;
        //     pipeline.push({ $sort: { avgResponseTime: sortOrder } });
        // }


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
                pipeline.push(
                    { $sample: { size: 10 } } // Randomly sample 10 contractors
                );
                break;
            case 'top-rated':
                // Logic to fetch top-rated contractors
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
            { path: 'profile' },
        ]);

        if (!contractor) {
            return res.status(400).json({ success: false, message: 'Contractor not found' })
        }

        contractor.stats = await contractor.getStats();

        return res.status(200).json({ success: true, message: 'Contractor  found', data: contractor })
    } catch (error: any) {
        next(new BadRequestError('An error occurred', error))
    }
}


export const getContractorReviews = async (req: any, res: Response, next: NextFunction) => {
    try {
        const contractorId = req.params.contractorId
        const contractor = await ContractorModel.findById(contractorId).populate([
            { path: 'profile' },
        ]);

        if (!contractor) {
            return res.status(400).json({ success: false, message: 'Contractor not found' })
        }

        //reviews etc here
        let filter: any = { contractor: contractorId };
        const { data, error } = await applyAPIFeature(ReviewModel.find(filter).populate(['customer']), req.query);

        if (data) {
            await Promise.all(data.data.map(async (review: any) => {
                review.heading = await review.getHeading()
            }));
        }

        return res.status(200).json({ success: true, message: 'Contractor reviews  retrieved', data: data })
    } catch (error: any) {
        next(new BadRequestError('An error occurred', error))
    }
}



export const getFavoriteContractors = async (req: any, res: Response, next: NextFunction) => {
    try {
        const customerId = req.customer.id

        //favorites etc here
        const favorites = await CustomerFavoriteContractorModel.find({ customer: customerId }).select('contractor');
        const favoriteIds = favorites.map((fav) => fav.contractor);
        let filter: any = { _id: { $in: favoriteIds } };

        const { data, error } = await applyAPIFeature(ContractorModel.find(filter), req.query);
        return res.status(200).json({ success: true, message: 'Favorite contractors  retrieved', data: data })
    } catch (error: any) {
        next(new BadRequestError('An error occurred', error))
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



        // Expand schedules from contractor availability
        const expandedSchedules: any = generateExpandedSchedule(contractorProfile.availability, year).filter(schedule => {
            return schedule.date >= startDate && schedule.date <= endDate;
        });


        // Expand schedule from Booked jobs schedule
        const jobs = await JobModel.find({
            contractor: contractorId,
            'schedule.startDate': { $gte: startDate, $lte: endDate },
        }).populate('contract')

        const jobSchedules = await Promise.all(jobs.map(async (job) => {
            const contractor = await ContractorModel.findById(job.contractor);
            const contract = await JobQuotationModel.findOne(job.contract)
            const charges = await contract?.calculateCharges()
            // spread time
            const scheduleDate = job.schedule.startDate

            const startTime = scheduleDate ? scheduleDate.toTimeString().slice(0, 8) : "00:00:00";
            const estimatedDuration = job.schedule.estimatedDuration ?? 1

            const start = new Date(scheduleDate);
            start.setHours(start.getHours() + estimatedDuration);
            const endTime = start.toTimeString().slice(0, 8);

            const times = [];

            // Expand hours from startTime to endTime with one-hour intervals
            for (let hour = parseInt(startTime.split(":")[0], 10); hour <= parseInt(endTime.split(":")[0], 10); hour++) {
                let formattedHour = `${hour.toString().padStart(2, '0')}:00:00`;
                times.push(formattedHour);
            }

            return {
                date: job.schedule.startDate,
                type: job.schedule.type,
                contractor: contractor,
                times,
                events: [
                    {
                        //@ts-ignore
                        totalAmount: charges?.customerPayable ?? 0,
                        job: job.id,
                        skill: job?.category,
                        date: job?.schedule.startDate,
                        estimatedDuration

                    }
                ]
            };


        }));


        // Expand schedule from stored specific day kind of schedule
        const contractorExistingSchedules = await ContractorScheduleModel.find({ contractor: contractorId })
        const existingSchedules = contractorExistingSchedules.map(schedule => {
            const startTime = schedule.startTime ?? "00:00:00"
            const endTime = schedule.endTime ?? "23:00:00"
            const times = [];
            // Expand hours from startTime to endTime with one-hour intervals
            for (let hour = parseInt(startTime.split(":")[0], 10); hour <= parseInt(endTime.split(":")[0], 10); hour++) {
                let formattedHour = `${hour.toString().padStart(2, '0')}:00:00`;
                times.push(formattedHour);
            }

            return {
                date: schedule.date,
                type: schedule.type,
                contractor: schedule.contractor,
                times,
                events: schedule.events
            };
        })



        // Concatenate expandedSchedules and existingSchedules
        const mergedSchedules = [...expandedSchedules, ...jobSchedules, ...existingSchedules];

        // Remove duplicates based on the date, retaining existing schedules
        const uniqueSchedules = mergedSchedules.filter((schedule, index) => {
            const date = schedule.date.toDateString();
            // Check if the current schedule's date is unique within the mergedSchedules array
            const isFirstOccurrence = mergedSchedules.findIndex((s) => s.date.toDateString() === date) === index;
            // Retain the existing schedule and the first occurrence of other dates
            return schedule.events ? schedule : isFirstOccurrence;
        });


        // Filter out conflicting times from availability
        const filterAvailableTimes = (schedules: any) => {
            // Create a map of dates to unavailable and job times
            const conflictTimes = schedules.reduce((acc: any, schedule: any) => {
                if (schedule.type !== 'available') {
                    const date = new Date(schedule.date).toDateString();
                    if (!acc[date]) acc[date] = new Set();
                    schedule.times.forEach((time: any) => acc[date].add(time));
                }
                return acc;
            }, {});

            // Filter out the conflicting times for available schedules
            return schedules.map((schedule: any) => {
                if (schedule.type === 'available') {
                    const date = new Date(schedule.date).toDateString();
                    if (conflictTimes[date]) {
                        schedule.times = schedule.times.filter((time: any) => !conflictTimes[date].has(time));
                    }
                }
                return schedule;
            });
        };
        const updatedSchedules = filterAvailableTimes(uniqueSchedules);

        const groupedSchedules = updatedSchedules.reduce((acc: any, schedule: any) => {
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
    getContractorSchedules,
    getContractorReviews,
    getFavoriteContractors
}