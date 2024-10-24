import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import CustomerModel from "../../../database/customer/models/customer.model";
import { sendPushNotifications } from "../../../services/expo";
import CustomerDeviceModel from "../../../database/customer/models/customer_devices.model";
import { transferFileToS3 } from "../../../services/storage";
import { StripeService } from "../../../services/stripe";
import { castPayloadToDTO } from "../../../utils/interface_dto.util";
import { IStripeCustomer } from "../../../database/common/stripe_customer.interface";
import { JOB_STATUS, JobModel } from "../../../database/common/job.model";
import BlacklistedToken from "../../../database/common/blacklisted_tokens.schema";
import { FeedbackModel } from "../../../database/common/feedback.model";
import { InternalServerError } from "../../../utils/custom.errors";
import { AdminEvent } from "../../../events/admin.events";
import { AccountEvent, ConversationEvent } from "../../../events";
import { ABUSE_REPORT_TYPE, AbuseReportModel } from "../../../database/common/abuse_reports.model";
import { BLOCK_USER_REASON, BlockedUserModel } from "../../../database/common/blocked_users.model";
import { BlockedUserUtil } from "../../../utils/blockeduser.util";
import { ConversationUtil } from "../../../utils/conversation.util";
import { MessageModel, MessageType } from "../../../database/common/messages.schema";


export const updateAccount = async (
  req: any,
  res: Response,
) => {

  try {
    const {
      firstName,
      lastName,
      location,
      phoneNumber,
      profilePhoto,
      language
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const customerId = req.customer.id;
    const customer = await CustomerModel.findOne({ _id: customerId });
    if (!customer) {
      return res.status(401).json({ success: false, message: "Account not found" });
    }

    const updatedCustomer = await CustomerModel.findOneAndUpdate(
      { _id: customerId },
      {
        firstName,
        lastName,
        phoneNumber,
        location,
        profilePhoto,
        language
      },
      { new: true, upsert: true }
    )
    AccountEvent.emit('ACCOUNT_UPDATED', {user: updatedCustomer, userType: 'customers' })

    return res.status(200).json({ success: true, message: "Customer account successfully updated", data: updatedCustomer });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}



export const getAccount = async (req: any, res: Response) => {
  try {
    const customerId = req.customer.id;

    let includeStripeIdentity = false;
    let includeStripeCustomer = false;
    let includeStripePaymentMethods = false;

    // Parse the query parameter "include" to determine which fields to include
    if (req.query.include) {
      const includedFields = req.query.include.split(',');
      includeStripeIdentity = includedFields.includes('stripeIdentity');
      includeStripeCustomer = includedFields.includes('stripeCustomer');
      includeStripePaymentMethods = includedFields.includes('stripePaymentMethods');
    }


    // Try to find the customer in the database
    const customer = await CustomerModel.findById(customerId);

    // Check if the customer exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }


    //@ts-ignore
    const customerResponse = customer.toJSON({ includeStripeIdentity: true, includeStripeCustomer: true, includeStripePaymentMethods: true });


    return res.status(200).json({ success: true, message: 'Customer account retrieved successfully', data: customerResponse });
  } catch (err: any) {
    // Handle errors
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



export const changePassword = async (
  req: any,
  res: Response,
) => {

  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const customerId = req.customer.id;

    // Retrieve the user from the database
    const customer = await CustomerModel.findById(customerId);

    // Check if the user exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the current password matches
    const isPasswordValid = await bcrypt.compare(currentPassword, customer.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    customer.password = hashedPassword;
    await customer.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

}

export const myDevices = async (
  req: any,
  res: Response,
) => {

  try {

    const customerId = req.customer.id;

    // Retrieve the user from the database
    const customer = await CustomerModel.findById(customerId);

    // Check if the user exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const devices = await CustomerDeviceModel.find({ customer: customerId })
    return res.json({ success: true, message: 'Customer devices retrieved', data: devices });
  } catch (error: any) {
    console.error('Error retrieving contractor devices:', error);
    return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
  }

}

export const updateOrCreateDevice = async (
  req: any,
  res: Response,
) => {

  try {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { deviceId, deviceType, deviceToken, expoToken, appVersion } = req.body;

    const customerId = req.customer.id;

    // Retrieve the user from the database
    const customer = await CustomerModel.findById(customerId);

    // Check if the user exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const device = await CustomerDeviceModel.find({ deviceId, deviceToken, expoToken });
    if (device) {
      //return res.status(404).json({ success: false, message: 'Device already exits' });
    }


    // Find the customer device with the provided device ID and type
    let customerDevice = await CustomerDeviceModel.findOneAndUpdate(
      { customer: customerId, deviceId },
      { $set: { deviceToken, deviceType, expoToken, appVersion, customer: customerId, deviceId } },
      { new: true, upsert: true }
    );

    return res.json({ success: true, message: 'Customer device updated', data: customerDevice });
  } catch (error: any) {
    console.error('Error creating or updating customer device:', error);
    return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
  }

}



export const deleteAccount = async (
  req: any,
  res: Response,
) => {

  try {
    const customerId = req.customer.id;

    const account = await CustomerModel.findOne({ _id: customerId });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // perform checks here
    const bookedJobs = await JobModel.find({ customer: customerId, status: { $in: [JOB_STATUS.BOOKED] } })
    if (bookedJobs.length > 0) {
      return res.status(400).json({ success: false, message: 'You have an active Job, account cannot be deleted', data: bookedJobs });
    }

    const disputedJobs = await JobModel.find({ customer: customerId, status: { $in: [JOB_STATUS.DISPUTED] } })
    if (disputedJobs.length > 0) {
      return res.status(400).json({ success: false, message: 'You have an pending dispute, account cannot be deleted', data: disputedJobs });
    }

    const ongoingJobs = await JobModel.find({ customer: customerId, status: { $in: [JOB_STATUS.ONGOING] } })
    if (ongoingJobs.length > 0) {
      return res.status(400).json({ success: false, message: 'You have  ongoing jobs, account cannot be deleted', data: ongoingJobs });
    }


    await CustomerModel.deleteById(customerId)

    account.email = `${account.email}:${account.id}`
    account.deletedAt = new Date()
    account.phoneNumber = { code: "+", number: account.id, verifiedAt: null }

    account.firstName = 'Deleted'
    account.lastName = 'Account'
    account.profilePhoto = { url: "https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png" }

    await account.save()

    AccountEvent.emit('ACCOUNT_DELETED', account)
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err: any) {
    console.log('error', err);
    res.status(500).json({ success: false, message: err.message });
  }

}


export const signOut = async (
  req: any,
  res: Response,
) => {

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token not provided' });
    }

    await BlacklistedToken.create({ token });
    res.json({ success: true, message: 'Sign out successful' });
  } catch (err: any) {
    console.log('error', err);
    res.status(500).json({ success: false, message: err.message });
  }

}


export const submitFeedback = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customerId = req.customer.id;
    const {
      media,
      remark,
    } = req.body

    const feedback = await FeedbackModel.create({ user: customerId, userType: 'customers', media, remark });
    const user = await CustomerModel.findById(customerId);
    AdminEvent.emit('NEW_FEEDBACK', { feedback, user })
    res.json({ success: true, message: 'Feedback submitted' });
  } catch (err: any) {
    next(new InternalServerError("An error occurred", err))
  }
}



export const submitReport = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reported, type = ABUSE_REPORT_TYPE.ABUSE, comment } = req.body;
    const customerId = req.customer.id
    const { reporter, reporterType, reportedType } = { reporter: customerId, reporterType: 'customers', reportedType: 'contractors' }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
    }

    // Create a new report
    const newReport = new AbuseReportModel({
      reporter,
      reporterType,
      reported,
      reportedType,
      type,
      comment,
    });

    // Save the report to the database
    const savedReport = await newReport.save();
    AccountEvent.emit('ACCOUNT_REPORTED', {report: savedReport})

    return res.status(201).json({ success: true, message: 'Report successfully created', data: savedReport });
  } catch (err: any) {
    return next(new InternalServerError('Error occurred creating report', err));
  }
}


export const blockUser = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
 
  try {
    const { contractorId, reason = BLOCK_USER_REASON.ABUSE, comment } = req.body;
    const customerId = req.customer.id

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
    }

     // perform checks here
     const bookedJobs = await JobModel.find({ customer: customerId, contractor: contractorId, status: { $in: [JOB_STATUS.BOOKED] } })
     if (bookedJobs.length > 0) {
       return res.status(400).json({ success: false, message: 'You have an active Job, contractor cannot be blocked', data: bookedJobs });
     }
 
     const disputedJobs = await JobModel.find({ customer: customerId, contractor: contractorId, status: { $in: [JOB_STATUS.DISPUTED] } })
     if (disputedJobs.length > 0) {
       return res.status(400).json({ success: false, message: 'You have an pending dispute, contractor cannot be blocked', data: disputedJobs });
     }
 
     const ongoingJobs = await JobModel.find({ customer: customerId, contractor: contractorId, status: { $in: [JOB_STATUS.ONGOING] } })
     if (ongoingJobs.length > 0) {
       return res.status(400).json({ success: false, message: 'You have  ongoing jobs, contractor cannot be blocked', data: ongoingJobs });
     }

     const {isBlocked, block} = await BlockedUserUtil.isUserBlocked({customer:customerId, contractor: contractorId})
       if(isBlocked){
          return res.status(400).json({ success: false, message: `User is already blocked by ${block?.blockedBy}` });
       }

      await BlockedUserModel.findOneAndUpdate({ contractor: contractorId,  customer: customerId }, {
        contractor: contractorId,
        customer: customerId,
        blockedBy: 'customer',
        reason: reason
      }, { upsert: true, new: true })
   
      // Send a message to the customer
      const conversation = await ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')
      const message = new MessageModel({
        conversation: conversation?._id,
        sender: contractorId,
        senderType: 'contractors',
        message: "Conversation locked by customer",
        messageType: MessageType.ALERT,
      });
      await message.save();
      ConversationEvent.emit('NEW_MESSAGE', { message })


      
    return res.status(201).json({ success: true, message: 'Contractor successfully blocked' });
  } catch (err: any) {
    return next(new InternalServerError('Error occurred while blocking contractor', err));
  }
}



export const unBlockUser = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { contractorId, reason = BLOCK_USER_REASON.ABUSE, comment } = req.body;
    const customerId = req.customer.id

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation error occurred', errors: errors.array() });
    }

    const {isBlocked, block} = await BlockedUserUtil.isUserBlocked({customer:customerId, contractor: contractorId})
    if(block && block.blockedBy == 'contractor'){
      return res.status(400).json({ success: false, message: 'Unable to unblock'});
    }
    await BlockedUserModel.findOneAndDelete({customer: customerId, contractor: contractorId, blockedBy: 'customer'})


    const conversation = await ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractorId, 'contractors')
      const message = new MessageModel({
        conversation: conversation?._id,
        sender: customerId,
        senderType: 'customers',
        message: "Conversation unlocked by customer",
        messageType: MessageType.ALERT,
      });
      await message.save();
      ConversationEvent.emit('NEW_MESSAGE', { message })


    return res.status(200).json({ success: true, message: 'Contractor successfully unblocked' });
  } catch (err: any) {
    return next(new InternalServerError('Error occurred while  unblocking contractor', err));
  }
}



export const CustomerController = {
  changePassword,
  updateAccount,
  getAccount,
  updateOrCreateDevice,
  myDevices,
  deleteAccount,
  signOut,
  submitFeedback,
  submitReport,
  blockUser,
  unBlockUser
}
