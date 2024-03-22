import { validationResult } from "express-validator";
import { Request, Response } from "express";
import CustomerModel from "../../../database/customer/models/customer.model";
import CustomerJobListingModel from "../../../database/customer/models/customerJobListing.interface";
import { uploadDifferentTypeToS3, uploadToS3 } from "../../../utils/upload.utility";
import { v4 as uuidv4 } from "uuid";

//customer list new job controller /////////////
export const customerListNewJobController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {  
        jobCategory,
        jobDescription,
        jobLocation,
        date,
        jobExpiry,
        contractorType,
        emergency,
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

        let voiceDescription = ''
        let jobImg = ''

        if (!files) {
            voiceDescription = ''
            jobImg = ''

        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
           
            if (file.fieldname == 'voiceDescription') {
                const filename = uuidv4();
                const result = await uploadDifferentTypeToS3(file.buffer, `${filename}.mp3`, 'audio/mp3');
                voiceDescription = result?.Location!;         
            }

            if (file.fieldname == 'jobImg') {
                const filename = uuidv4();
                const result = await uploadDifferentTypeToS3(file.buffer, `${filename}.jpg`, 'image/jpeg');
                console.log('result', result)
                jobImg = result?.Location!;
            }

        }

        const newJobListing = new CustomerJobListingModel({
            customerId,
            jobCategory,
            jobDescription,
            voiceDescription,
            jobLocation,
            date,
            jobExpiry,
            contractorType,
            emergency,
            jobImg,
        })

        const saveDJobListing = await newJobListing.save()
    
        res.json({  
            success: true,
            message: "Job listed successful",
            data: saveDJobListing
        });
      
    } catch (err: any) {
      // signup error
      console.log("error", err)
      res.status(500).json({ message: err.message });
    }
  
}


export const JobListing = {
    customerListNewJobController,
}