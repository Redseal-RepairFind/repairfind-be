import { validationResult } from "express-validator";
import { Request, Response } from "express";
import QuestionModel from "../../../database/admin/models/question.model";
import ContractorRegModel from "../../../database/contractor/models/contractor.model";
import ContractorQuizModel from "../../../database/contractor/models/contractorQuiz.model";


//contractor  start quiz
export const contractorStartQuizController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorRegModel.findOne({_id: contractorId});

      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      const checkTakeTestAlready = await ContractorQuizModel.find({contractorId});

      if (checkTakeTestAlready.length > 0) {
        return res
          .status(401)
          .json({ message: "test already taken" });
      }

      // Fetch the total count of questions in the collection
      const totalQuestion = await QuestionModel.countDocuments();

      let randomSkip = Math.floor(Math.random() * totalQuestion);

      if (randomSkip > 10) {
        randomSkip = 10
      }

      const randomQuestions = await QuestionModel.find().limit(10).skip(randomSkip);

      for (let i = 0; i < randomQuestions.length; i++) {
        const randomQuestion = randomQuestions[i];

        const newQuiz = new ContractorQuizModel({
            contractorId: contractorId,
            questionId: randomQuestion._id,
        })

        await newQuiz.save()
        
      }
      

      res.json({  
        message: "you can proceed to load question"
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//contractor  load question
export const contractionLoadtQuestionController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorRegModel.findOne({_id: contractorId});

      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      const checkTakeTestAlready = await ContractorQuizModel.find({contractorId});  

      if (checkTakeTestAlready.length < 1) {
        return res
          .status(401)
          .json({ message: "start the quiz first" });
      }

      let questions = []

      for (let i = 0; i < checkTakeTestAlready.length; i++) {
        const test = checkTakeTestAlready[i];

        const question = await QuestionModel.findOne({_id: test.questionId})

        if (!question) continue

        const obj = {
            test,
            question,
        }

        questions.push(obj)
        
      }
      
      res.json({  
        questions
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//contractor  answer question
export const contractionAnwerQuestionController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        quizId,
        answer
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorRegModel.findOne({_id: contractorId});

      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      const checkTakeTestAlready = await ContractorQuizModel.find({contractorId});  

      if (checkTakeTestAlready.length < 1) {
        return res
          .status(401)
          .json({ message: "start the quiz first" });
      }

      const quiz = await ContractorQuizModel.findOne({_id: quizId})

      if (!quiz) {
        return res
          .status(401)
          .json({ message: "incorrect quiz ID" });
      }

      const Question = await QuestionModel.findOne({_id: quiz.questionId})

      if (!Question) {
        return res
          .status(401)
          .json({ message: "incorrect quiz ID" });
      }

      let mark = 'fail'

      const compareAnswer = areArraysEqualUnordered(answer, Question.answer)

      if (compareAnswer) {
        mark = 'pass'
      }

      quiz.mark = mark
      quiz.answer = answer
      quiz.answered = 'yes'

      await quiz.save()
       
      
      res.json({  
        message: 'answer saved'
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//contractor  get quiz result
export const contractionGetQuizRrsultController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      
      const contractor =  req.contractor;
      const contractorId = contractor.id
  
      //get user info from databas
      const contractorExist = await ContractorRegModel.findOne({_id: contractorId});

      if (!contractorExist) {
        return res
          .status(401)
          .json({ message: "invalid credential" });
      }

      const checkTakeTestAlready = await ContractorQuizModel.find({contractorId});  

      if (checkTakeTestAlready.length < 1) {
        return res
          .status(401)
          .json({ message: "start the quiz first" });
      }

      const totalPass = await ContractorQuizModel.countDocuments({contractorId, mark: "pass"})

      const totalQustion = await ContractorQuizModel.countDocuments({contractorId,})
       
      
      res.json({  
        totalPass,
        totalQustion
     });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



function areArraysEqualUnordered(arr1: any, arr2: any) {
    if (arr1.length !== arr2.length) {
      return false;
    }
  
    const countMap = new Map();
  
    // Count occurrences in arr1
    arr1.forEach((item: any) => {
      countMap.set(item, (countMap.get(item) || 0) + 1);
    });
  
    // Decrement occurrences in arr2
    arr2.forEach((item: any) => {
      const count = countMap.get(item);
      if (!count) {
        return false; // item not found in arr1
      }
  
      if (count === 1) {
        countMap.delete(item);
      } else {
        countMap.set(item, count - 1);
      }
    });
  
    return countMap.size === 0;
  }

