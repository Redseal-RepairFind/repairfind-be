import { Schema, model } from "mongoose";
import { AdminStatus, IAdmin } from "../interface/admin.interface";

const AdminSchema = new Schema(
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
      hasWeakPassword: {
        type: Boolean,
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
      phoneNumber: {
        type: String,
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
      profilePhoto: {
        type: Object,
        default: {
          url: 'https://ipalas3bucket.s3.us-east-2.amazonaws.com/avatar.png'
        }
      },
      permissions: {
        type: Array<String>
      },
      status: {
        type: String,
        enum: Object.values(AdminStatus),
        required: true,
        default: AdminStatus.PENDING,
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
  
  AdminSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

  const AdminModel = model<IAdmin>("admins", AdminSchema);
  
  export default AdminModel;