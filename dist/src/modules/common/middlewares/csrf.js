"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var csurf_1 = __importDefault(require("csurf"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var csrfProtection = (0, csurf_1.default)({ cookie: true });
var csrfMiddleware = function (app) {
    app.use((0, cookie_parser_1.default)());
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
exports.default = csrfMiddleware;
