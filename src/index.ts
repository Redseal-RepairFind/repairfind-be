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
import { Logger } from "./services/logger";
import { QueueService } from "./services/bullmq";
import { RepairFindQueueWorker } from "./services/bullmq/worker";
import SocketIOService from "./services/socket/socketio";
import securityMiddleware from "./modules/common/middlewares/security";
import csrfMiddleware from "./modules/common/middlewares/csrf";
import sentryMiddleware from "./modules/common/middlewares/sentry";
import corsMiddleware from "./modules/common/middlewares/cors";
import configureParsers from "./modules/common/middlewares/parsers";
import configureRateLimit from "./modules/common/middlewares/ratelimit";
import TwilioService from "./services/twillio";
import { FCMNotification } from "./services/notifications/fcm";
import { config } from "./config";
import { PaypalCheckoutTemplate } from "./templates/common/paypal_checkout";


dotenv.config();

// intercept all console logs and bind it to configured log service
console.warn = Logger.warn.bind(Logger);
console.error = Logger.error.bind(Logger);
console.info = Logger.info.bind(Logger);

const app = express();
const server = http.createServer(app);



app.get("/api/v1/customer/paypal/payment-method-checkout-view", (req: any, res) => {
  const {token} =req.query;
  const paypalClientId = config.paypal.clientId

  console.log("token", token)
  let html = PaypalCheckoutTemplate({token, paypalClientId})
  return res.send(html);
});



// Apply security-related middleware
securityMiddleware(app);


// Apply CSRF protection middleware
csrfMiddleware(app);


// Apply sentry middleware
// sentryMiddleware(app)


// Apply cors middleware
corsMiddleware(app)


// Api rate limit
// configureRateLimit(app)

// Parsers
configureParsers(app);




// Database connection
const MONGODB_URI = process.env.MONGODB_URI as string;
(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
    } as ConnectOptions);
    await RunSeeders();
    Logger.info("Connected to Database");
  } catch (err) {
    Logger.error("Database connection error:", err);
  }
})();


// Routes
app.use("/health", (req, res) => {
  res.json({success: true, message: `App is up and runnings:  ${req.hostname}${req.originalUrl}`});
});

app.use("/api/v1/contractor", contractorRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/common", commonRoute);

//Queue web route  // Attach Bull Board middleware
QueueService.attach(app);
RepairFindQueueWorker

// Middleware to handle non-existing pages (404)
// Root Route
app.get("/", (req, res) => {
  res.json({ success: true, message: `Welcome to Repairfind API: ${req.hostname}${req.originalUrl}` });
});

// Middleware to handle non-existing pages (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Resource Not found: ${req.hostname}${req.originalUrl}` });
});

app.use(errorHandler)


// Socket.IO event handlers
 SocketIOService.initialize(server)
 TwilioService.initialize();


 //FCM
 FCMNotification.initializeFirebase()


const InittimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
Logger.info(`Current timezone: ${InittimeZone}`);


// Set the default timezone to PST (Pacific Standard Time)
process.env.TZ = 'America/Los_Angeles';


// Initialize server
const port = process.env.PORT || 3000;


const FirsttimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
Logger.info(`Current timezone: ${FirsttimeZone}`);

server.listen(port, () => {
  Logger.info(`Server listening on port ${port} - Timezone::: ${process.env.TZ}`);
});