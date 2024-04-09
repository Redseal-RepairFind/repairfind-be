import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import CustomerModel from "../../../database/customer/models/customer.model";
import { sendPushNotifications } from "../../../services/expo";
import CustomerDeviceModel from "../../../database/customer/models/customer_devices.model";
import { transferFileToS3 } from "../../../services/storage";
import { StripeService } from "../../../services/stripe";


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
    if (customer.stripeCustomer) {
      StripeService.customer.updateCustomer(customer.stripeCustomer.id, {
        metadata: { userType: 'customer', userId: customerId }
      })
    } else {
      StripeService.customer.createCustomer({
        email: customer.email,
        metadata: {
          userType: 'customer',
          userId: customer.id,
        },
        name: `${customer.firstName} ${customer.lastName} `,
        phone: `${customer.phoneNumber.code}${customer.phoneNumber.number} `,
      })
    }

    //@ts-ignore
    const customerResponse = customer.toJSON({ includeStripeIdentity: true, includeStripeCustomer: true, includeStripePaymentMethods: true });


    return res.status(200).json({ success: true, message: 'Customer account retrieved successfully', data: customerResponse });
  } catch (err: any) {
    // Handle errors
    console.error('Error fetching customer account:', err);
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


    // Find the contractor device with the provided device ID and type
    let customerDevice = await CustomerDeviceModel.findOneAndUpdate(
      { customer: customerId, deviceId: deviceId },
      { $set: { deviceToken, deviceId, deviceType, } },
      { new: true, upsert: true }
    );

    return res.json({ success: true, message: 'Customer device updated', data: customerDevice });
  } catch (error: any) {
    console.error('Error creating or updating customer device:', error);
    return res.status(error.code ?? 500).json({ success: false, message: error.message ?? 'Internal Server Error' });
  }

}


export const CustomerController = {
  changePassword,
  updateAccount,
  getAccount,
  updateOrCreateDevice,
  myDevices
}
