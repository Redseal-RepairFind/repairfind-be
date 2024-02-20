import { Schema, model } from "mongoose";
import { ICustomerReg } from "../interface/customerReg.interface";

const CustomerRegSchema = new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      fullName: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        default: "",
      },
      profileImg: {
        type: String,
        default: "",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }, 
      passwordOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
      phoneNumberOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
      },
    
    },
    {
      timestamps: true,
    }
  );
  
  const CustomerREgrModel = model<ICustomerReg>("CustomerReg", CustomerRegSchema);
  
  export default CustomerREgrModel;