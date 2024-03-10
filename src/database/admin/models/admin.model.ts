import { Schema, model } from "mongoose";
import { IAdmin } from "../interface/adminReg.interface";

const AdminRegSchema = new Schema(
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
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      superAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      validation: {
        type: Boolean,
        required: true,
        default: false,
      },
      image: {
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
    
    },
    {
      timestamps: true,
    }
  );
  
  const AdminModel = model<IAdmin>("admins", AdminRegSchema);
  
  export default AdminModel;