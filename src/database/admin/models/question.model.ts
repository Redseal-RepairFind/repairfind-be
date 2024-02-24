import mongoose, { ObjectId, Schema, model } from "mongoose";


export interface IQuestion extends Document {
  _id: ObjectId;
  quiz: ObjectId;
  question: string;
  options: string[];
  answer: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema(
    {
      quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quiz'
      },
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