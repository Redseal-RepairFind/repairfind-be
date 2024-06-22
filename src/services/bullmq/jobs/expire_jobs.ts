import { CertnService } from "../..";
import { IJob, JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { IContractor, IContractorCertnDetails } from "../../../database/contractor/interface/contractor.interface";
import { Logger } from "../../logger";




export const expireJobs = async () => {
    try {
        const jobs = await JobModel.find({
            status: { $in: ['PENDING'] },
        }) as IJob[];

        for (const job of jobs) {
            try {           
                if (job.expiresIn <= 0) {
                    job.status = JOB_STATUS.EXPIRED;
                }

                await job.save();
            } catch (error) {
                Logger.error(`Error processing job expiration for job: ${job.id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error occurred while expiring jobs:', error);
    }
};


