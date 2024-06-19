
import { QueueService } from "../../../services/bullmq";
import { config } from "../../../config";
import { Request, Response } from "express";


export const clearQueue = async (req: Request, res: Response,) => {
    const queueName = config.redis.queueName
    try {
        const queue = QueueService.getQueue(queueName);
        if (!queue) return;
        await queue.obliterate();
        console.log(`Queue ${queueName} cleared successfully.`);
        await QueueService.restartQueue(); // Restart the queue after clearing
        
    } catch (error) {
        console.error('Error clearing the queue:', error);
    } finally {
        return res.json({
            success: true,
            message: `${queueName} queue cleared successfully`
        })
    }
}


export const CliController = {
    clearQueue,
};
