import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { JobDisputeModel, JOB_DISPUTE_STATUS } from "../../../database/common/job_dispute.model";
import { applyAPIFeature } from "../../../utils/api.feature";
import { JOB_STATUS } from "../../../database/common/job.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { JobDayModel } from "../../../database/common/job_day.model";
import { ConversationModel } from "../../../database/common/conversations.schema";



export const getJobDisputes = async (
  req: any,
  res: Response,
) => {
  try {

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const adminId = req.admin.id
    const filter = {}
    const {data, error} = await applyAPIFeature(JobDisputeModel.find(filter).populate({
      path: 'disputer',
      select: 'firstName lastName name profilePhoto _id'
    }), req.query)

    return res.json({ success: true, message: "Job disputes retrieved",  data });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

//get single dispute /////////////
export const getSingleDispute = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {

  try {
    const { disputeId } = req.params;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const admin = req.admin;
    const adminId = admin.id

    const dispute = await JobDisputeModel.findOne({ _id: disputeId })
      .populate([{
        path: 'customer',
        select: 'firstName lastName name profilePhoto _id phoneNumber email'
      },
      {
        path: 'contractor',
        select: 'firstName lastName name profilePhoto _id phoneNumber email'
      },
      {
        path: 'job',
        // select: 'title lastName name profilePhoto _id'
      }
      ]);


    if (!dispute) {
      return res
        .status(404)
        .json({ success: false, message: " Job dispute not found" });
    }



    const jobDay = await JobDayModel.findOne({ job: dispute.job })

    // create conversations here
    let arbitratorCustomerConversation = null
    let arbitratorContractorConversation = null

    if (dispute.arbitrator) {
      arbitratorCustomerConversation = await ConversationModel.findOneAndUpdate(
        {
          $and: [
            { members: { $elemMatch: { member: dispute.customer } } },
            { members: { $elemMatch: { member: dispute.arbitrator } } }
          ]
        },

        {
          members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'admins', member: dispute.arbitrator }],
        },
        { new: true, upsert: true }
      );

      arbitratorCustomerConversation.heading = await arbitratorCustomerConversation.getHeading(dispute.arbitrator)

      arbitratorContractorConversation = await ConversationModel.findOneAndUpdate(
        {
          $and: [
            { members: { $elemMatch: { member: dispute.contractor } } },
            { members: { $elemMatch: { member: dispute.arbitrator } } }
          ]
        },

        {
          members: [{ memberType: 'contractors', member: dispute.contractor }, { memberType: 'admins', member: dispute.arbitrator }],
        },
        { new: true, upsert: true }
      );
      arbitratorContractorConversation.heading = await arbitratorContractorConversation.getHeading(dispute.arbitrator)
    }


    const customerContractorConversation = await ConversationModel.findOneAndUpdate(
      {
        $and: [
          { members: { $elemMatch: { member: dispute.contractor } } },
          { members: { $elemMatch: { member: dispute.arbitrator } } }
        ]
      },

      {
        members: [{ memberType: 'customers', member: dispute.customer }, { memberType: 'contractors', member: dispute.contractor }],
      },
      { new: true, upsert: true }
    );



    const jobDispute = {
      conversations: { customerContractorConversation, arbitratorContractorConversation, arbitratorCustomerConversation },
      jobDay,
      ...dispute?.toJSON()
    }



    res.json({ success: true, message: "Job dispute retrieved", data: jobDispute });

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}

export const acceptDispute = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {

  try {
    const { disputeId } = req.params;

    const adminId = req.admin.id

    const jobDispute = await JobDisputeModel.findOne({ _id: disputeId })
      .populate(['customer', 'contractor']);

    if (!jobDispute) {
      return res
        .status(401)
        .json({success: false, message: "Invalid disputeId" });
    }

    if (jobDispute.status !== JOB_DISPUTE_STATUS.OPEN) {
      return res
        .status(401)
        .json({success: false,  message: "Dispute not pending" });
    }

    jobDispute.status = JOB_DISPUTE_STATUS.ONGOING
    jobDispute.arbitrator = adminId
    await jobDispute.save()



    res.json({ success: true, message: "Dispute accepted successfully" });

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}



//admin settle Dispute /////////////
export const settleDispute = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {

  try {
    const {resolvedWay } = req.body;
    const {disputeId} = req.params;


    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, message: "Validation occurred", errors: errors.array() });
    }

    const admin = req.admin;
    const adminId = admin.id

    const jobDispute = await JobDisputeModel.findOne({ _id: disputeId })

    if (!jobDispute) {
      return res
        .status(401)
        .json({ message: "Invalid disputeId" });
    }

    if (jobDispute.status != JOB_DISPUTE_STATUS.OPEN) {
      return res
        .status(401)
        .json({ message: "Dispute not yet accepted" });
    }

    if (jobDispute.arbitrator != adminId) {
      return res
        .status(401)
        .json({success: false, message: "Only dispute arbitrator can settle a dispute" });
    }

    jobDispute.status = JOB_DISPUTE_STATUS.RESOLVED
    jobDispute.resolvedWay = resolvedWay
    await jobDispute.save()

    return res.json({success: true, message: "Dispute resolved successfully"} );

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}

export const AdminDisputeController = {
  getJobDisputes,
  getSingleDispute,
  acceptDispute,
  settleDispute
}