import { Document, Types, ObjectId } from "mongoose";
import { IJob } from "../../contractor/interface/job.interface";

export interface ICustomerRatedJob extends Document {
  _id: ObjectId;
  jobId: IJob['_id'];
  createdAt: Date;
  updatedAt: Date;
}
