import mongoose, { ObjectId, Schema, model } from "mongoose";


export interface IQuiz extends Document {
    _id: ObjectId;
    video_url: string;
    questions: Array<string>; // ids of questions
    createdAt: Date;
    updatedAt: Date;
  }

  
const QuizShema = new Schema <IQuiz>(
    {
        video_url: {
            type: String,
            required: true,
            // unique: true,
            // index: true
        },
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "question"
            }
        ],
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
  
  const QuizModel = model<IQuiz>("quizes", QuizShema);
  
  export default QuizModel;