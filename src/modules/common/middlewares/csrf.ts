import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction, Application } from 'express';

const csrfProtection = csrf({ cookie: true });

const csrfMiddleware = (app: Application) => {
    app.use(cookieParser());
    // app.use(csrfProtection);


    // app.use((req: Request, res: Response, next: NextFunction) => {
    //     if (req.csrfToken) {
    //         const csrfToken = req.csrfToken();
    //         res.cookie('csrf-token', csrfToken, { httpOnly: false });
    //     }
    //     next();
    // });

    // // Custom error handling for CSRF token validation errors
    // app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    //     if (err.code === 'EBADCSRFTOKEN') {
    //         res.status(403).json({ success: false, message: 'Invalid CSRF token' });
    //     } else {
    //         // Pass other errors to the default Express error handler
    //         next(err);
    //     }
    // });


};

export default csrfMiddleware;
