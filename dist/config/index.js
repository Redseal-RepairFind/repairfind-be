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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.config = void 0;
var AWS = __importStar(require("aws-sdk"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    jwt: {
        tokenLifetime: process.env.JWT_TOKEN_LIFE_TIME || '24h'
    },
    mongodb: {
        uri: process.env.MONGODB_URI,
        collections: {
            // chat
            conversations: 'conversations',
            messages: 'messages',
            // users
            contractors: 'contractors',
            customers: 'customers',
            // profiles
            contractor_profiles: 'contractor_profiles',
            customer_profiles: 'customer_profiles',
        }
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        apiKey: process.env.GOOGLE_API_KEY,
        serviceJson: process.env.GOOGLE_SERVICE_JSON || "https://repairfindbucket.s3.eu-west-3.amazonaws.com/googleService.json"
    },
    i18n: {
        engine: process.env.I18N_ENGINE || 'google',
        key: process.env.I18N_ENGINE_KEY,
    },
    apple: {
        apnAuthKey: process.env.APN_AUTH_KEY,
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
        env: process.env.APPLE_ENV,
    },
    redis: {
        uri: process.env.REDIS_URI,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
        queueName: (_a = process.env.REDIS_QUEUE_NAME) !== null && _a !== void 0 ? _a : 'RepairFindQueue'
    },
    sentry: {
        dsn: process.env.SENTRY_DSN,
    },
    aws: {
        secretAccessKey: process.env.AWS_SECRET_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        region: process.env.AWS_REGION,
        s3BucketName: process.env.AWS_S3_BUCKET
    },
    paystack: {
        secretKey: process.env.PAYSTACK_SECRET_KEY,
        publicKey: process.env.PAYSTACK_PUBLIC_KEY,
        uri: process.env.PAYSTACK_BASE_URL
    },
    paypal: {
        secretKey: process.env.PAYPAL_CLIENT_SECRET,
        clientId: process.env.PAYPAL_CLIENT_ID,
        apiUrl: process.env.PAYPAL_API_URL
    },
    kyc: {
        appId: process.env.KYC_APP_ID_KEMBLY,
        apiKey: process.env.KYC_API_KEY,
        baseLiveUrl: process.env.KYC_PROVIDER_BASE_LIVE_URL,
        baseSandboxUrl: process.env.KYC_PROVIDER_SANDBOX_URL
    },
    certn: {
        certnKey: process.env.CERTN_KEY,
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
        verificationServiceSid: process.env.TWILIO_VERIFICATION_SERVICE_SID
    },
    agora: {
        appId: process.env.AGORA_APP_ID,
        appCertificate: process.env.AGORA_APP_CERTIFICATE,
    },
    logtail: {
        token: process.env.LOGTAIL_TOKEN,
    },
    port: process.env.PORT,
    environment: process.env.APN_ENV,
};
exports.s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    endpoint: process.env.AWS_S3_ENDPOINT || 's3-eu-west-3.amazonaws.com',
    signatureVersion: 'v4',
    region: exports.config.aws.region
});
