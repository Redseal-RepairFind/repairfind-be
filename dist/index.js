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
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
//import { logger } from "./middleware/logger";
//import routes from "./routes/routes";
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var csurf_1 = __importDefault(require("csurf"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
//import path from path
//import chatSocketConfig from './sockets/chatMessageSocketsConfig'
// import chatSocketConfigUser from "./user/socket/socket";
// import * as swaggerDocument from './swagger/swagger.json';
// import swaggerUi from 'swagger-ui-express';
var routes_1 = __importDefault(require("./modules/contractor/routes/routes")); //contractor routes
var routes_2 = __importDefault(require("./modules/admin/routes/routes")); // //admin routes
var routes_3 = __importDefault(require("./modules/customer/routes/routes")); //customer route
var routes_4 = __importDefault(require("./modules/common/routes/routes"));
var seeders_1 = require("./database/seeders");
var router = express_1.default.Router();
var app = (0, express_1.default)();
var csrfProtection = (0, csurf_1.default)({ cookie: true });
var server = http_1.default.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });
var io = new socket_io_1.Server(server);
var limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
});
//app.use('/theraswift-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Middleware
// app.use(limiter);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup());
app.use(body_parser_1.default.json({
    // limit: '50mb',
    verify: function (req, res, buf, encoding) {
        // @ts-ignore     
        req.rawBody = buf.toString();
    }
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use("/uploads", express_1.default.static("../public"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
app.use((0, helmet_1.default)());
//app.use(logger);
dotenv_1.default.config();
// database connection
var MONGODB_URI = process.env.MONGODB_URI;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            mongoose_1.default.connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            // run seeders
            (0, seeders_1.RunSeeders)();
            console.log("Connected To Database - Initial Connection");
        }
        catch (err) {
            console.log("Initial Distribution API Database connection error occurred -", err);
        }
        return [2 /*return*/];
    });
}); })();
app.use("/", router.get("/", function (req, res) {
    res.json("Hello");
}));
app.use("/api/v1/contractor", routes_1.default);
app.use("/api/v1/admin", routes_2.default);
app.use("/api/v1/customer", routes_3.default);
app.use("/api/v1/common", routes_4.default);
// // Handle socket connections
// chatSocketConfigUser(io);
// app initialized port
var port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
server.listen(port, function () {
    console.log("Server listening on port ".concat(port));
});
