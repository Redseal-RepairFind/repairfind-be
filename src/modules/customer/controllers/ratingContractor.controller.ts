import { validationResult } from "express-validator";
import { Request, Response } from "express";
import {ContractorModel} from "../../../database/contractor/models/contractor.model";
import CustomerRegModel from "../../../database/customer/models/customerReg.model";
import ContractorRatingModel from "../../../database/contractor/models/contractorRating.model";
import CustomerRatedJobModel from "../../../database/customer/models/customerRatedJob.mdel";
import JobModel from "../../../database/contractor/models/job.model";
import CustomerRatingModel from "../../../database/customer/models/customerRating.model";


//customer  rate contractor
export const customerRateContractorController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        jobId,
        cleanliness,
        timeliness,
        skill,
        communication,
        courteous,
        cleanlinessText,
        timelinessText,
        skillText,
        communicationText,
        courteousText,
      } = req.body;
  
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      
      const customer =  req.customer;
      const customerId = customer.id

      const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

      if (!checkCustomer) {
        return res
          .status(401)
          .json({ message: "incorrect Customer ID" });
      }

      const job = await JobModel.findOne({_id: jobId, customerId})
      if (!job) {
        return res
          .status(401)
          .json({ message: "invalid job ID" });
      }

      const ratedJob = await CustomerRatedJobModel.findOne({jobId})
      if (ratedJob) {
        return res
          .status(401)
          .json({ message: "you have rated this contractor already" });
      }

      const ratingContractor = await ContractorRatingModel.findOne({contractorId: job.contractorId});

      if (!ratingContractor) {
        const avgRating = Math.round(((cleanliness + timeliness + skill + communication + courteous) / 25 ) * 5);
        
        const newRatingContractor = new ContractorRatingModel({
            contractorId: job.contractorId,
            rate: [
                {
                  customerId,
                  jobId,
                  cleanliness,
                  timeliness,
                  skill,
                  communication,
                  courteous,
                  cleanlinessText,
                  timelinessText,
                  skillText,
                  communicationText,
                  courteousText,
                }
            ],
            avgCleanliness: cleanliness,
            avgTimeliness: timeliness,
            avgSkill: skill,
            avgCommunication: communication,
            avgCourteous: courteous,
            avgRating
        })
        await newRatingContractor.save();

        const newRatedJob = new CustomerRatedJobModel({
            jobId
        })
        await newRatedJob.save()

        res.json({  
            message: "contractor successful rated"
         });

      }else{
        const ratings = [...ratingContractor.rate, 
            {
              customerId,
              jobId,
              cleanliness,
              timeliness,
              skill,
              communication,
              courteous,
              cleanlinessText,
              timelinessText,
              skillText,
              communicationText,
              courteousText,
            }
        ]

        let totalCleanliness = 0;
        let totalTimeliness = 0;
        let totalSkill = 0;
        let totalCommunication = 0;
        let totalCourteous = 0;

        for (let i = 0; i < ratings.length; i++) {
            const rating = ratings[i];

            totalCleanliness = totalCleanliness + rating.cleanliness;
            totalTimeliness = totalTimeliness + rating.timeliness;
            totalSkill = totalSkill + rating.skill;
            totalCommunication = totalCommunication + rating.communication;
            totalCourteous = totalCourteous + rating.courteous;
        }

        const avgCleanliness = Math.round(totalCleanliness / ratings.length)
        const avgTimeliness = Math.round(totalTimeliness / ratings.length)
        const avgSkill = Math.round(totalSkill / ratings.length)
        const avgCommunication = Math.round(totalCommunication / ratings.length)
        const avgCourteous = Math.round(totalCourteous / ratings.length)

        const avgRating = Math.round(((avgCleanliness + avgTimeliness + avgSkill + avgCommunication + avgCourteous) / 25) * 5);

        ratingContractor.rate = ratings;
        ratingContractor.avgCleanliness = avgCleanliness
        ratingContractor.avgTimeliness = avgTimeliness;
        ratingContractor.avgSkill = avgSkill;
        ratingContractor.avgCommunication = avgCommunication;
        ratingContractor.avgCourteous = avgCourteous;
        ratingContractor.avgRating = avgRating
        await ratingContractor.save();

        const newRatedJob = new CustomerRatedJobModel({
            jobId
        })
        await newRatedJob.save()

        res.json({  
            message: "contractor successful rated"
        });
      }
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



// customer rating
export const customerRatingDetailController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        
      } = req.body;
  
         // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        
        const customer =  req.customer;
        const customerId = customer.id

        const checkCustomer = await CustomerRegModel.findOne({_id: customerId})

        if (!checkCustomer) {
            return res
            .status(401)
            .json({ message: "incorrect Customer ID" });
        }


        const customerRating = await CustomerRatingModel.findOne({customerId});
        if (!customerRating) {
            return res
            .status(401)
            .json({ message: "no ratig found" });
        }

        res.json({  
            customerRating
        });
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}

