import { Schema, model } from "mongoose";
import { ISkillReg } from "../interface/skill.interface";

const SkillRegSchema = new Schema(
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
  
  const SkillRegrModel = model<ISkillReg>("SkillReg", SkillRegSchema);
  
  export default SkillRegrModel;