import { validationResult } from "express-validator";
import { Request, Response } from "express";
import ContractorRegModel from "../../../database/contractor/models/contractor.model";
import CustomerRatingModel from "../../../database/customer/models/customerRating.model";
import ContractorRatedJobModel from "../../../database/contractor/models/contractorRatedJob.model";
import JobModel from "../../../database/contractor/models/job.model";
import ContractorRatingModel from "../../../database/contractor/models/contractorRating.model";

//contractor  rate customer
export const contractorRateCustomerController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let {  
        jobId,
        environment,
        receptive,
        courteous,
        environmentText,
        receptiveText,
        courteousText
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

      const job = await JobModel.findOne({_id: jobId, contractorId})
      if (!job) {
        return res
          .status(401)
          .json({ message: "invalid job ID" });
      }

      const ratedJob = await ContractorRatedJobModel.findOne({jobId})
      if (ratedJob) {
        return res
          .status(401)
          .json({ message: "you have rated this customer already" });
      }

      const ratingCustumer = await CustomerRatingModel.findOne({customerId: job.customerId});

      if (!ratingCustumer) {
        const avgRating = Math.round(((environment + receptive + courteous) / 15 ) * 5);
        
        const newRatingCustomer = new CustomerRatingModel({
            customerId: job.customerId,
            rate: [
                {
                    contractorId,
                    jobId,
                    environment,
                    receptive,
                    courteous,
                    environmentText,
                    receptiveText,
                    courteousText,
                }
            ],
            avgEnvironment: environment,
            avgReceptive: receptive,
            avgCourteous: courteous,
            avgRating
        })
        await newRatingCustomer.save();

        const newRatedJob = new ContractorRatedJobModel({
            jobId
        })
        await newRatedJob.save()

        res.json({  
            message: "customer successful rated"
         });

      }else{
        const ratings = [...ratingCustumer.rate, 
            {
                contractorId,
                jobId,
                environment,
                receptive,
                courteous,
                environmentText,
                receptiveText,
                courteousText,
            }
        ]

        let totalEnvironment = 0;
        let totalReceptive = 0;
        let totalCourteous = 0;

        for (let i = 0; i < ratings.length; i++) {
            const rating = ratings[i];

            totalEnvironment = totalEnvironment + rating.environment;
            totalReceptive = totalReceptive + rating.receptive;
            totalCourteous = totalCourteous + rating.courteous;
        }

        const avgEnvironment = Math.round(totalEnvironment / ratings.length);
        const avgReceptive = Math.round(totalReceptive / ratings.length)
        const avgCourteous = Math.round(totalCourteous / ratings.length)

        const avgRating = Math.round(((avgEnvironment + avgReceptive + avgCourteous) / 15) * 5);

        ratingCustumer.rate = ratings;
        ratingCustumer.avgEnvironment = avgEnvironment;
        ratingCustumer.avgReceptive = avgReceptive;
        ratingCustumer.avgCourteous = avgCourteous;
        ratingCustumer.avgEnvironment = avgRating;
        await ratingCustumer.save();

        const newRatedJob = new ContractorRatedJobModel({
            jobId
        })
        await newRatedJob.save()

        res.json({  
            message: "customer successful rated"
        });
      }
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}


//contractor rating detail
export const contractorRatingDetailController = async (
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

    
    const contractor =  req.contractor;
    const contractorId = contractor.id

    //get user info from databas
    const contractorExist = await ContractorRegModel.findOne({_id: contractorId});

    if (!contractorExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const contractorRating = await ContractorRatingModel.findOne({contractorId});
    if (!contractorRating) {
      return res
        .status(401)
        .json({ message: "no rating foung" });
    }

    res.json({  
        message: "customer successful rated"
    });
   
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}