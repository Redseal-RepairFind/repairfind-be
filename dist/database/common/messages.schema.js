"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MessageModel = exports.MessageType = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var contractor_model_1 = require("../contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../customer/models/customer.model"));
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "TEXT";
    MessageType["ALERT"] = "ALERT";
    MessageType["MEDIA"] = "MEDIA";
    MessageType["AUDIO"] = "AUDIO";
    MessageType["VIDEO"] = "VIDEO";
    MessageType["IMAGE"] = "IMAGE";
    MessageType["FILE"] = "FILE";
})(MessageType || (exports.MessageType = MessageType = {}));
var MediaSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
    },
    metrics: {
        type: Array,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    }
});
// Define schema for messages
var MessageSchema = new mongoose_1.Schema({
    conversation: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'senderType', // Dynamically reference either Customer or Contractor model
        required: true,
    },
    senderType: {
        type: String,
        enum: ['contractors', 'customers', 'admin'],
        required: false, // false becos we of alert kind of messages
    },
    messageType: {
        type: String,
        enum: Object.values(MessageType),
        required: true,
    },
    message: {
        type: String,
        trim: true,
        required: false,
    },
    media: [MediaSchema],
    readBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            refPath: 'senderType', // Dynamically reference either Customer or Contractor model
        },
    ],
    heading: {
        type: Object
    },
    isOwn: {
        type: Boolean
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'entityType',
        index: true,
    },
    entityType: {
        type: String,
    },
    payload: {
        type: mongoose_1.Schema.Types.Mixed
    }
}, { timestamps: true });
MessageSchema.methods.getIsOwn = function (loggedInUserId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, this.sender.toString() == loggedInUserId];
        });
    });
};
MessageSchema.methods.getHeading = function (loggedInUserId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var findContractor, contractor, customer;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(this.senderType == 'contractors')) return [3 /*break*/, 2];
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(this.sender)];
                case 1:
                    findContractor = _c.sent();
                    contractor = findContractor === null || findContractor === void 0 ? void 0 : findContractor.toJSON();
                    if (!contractor)
                        return [2 /*return*/, {}];
                    return [2 /*return*/, {
                            name: contractor.name,
                            image: (_a = contractor === null || contractor === void 0 ? void 0 : contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url,
                        }];
                case 2: return [4 /*yield*/, customer_model_1.default.findById(this.sender)];
                case 3:
                    customer = _c.sent();
                    if (!customer)
                        return [2 /*return*/, {}];
                    return [2 /*return*/, {
                            name: customer.name,
                            image: (_b = customer === null || customer === void 0 ? void 0 : customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url,
                        }];
            }
        });
    });
};
// Create and export the Message model
exports.MessageModel = mongoose_1.default.model('Message', MessageSchema);
