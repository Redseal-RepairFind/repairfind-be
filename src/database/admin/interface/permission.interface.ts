import { Document, Types, ObjectId } from "mongoose";

export interface IPermission extends Document {
  _id: ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
