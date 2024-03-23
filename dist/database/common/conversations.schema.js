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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationDb = exports.ENTITY_TYPE = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var ENTITY_TYPE;
(function (ENTITY_TYPE) {
    ENTITY_TYPE["BOOKING"] = "bookings";
    ENTITY_TYPE["JOB"] = "jobs";
})(ENTITY_TYPE || (exports.ENTITY_TYPE = ENTITY_TYPE = {}));
var ConversationSchema = new mongoose_1.default.Schema({
    members: [
        {
            memberType: {
                type: String,
                enum: ['contractors', 'customers'],
                required: true,
            },
            member: {
                type: mongoose_1.Schema.Types.ObjectId,
                refPath: 'members.memberType',
                required: true,
            },
        },
    ],
    entity: {
        type: String,
        ref: '',
        index: true,
    },
    entityType: {
        type: String,
        required: true,
        enum: Object.values(ENTITY_TYPE)
    },
    heading: {
        type: Object
    },
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: Date
    }
}, {
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            return ret;
        }
    },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            return ret;
        }
    },
    timestamps: true,
    versionKey: false
});
exports.ConversationDb = (0, mongoose_1.model)('conversations', ConversationSchema);
