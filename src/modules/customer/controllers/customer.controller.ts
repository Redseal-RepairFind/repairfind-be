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
      profilePhoto
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
        profilePhoto
      },
      { new: true }
    )
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



    //TODO: for now always update the meta data of stripe customer with this email address
    
    // const stripeCustomer = await StripeService.customer.getCustomer({email: customer.email});
    // if (customer.stripeCustomer && stripeCustomer) {
    //   StripeService.customer.updateCustomer(customer.stripeCustomer.id, {
    //     metadata: { userType: 'customers', userId: customerId }
    //   })

    //   const stripe_customer =  castPayloadToDTO(stripeCustomer, stripeCustomer as IStripeCustomer)
    //   console.log(stripe_customer)
    //   // customer.save()
      
    // } else {
     
    //   await StripeService.customer.createCustomer({
    //     email: customer.email,
    //     metadata: {
    //       userType: 'customers',
    //       userId: customer.id,
    //     },
    //     name: `${customer.firstName} ${customer.lastName} `,
    //     phone: `${customer.phoneNumber.code}${customer.phoneNumber.number} `,
    //   })
    // }

    // //TODO: retrieve existing customer payment methods from stripe here - will move all this to scheduler jobs
    // const paymentMethods = await StripeService.payment.listPaymentMethods({customer: customer.stripeCustomer.id})
    // // console.log(paymentMethods)
    // if(paymentMethods){
    //   //@ts-ignore
    //   customer.stripePaymentMethods = paymentMethods.data
    // }


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
    const { deviceId, deviceType, deviceToken } = req.body;

    const customerId = req.customer.id;

    // Retrieve the user from the database
    const customer = await CustomerModel.findById(customerId);

    // Check if the user exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const device = await CustomerDeviceModel.find({ deviceId, deviceToken });
    if (device) {
      //return res.status(404).json({ success: false, message: 'Device already exits' });
    }

 
    // Find the customer device with the provided device ID and type
    let customerDevice = await CustomerDeviceModel.findOneAndUpdate(
      { customer: customerId, deviceToken: deviceToken },
      { $set: { deviceToken, deviceType, customer: customerId } },
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

    const account = await CustomerModel.findOne({_id:customerId});
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // perform checks here
    const bookedAndDisputedJobs = await JobModel.find({customer: customerId, status: {$in: [JOB_STATUS.BOOKED, JOB_STATUS.DISPUTED ] }})
    if(bookedAndDisputedJobs.length > 0){
      return res.status(400).json({ success: false, message: 'You have an active Job, acount cannot be deleted' });
    }

    await CustomerModel.deleteById(customerId)

    account.email = `${account.email}:${account.id}`
    account.deletedAt = new Date()
    await account.save()

    
    res.json({success: true, message: 'Account deleted successfully'});
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
    const customerId = req.customer.id;
    const customer = await CustomerModel.findOne({ _id: customerId });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }

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
    AdminEvent.emit('NEW_FEEDBACK', {feedback, user})
    res.json({ success: true, message: 'Feedback submitted' });
  } catch (err: any) {
    next(new InternalServerError("An error occurred", err))
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
  submitFeedback
}
