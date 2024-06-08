import { Schema, model } from "mongoose";
import { IPermission } from "../interface/permission.interface";

const PermissionSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      }, 
    },
    {
      timestamps: true,
    }
  );
  
  const PermissionModel = model<IPermission>("permissions", PermissionSchema);
  
  export default PermissionModel;