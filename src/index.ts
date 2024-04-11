import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
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
import WebSocket from 'ws';
import WebSocketService from "./services/socket/websocket";
import { Server } from "socket.io";
import SocketIOService from "./services/socket/socketio";


dotenv.config();


// console.debug = Logger.debug.bind(Logger);
// console.log = Logger.info.bind(Logger);
console.warn = Logger.warn.bind(Logger);
console.error = Logger.error.bind(Logger);
console.trace = Logger.trace.bind(Logger);


const app = express();
const server = http.createServer(app);

const csrfProtection = csrf({ cookie: true });






const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});


//@ts-ignore
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Middleware
app.use(bodyParser.json({ verify: (req, res, buf, encoding) => {
    // @ts-ignore     
    req.rawBody = buf.toString();
}}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static("../public"));
app.use(cors({ origin: "*" }));
app.use(helmet());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI as string;

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions);
    await RunSeeders();
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

// Routes

app.use("/health", (req, res) => {
  res.json("App is up and running");
});

app.use("/api/v1/contractor", contractorRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/common", commonRoute);


QueueService.attach(app); // Attach Bull Board middleware
RepairFindQueueWorker


// Middleware to handle non-existing pages (404)
app.use((req, res, next) => {
  res.status(404).json({success:false, message: `Not found:  ${req.hostname}${req.originalUrl}` });
});


app.use(errorHandler)

// Websocket here
// const wss = new WebSocket.Server({ server });
// new WebSocketService(wss);

// TODO:
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


// Socket.IO event handlers
 SocketIOService.initialize(io)

// Initialize server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
