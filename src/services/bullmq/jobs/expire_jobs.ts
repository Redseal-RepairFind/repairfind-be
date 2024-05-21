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
                const createdAt = job.createdAt.getTime();
                const elapsedDays = Math.floor((Date.now() - createdAt) / (1000 * 60 * 60 * 24)); // Calculate elapsed days
                
                if (elapsedDays >= job.expiresIn) {
                    job.status = JOB_STATUS.EXPIRED;
                    await job.save();
                    Logger.info(`Successfully expired job: ${job.id}`);
                }
            } catch (error) {
                Logger.error(`Error expiring job: ${job.id}`, error);
            }
        }
    } catch (error) {
        Logger.error('Error occurred while expiring job:', error);
    }
};

