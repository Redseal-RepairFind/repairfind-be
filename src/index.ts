import express, {Request, Response, NextFunction } from "express";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import http from "http";


import contractorRoute from "./modules/contractor/routes/routes";
import adminRoute from "./modules/admin/routes/routes";
import customerRoute from "./modules/customer/routes/routes";
import commonRoute from "./modules/common/routes/routes";
import { RunSeeders } from "./database/seeders";
import { errorHandler } from "./utils/custom.errors";
import { Logger } from "./utils/logger";
import { QueueService } from "./services/bullmq";
import { RepairFindQueueWorker } from "./services/bullmq/worker";
import SocketIOService from "./services/socket/socketio";
import securityMiddleware from "./modules/common/middlewares/security";
import csrfMiddleware from "./modules/common/middlewares/csrf";
import sentryMiddleware from "./modules/common/middlewares/sentry";
import corsMiddleware from "./modules/common/middlewares/cors";
import configureParsers from "./modules/common/middlewares/parsers";
import configureRateLimit from "./modules/common/middlewares/ratelimit";


dotenv.config();
console.warn = Logger.warn.bind(Logger);
console.error = Logger.error.bind(Logger);
console.trace = Logger.trace.bind(Logger);
console.log = Logger.trace.bind(Logger);
console.info = Logger.trace.bind(Logger);

const app = express();
const server = http.createServer(app);

// Apply security-related middleware
securityMiddleware(app);

// Apply CSRF protection middleware
csrfMiddleware(app);

<<<<<<< HEAD
// Apply sentry middleware
sentryMiddleware(app)

// Apply cors middleware
corsMiddleware(app)
=======
// Sentry.init({
//   dsn: 'https://8225b8a1b7344717b059046c31def1ab@o4504391847116800.ingest.us.sentry.io/4507232502087680',

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });
>>>>>>> 3fbab43 (Testing deployement)

// Api rate limite
configureRateLimit(app)

<<<<<<< HEAD
// Parsers
configureParsers(app);
=======
// Sentry.init({
//   dsn: config.sentry.dsn,
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({ tracing: true }),
//     // enable Express.js middleware tracing
//     new Sentry.Integrations.Express({ app }),
//     nodeProfilingIntegration(),
//   ],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set sampling rate for profiling - this is relative to tracesSampleRate
//   profilesSampleRate: 1.0,
// });
>>>>>>> 3fbab43 (Testing deployement)


// Database connection
const MONGODB_URI = process.env.MONGODB_URI as string;
(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    } as ConnectOptions);
    await RunSeeders();
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();


// Routes
app.use("/health", (req, res) => {
  res.json({success: true, message: `App is up and running:  ${req.hostname}${req.originalUrl}`});
});
app.use("/api/v1/contractor", contractorRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/common", commonRoute);

//Queue web route  // Attach Bull Board middleware
QueueService.attach(app);
RepairFindQueueWorker


// Middleware to handle non-existing pages (404)
app.use((req, res, next) => {
  res.status(404).json({success:false, message: `Resource Not found:  ${req.hostname}${req.originalUrl}` });
});


app.use(errorHandler)


// Socket.IO event handlers
 SocketIOService.initialize(server)


// Initialize server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
