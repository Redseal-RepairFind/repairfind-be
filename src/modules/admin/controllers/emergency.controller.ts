import { NextFunction, Response } from "express";
import { JobEmergencyModel, EMERGENCY_STATUS } from "../../../database/common/job_emergency.model";
import { applyAPIFeature } from "../../../utils/api.feature";
import { InternalServerError } from "../../../utils/custom.errors";



export const getEmergencies = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {

  try {

    const { data, filter } = await applyAPIFeature(JobEmergencyModel.find(), req.query)

    const totalResolved = await JobEmergencyModel.countDocuments({ ...filter, status: EMERGENCY_STATUS.RESOLVED });
    const totalPending = await JobEmergencyModel.countDocuments({ ...filter, status: EMERGENCY_STATUS.PENDING });
    const totalInProgress = await JobEmergencyModel.countDocuments({ ...filter, status: EMERGENCY_STATUS.IN_PROGRESS });


    return res.json({
      success: true, message: "Job emergencies retrieved", data: {
        ...data,
        stats: {
          totalResolved,
          totalPending,
          totalInProgress,
        }
      },
    });

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}


//get single emergency /////////////
export const getSingleEmergency = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  try {
    const { emergencyId } = req.params;

    const admin = req.admin;
    const adminId = admin.id

    const jobEmergency = await JobEmergencyModel.findOne({ _id: emergencyId })
      .populate([{
        path: 'customer',
        select: 'firstName lastName name profilePhot email phoneNumber  _id'
      }, {
        path: 'contractor',
        select: 'firstName lastName name profilePhoto email phoneNumber _id'
      }, { path: 'job' }]);

    if (!jobEmergency) {
      return res
        .status(401)
        .json({ success: false, message: "Emergency not found" });
    }

    return res.json({ success: true, message: "Emergency retrieved", data: jobEmergency });

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}


//admin accept emergency /////////////
export const acceptEmergency = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {

  try {
    const { emergencyId } = req.params;

    const adminId = req.admin.id

    const jobEmergency = await JobEmergencyModel.findOne({ _id: emergencyId })
      .populate(['customer', 'contractor']);

    if (!jobEmergency) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid emergencyId" });
    }

    if (jobEmergency.status !== EMERGENCY_STATUS.PENDING) {
      return res
        .status(401)
        .json({ success: false, message: "Job emergency is not pending" });
    }

    jobEmergency.status = EMERGENCY_STATUS.IN_PROGRESS
    jobEmergency.acceptedBy = adminId
    await jobEmergency.save()

    res.json({ success: true, message: "Emergency accepted successfully" });

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}


export const resolveEmergency = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  try {
    const { emergencyId } = req.params;
    const { resolvedWay } = req.body;

    const adminId = req.admin.id

    const jobEmergency = await JobEmergencyModel.findOne({ _id: emergencyId })

    if (!jobEmergency) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid emergencyId" });
    }

    if (jobEmergency.status !== EMERGENCY_STATUS.IN_PROGRESS) {
      return res
        .status(401)
        .json({ success: false, message: "Emergency is not in progress" });
    }


    jobEmergency.status = EMERGENCY_STATUS.RESOLVED
    jobEmergency.resolvedWay = resolvedWay
    await jobEmergency.save()

    return res.json({ success: true, message: "emergency resolved successfully" });
  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}






export const AdminEmergencyController = {
  getEmergencies,
  getSingleEmergency,
  acceptEmergency,
  resolveEmergency,
}