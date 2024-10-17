import { validationResult } from "express-validator";
import { Response } from "express";
import { JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { applyAPIFeature } from "../../../utils/api.feature";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import { CONTRACTOR_TYPES } from "../../../database/contractor/interface/contractor.interface";



export const getJobs = async (
  req: any,
  res: Response,
) => {

  try {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { data, filter } = await applyAPIFeature(JobModel.find().populate(['customer', 'contractor', 'contract']), req.query)

    const allJobs = await JobModel.countDocuments(filter);
    const totalCanceled = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.CANCELED });
    const totalCompleted = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.COMPLETED });
    const totalPending = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.PENDING });
    const totalBooked = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.BOOKED });
    const totalDisputed = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.DISPUTED });
    const totalNotStarted = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.NOT_STARTED });
    const totalOngoing = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.ONGOING });
    const totalExpired = await JobModel.countDocuments({ ...filter, status: JOB_STATUS.EXPIRED });

    // Find the most requested job category
    const mostRequestedCategory = await JobModel.aggregate([
      { $match: { ...filter } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    return res.json({
      success: true, message: "Jobs retrieved successfully",
      data: {
        ...data,
        stats: {
          allJobs,
          totalCanceled,
          totalCompleted,
          totalPending,
          totalBooked,
          totalDisputed,
          totalNotStarted,
          totalOngoing,
          totalExpired,
          mostRequestedCategory: mostRequestedCategory[0]

        }
      },
    });

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}

export const getSingleJob = async (
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

    const job = await JobModel.findById(jobId).populate(['customer', 'contractor', 'contract'])

    if (!job) {
      return res.status(401).json({ message: "Job not found" });
    }

    res.json({ success: true, message: "Job retrieved", data: job });

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }

}


export const getJobStats = async (
  req: any,
  res: Response,
) => {

  try {
    let {

    } = req.query;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const totalJob = await JobModel.countDocuments()
    const totalCanceled = await JobModel.countDocuments({ status: JOB_STATUS.CANCELED })
    const totalCompleted = await JobModel.countDocuments({ status: JOB_STATUS.COMPLETED })
    const totalDisputed = await JobModel.countDocuments({ status: JOB_STATUS.DISPUTED })
    const mostRequestedCategory = await JobModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const topRatedContractor = await ContractorModel.aggregate([
      { $match: { reviews: { $exists: true, $ne: [] } } },
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
          ratingCount: { $size: '$reviews' }, // Calculate average rating using $avg


        }
      },
      { $project: { _id: 1, profilePhoto: 1, name: 1, rating: 1, ratingCount: 1, reviewCount: { $size: "$reviews" } } },

      { $sort: { reviewCount: -1 } },
      { $limit: 1 }
    ]);

    // const topRatedContractor = await ContractorModel.findById(topRatedContractorId[0]._id)

    return res.json({ success: false, message: "Job stats retrieved", data: { totalJob, totalCanceled, totalCompleted, totalDisputed, mostRequestedCategory: mostRequestedCategory[0], topRatedContractor: topRatedContractor[0] } });

  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }

}

export const AdminJobController = {
  getJobs,
  getSingleJob,
  getJobStats,
}



