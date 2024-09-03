import { validationResult } from "express-validator";
import { NextFunction, Response } from "express";
import { JobDisputeModel, JOB_DISPUTE_STATUS } from "../../../database/common/job_dispute.model";
import { applyAPIFeature } from "../../../utils/api.feature";
import { JOB_SCHEDULE_TYPE, JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { JobDayModel } from "../../../database/common/job_day.model";
import { PAYMENT_TYPE } from "../../../database/common/payment.schema";
import TransactionModel, { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../../../database/common/transaction.model";
import { JobEvent } from "../../../events";
import AdminModel from "../../../database/admin/models/admin.model";
import { ConversationUtil } from "../../../utils/conversation.util";



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
    const { data, error } = await applyAPIFeature(JobDisputeModel.find(filter).populate({
      path: 'disputer',
      select: 'firstName lastName name profilePhoto _id'
    }), req.query)

    return res.json({ success: true, message: "Job disputes retrieved", data });

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
    const jobDispute = {
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
        .json({ success: false, message: "Invalid disputeId" });
    }

    if (jobDispute.status !== JOB_DISPUTE_STATUS.OPEN) {
      return res
        .status(401)
        .json({ success: false, message: "Dispute not pending" });
    }

    jobDispute.status = JOB_DISPUTE_STATUS.ONGOING
    jobDispute.arbitrator = adminId
    const { customerContractor, arbitratorContractor, arbitratorCustomer } = await ConversationUtil.updateOrCreateDisputeConversations(jobDispute)
    jobDispute.conversations = { customerContractor, arbitratorContractor, arbitratorCustomer }

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
    const { resolvedWay, remark } = req.body;
    const { disputeId } = req.params;


    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation occurred", errors: errors.array() });
    }

    const admin = req.admin;
    const adminId = admin.id

    const jobDispute = await JobDisputeModel.findOne({ _id: disputeId })

    if (!jobDispute) {
      return res
        .status(401)
        .json({ message: "Invalid disputeId" });
    }

    if (jobDispute.status != JOB_DISPUTE_STATUS.ONGOING) {
      return res
        .status(401)
        .json({ message: "Dispute not ongoing" });
    }

    if (jobDispute.arbitrator != adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Only dispute arbitrator can settle a dispute" });
    }


    const job = await JobModel.findById(jobDispute.job);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status === JOB_STATUS.COMPLETED) {
      return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
    }


    jobDispute.status = JOB_DISPUTE_STATUS.RESOLVED
    jobDispute.resolvedWay = 'DISPUTE_SETTLED'
    jobDispute.remark = remark
    await jobDispute.save()


    const jobStatus = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? JOB_STATUS.COMPLETED_SITE_VISIT : JOB_STATUS.COMPLETED
    job.statusUpdate = {
      ...job.statusUpdate,
      status: jobStatus,
      isCustomerAccept: true,
      awaitingConfirmation: false
    }

    job.status = jobStatus  // since its customer accepting job completion
    job.jobHistory.push({
      eventType: 'JOB_MARKED_COMPLETE_VIA_DISPUTE',
      timestamp: new Date(),
      payload: {
        markedBy: 'admin',
        dispute: jobDispute.id
      }
    });

    await job.save()
    JobEvent.emit('JOB_COMPLETED', { job })



    return res.json({ success: true, message: "Dispute resolved successfully" });

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}



export const createDisputeRefund = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {

  try {
    const { refundAmount, refundPercentage, remark } = req.body;
    const { disputeId } = req.params;


    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: "Validation occurred", errors: errors.array() });
    }

    const admin = req.admin;
    const adminId = admin.id

    const jobDispute = await JobDisputeModel.findOne({ _id: disputeId })

    if (!jobDispute) {
      return res
        .status(401)
        .json({ message: "Invalid disputeId" });
    }

    const job = await JobModel.findById(jobDispute.job)

    if (!job) {
      return res
        .status(400)
        .json({ success: false, message: "Disputed Job not found" });
    }


    if (job.status == JOB_STATUS.REFUNDED) {
      return res
        .status(401)
        .json({ success: false, message: "Job is already refunded" });
    }


    if (jobDispute.arbitrator != adminId) {
      return res
        .status(401)
        .json({ success: false, message: "Only dispute arbitrator can settle a dispute" });
    }

    jobDispute.status = JOB_DISPUTE_STATUS.RESOLVED
    jobDispute.resolvedWay = "JOB_REFUNDED"
    jobDispute.remark = remark
    await jobDispute.save()

    const paymentType = (job.schedule.type == 'JOB_DAY') ? [PAYMENT_TYPE.JOB_DAY_PAYMENT, PAYMENT_TYPE.CHANGE_ORDER_PAYMENT] : [PAYMENT_TYPE.SITE_VISIT_PAYMENT]
    const payments = await job.getPayments(paymentType)


    for (const payment of payments.payments) {
      if (payment.refunded) continue
      let refund = {
        refundAmount: payment.amount,
        totalAmount: payment.amount,
        fee: 0,
        contractorAmount: 0,
        companyAmount: 0,
        intiatedBy: 'admin',
        policyApplied: 'dispute_refund',
      };


      //create refund transaction - 
      await TransactionModel.create({
        type: TRANSACTION_TYPE.REFUND,
        amount: payments.totalAmount,

        initiatorUser: adminId,
        initiatorUserType: 'admins',

        fromUser: job.contractor,
        fromUserType: 'contractors',

        toUser: jobDispute.customer,
        toUserType: 'customers',

        description: `Refund from job: ${job?.title} payment`,
        status: TRANSACTION_STATUS.PENDING,
        remark: 'job_refund',
        invoice: {
          items: [],
          charges: refund
        },
        metadata: {
          ...refund,
          payment: payment.id.toString(),
          charge: payment.charge
        },
        job: job.id,
        payment: payment.id,
      })

      JobEvent.emit('JOB_REFUND_REQUESTED', { job, payment, refund })

    }

    // Update the job status to canceled
    job.status = JOB_STATUS.REFUNDED;

    job.jobHistory.push({
      eventType: 'JOB_DISPUTE_REFUND',
      timestamp: new Date(),
      payload: { reason: 'Settlement by admin', dispute: disputeId }
    });

    // emit job cancelled event 
    JobEvent.emit('JOB_DISPUTE_REFUND_CREATED', { job, dispute: jobDispute })

    await job.save();

    return res.json({ success: true, message: "Dispute refund created" });

  } catch (error: any) {
    return next(new InternalServerError('An error occurred', error))
  }
}



export const markJobAsComplete = async (req: any, res: Response, next: NextFunction) => {
  try {
    const adminId = req.admin.id;
    const { disputeId } = req.params;
    const { resolvedWay, remark } = req.body;


    const dispute = await JobDisputeModel.findOne({ _id: disputeId })

    if (!dispute) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid disputeId" });
    }

    const job = await JobModel.findById(dispute.job);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }


    if (job.status === JOB_STATUS.COMPLETED) {
      return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
    }


    if (job.status == JOB_STATUS.REFUNDED) {
      return res
        .status(401)
        .json({ success: false, message: "Job is already refunded" });
    }

    const jobStatus = (job.schedule.type == JOB_SCHEDULE_TYPE.SITE_VISIT) ? JOB_STATUS.COMPLETED_SITE_VISIT : JOB_STATUS.COMPLETED
    job.statusUpdate = {
      ...job.statusUpdate,
      status: jobStatus,
      isCustomerAccept: true,
      awaitingConfirmation: false
    }

    job.status = jobStatus  // since its customer accepting job completion
    job.jobHistory.push({
      eventType: 'JOB_MARKED_COMPLETE_VIA_DISPUTE',
      timestamp: new Date(),
      payload: {
        markedBy: 'admin',
        dispute: dispute.id
      }
    });

    dispute.status = JOB_DISPUTE_STATUS.RESOLVED
    dispute.resolvedWay = "JOB_MARKED_COMPLETE"
    dispute.remark = remark
    await dispute.save()
    await job.save();


    JobEvent.emit('JOB_COMPLETED', { job })


    res.json({ success: true, message: 'Job marked as complete', data: job });
  } catch (error: any) {
    console.log(error)
    return next(new InternalServerError('An error occurred', error));
  }
};


export const enableRevisit = async (req: any, res: Response, next: NextFunction) => {
  try {
    const adminId = req.admin.id;
    const { disputeId } = req.params;
    const { resolvedWay, remark } = req.body;


    const dispute = await JobDisputeModel.findOne({ _id: disputeId })

    if (!dispute) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid disputeId" });
    }

    const job = await JobModel.findById(dispute.job);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const jobDay = await JobDayModel.findOne({job: job.id});
    if (!jobDay) {
      return res.status(404).json({ success: false, message: 'Existing job day not found' });
    }

    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }


    if (job.status === JOB_STATUS.COMPLETED) {
      return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
    }


    if (job.status == JOB_STATUS.REFUNDED) {
      return res
        .status(401)
        .json({ success: false, message: "Job is already refunded" });
    }

    job.revisitEnabled = true
    // job.status = JOB_STATUS.BOOKED 
    // job.schedule.startDate.setDate(job.schedule.startDate.getDate() + 14);
    job.jobHistory.push({
      eventType: 'REVISIT_ENABLED_VIA_DISPUTE',
      timestamp: new Date(),
      payload: {
        markedBy: 'admin',
        dispute: dispute.id,
        previousJobDay: jobDay
      }
    });

    dispute.status = JOB_DISPUTE_STATUS.REVISIT
    dispute.resolvedWay = "REVISIT_ENABLED"
    dispute.remark = remark

    await dispute.save()
    await job.save();


    JobEvent.emit('JOB_REVISIT_ENABLED', { job, dispute })


    res.json({ success: true, message: 'Job marked as complete', data: job });
  } catch (error: any) {
    console.log(error)
    return next(new InternalServerError('An error occurred', error));
  }
};


export const AdminDisputeController = {
  getJobDisputes,
  getSingleDispute,
  acceptDispute,
  settleDispute,
  createDisputeRefund,
  markJobAsComplete,
  enableRevisit
}