import { validationResult } from "express-validator";
import { Request, Response } from "express";
import QuestionModel from "../../../database/admin/models/question.model";


//admin add question /////////////
export const AdminAddQuestionlController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        question,
        options,
        answer,
      } = req.body;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        const newQuestion = new QuestionModel({
            question,
            options,
            answer
        })

        await newQuestion.save()

      res.json({  
        message: "question successfully enterd"
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin get all question /////////////
export const AdminGetAllQuestionController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        page,
       limit
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        page = page || 1;
        limit = limit || 50;

        const skip = (page - 1) * limit;

        const questions = await QuestionModel.find()
        .skip(skip)
        .limit(limit);

        const totalQuestion = await QuestionModel.countDocuments()
            

      res.json({  
        questions,
        totalQuestion
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin get single question /////////////
export const AdminGetSingleQuestionController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        questionId
      } = req.query;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id

        const question = await QuestionModel.findOne({_id: questionId})

        if (!question) {
            return res
            .status(401)
            .json({ message: "invalid question ID" });
        }
        

      res.json({  
        question
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//admin edit question /////////////
export const AdminEditQuestionlController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        question,
        options,
        answer,
        questionId
      } = req.body;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id
        
        const questionDb = await QuestionModel.findOne({_id: questionId})

        if (!questionDb) {
            return res
            .status(401)
            .json({ message: "invalid question ID" });
        }

        questionDb.question = question;
        questionDb.options = options;
        questionDb.answer = answer

        await questionDb.save();

      res.json({  
        message: "question successfully updated"
      });
      
    } catch (err: any) {
      // signup error
      console.log("error",  err)
      res.status(500).json({ message: err.message });
    }
  
}



//admin Delete question /////////////
export const AdminDeleteQuestionlController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        questionId
      } = req.body;
  
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const admin =  req.admin;
        const adminId = admin.id
        
        const deleteQuestion = await QuestionModel.findOneAndDelete({_id: questionId}, {new: true})

        if (!deleteQuestion) {
            return res
            .status(401)
            .json({ message: "invalid question ID" });
        }

      res.json({  
        message: "question successfully deleted"
      });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


