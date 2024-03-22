import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { ContractorModel } from "../../../database/contractor/models/contractor.model";
import JobModel from "../../../database/customer/models/job.model";
import { uploadDifferentTypeToS3, uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";

//customer sent job request controller /////////////
export const customerSendJobRequestController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        contractorId,
        jobDescription,
        jobLocation,
        date,  
      } = req.body;
  
        const { skill } = req.query;
        const files = req.files;
    
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const customer =  req.customer;
        const customerId = customer.id

        const contractor = await ContractorModel.findOne({_id: contractorId})

        if (!contractor) {
            return res
            .status(401)
            .json({ success: false, message: "invlid contractorID" });
        }

        let voiceDescription = ''
        let jobImg = []

        if (!files) {
            voiceDescription = ''
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
           
            if (file.fieldname == 'voiceDescription') {
                const filename = uuidv4();
                const result = await uploadDifferentTypeToS3(file.buffer, `${filename}.mp3`, 'audio/mp3');
                voiceDescription = result?.Location!;         
            }else{
                const filename = uuidv4();
                const result = await uploadDifferentTypeToS3(file.buffer, `${filename}.jpg`, 'image/jpeg');
                jobImg.push(result?.Location!);
            }

        }

        const newJob= new JobModel({
            customerId,
            contractorId,
            jobDescription,
            voiceDescription,
            jobLocation,
            date,
            jobImg,
        })

        const saveDJob = await newJob.save()
    
        res.json({  
            success: true,
            message: "Job listed successful",
            data: saveDJob
        });
      
    } catch (err: any) {
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}

export const JobRequest = {
    customerSendJobRequestController,
}