"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var http_1 = __importDefault(require("http"));
var routes_1 = __importDefault(require("./modules/contractor/routes/routes"));
var routes_2 = __importDefault(require("./modules/admin/routes/routes"));
var routes_3 = __importDefault(require("./modules/customer/routes/routes"));
var routes_4 = __importDefault(require("./modules/common/routes/routes"));
var seeders_1 = require("./database/seeders");
var custom_errors_1 = require("./utils/custom.errors");
var logger_1 = require("./services/logger");
var bullmq_1 = require("./services/bullmq");
var worker_1 = require("./services/bullmq/worker");
var socketio_1 = __importDefault(require("./services/socket/socketio"));
var security_1 = __importDefault(require("./modules/common/middlewares/security"));
var csrf_1 = __importDefault(require("./modules/common/middlewares/csrf"));
var cors_1 = __importDefault(require("./modules/common/middlewares/cors"));
var parsers_1 = __importDefault(require("./modules/common/middlewares/parsers"));
var twillio_1 = __importDefault(require("./services/twillio"));
var fcm_1 = require("./services/notifications/fcm");
dotenv_1.default.config();
// intercept all console logs and bind it to configured log service
console.warn = logger_1.Logger.warn.bind(logger_1.Logger);
console.error = logger_1.Logger.error.bind(logger_1.Logger);
console.info = logger_1.Logger.info.bind(logger_1.Logger);
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
// Apply security-related middleware
(0, security_1.default)(app);
// Apply CSRF protection middleware
(0, csrf_1.default)(app);
// Apply sentry middleware
// sentryMiddleware(app)
// Apply cors middleware
(0, cors_1.default)(app);
// Api rate limit
// configureRateLimit(app)
// Parsers
(0, parsers_1.default)(app);
// Database connection
var MONGODB_URI = process.env.MONGODB_URI;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI, {})];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, seeders_1.RunSeeders)()];
            case 2:
                _a.sent();
                logger_1.Logger.info("Connected to Database");
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                logger_1.Logger.error("Database connection error:", err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); })();
// Routes
app.use("/health", function (req, res) {
    res.json({ success: true, message: "App is up and running:  ".concat(req.hostname).concat(req.originalUrl) });
});
app.use("/api/v1/contractor", routes_1.default);
app.use("/api/v1/admin", routes_2.default);
app.use("/api/v1/customer", routes_3.default);
app.use("/api/v1/common", routes_4.default);
//Queue web route  // Attach Bull Board middleware
bullmq_1.QueueService.attach(app);
worker_1.RepairFindQueueWorker;
// Middleware to handle non-existing pages (404)
// Root Route
app.get("/", function (req, res) {
    res.json({ success: true, message: "Welcome to Repairfind API: ".concat(req.hostname).concat(req.originalUrl) });
});
// Middleware to handle non-existing pages (404)
app.use(function (req, res, next) {
    res.status(404).json({ success: false, message: "Resource Not found: ".concat(req.hostname).concat(req.originalUrl) });
});
app.use(custom_errors_1.errorHandler);
// Socket.IO event handlers
socketio_1.default.initialize(server);
twillio_1.default.initialize();
//FCM
fcm_1.FCMNotification.initializeFirebase();
var InittimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
logger_1.Logger.info("Current timezone: ".concat(InittimeZone));
// Set the default timezone to PST (Pacific Standard Time)
process.env.TZ = 'America/Los_Angeles';
// Initialize server
var port = process.env.PORT || 3000;
var FirsttimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
logger_1.Logger.info("Current timezone: ".concat(FirsttimeZone));
server.listen(port, function () {
    logger_1.Logger.info("Server listening on port ".concat(port, " - Timezone::: ").concat(process.env.TZ));
});
