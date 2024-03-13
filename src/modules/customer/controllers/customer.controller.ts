import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import CustomerModel from "../../../database/customer/models/customer.model";


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
      return res.status(401).json({success: false,  message: "Account not found" });
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
      {new: true}
    )
    return res.status(200).json({ success: true,  message: "Customer account successfully updated", data: updatedCustomer});
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}


export const getAccount = async (req: any, res: Response) => {
  try {
    const customerId = req.customer.id;

    // Try to find the customer in the database
    const customer = await CustomerModel.findById(customerId);

    // Check if the customer exists
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer account not found' });
    }
    

    return res.status(200).json({ success: true, message: 'Customer account retrieved successfully', data: customer });
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



export const CustomerController = {
    changePassword,  
    updateAccount,
    getAccount

}