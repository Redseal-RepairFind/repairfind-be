import { CertnService } from "../..";
import { IJob, JOB_STATUS, JobModel } from "../../../database/common/job.model";
import { IContractor, IContractorCertnDetails } from "../../../database/contractor/interface/contractor.interface";
import { Logger } from "../../../utils/logger";


export const expireJobs = async () => {
    try {
        const jobs = await JobModel.find({
            status: { $nin: ['EXPIRED', 'BOOKED'], $in: ['PENDING'] },
            expiresIn: { $gt: 0 }
        }) as IJob[];

        for (const job of jobs) {
            try {
                job.expiresIn -= 1; // Reduce expiresIn count by 1 each day
                
                if (job.expiresIn <= 0) {
                    job.status = JOB_STATUS.EXPIRED;
                }

                await job.save();
                Logger.info(`Successfully processed job expiration for job: ${job.id}`);
            } catch (error) {
                Logger.error(`Error processing job expiration for job: ${job.id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error occurred while expiring jobs:', error);
    }
};

