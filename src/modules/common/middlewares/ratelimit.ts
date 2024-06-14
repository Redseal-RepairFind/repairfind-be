import { Application } from 'express';
import rateLimit from 'express-rate-limit';

const configureRateLimit = (app: Application) => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        headers: true, // Send custom rate limit headers with response
    });

    // Apply rate limiter middleware to all routes
    app.use(limiter);
};

export default configureRateLimit;
