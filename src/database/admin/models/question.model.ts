import { Schema, model } from "mongoose";
import { IQuestion } from "../interface/question.interface";

const QuestionSchema = new Schema(
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      answer: {
        type: [String],
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
  
  const QuestionModel = model<IQuestion>("question", QuestionSchema);
  
  export default QuestionModel;