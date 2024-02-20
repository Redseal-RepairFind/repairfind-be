import { Document, Types, ObjectId } from "mongoose";

export interface IQuestion extends Document {
  _id: ObjectId;
  question: string;
  options: string[];
  answer: string[];
  createdAt: Date;
  updatedAt: Date;
}
