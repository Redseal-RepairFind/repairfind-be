import { Schema, model } from "mongoose";
import { ICustomerRating } from "../interface/customerRating.interface";

const CustomerRatingSchema = new Schema(
    {
        customerId: {
        type: Schema.Types.ObjectId, ref: 'CustomerReg',
        required: true,
      },
      rate: [
        {
            contractorId: { type: String, },
            jobId: { type: String, },
            environment: { type: Number, },
            receptive: { type: Number, },
            courteous: { type: Number, },
            environmentText: { type: String, },
            receptiveText: { type: String, },
            courteousText: { type: String, },
        }
      ],
      avgEnvironment: {
        type: Number,
        required: true,
      },
      avgReceptive: {
        type: Number,
        required: true,
      },
      avgCourteous: {
        type: Number,
        required: true,
      },
      avgRating: {
        type: Number,
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
  
  const CustomerRatingModel = model<ICustomerRating>("CustomerRating", CustomerRatingSchema);
  
  export default CustomerRatingModel;