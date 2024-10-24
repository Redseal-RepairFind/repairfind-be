
import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    jwtPrivateKey: <string>process.env.JWT_PRIVATE_KEY,
    jwt: {
        tokenLifetime: <string>process.env.JWT_TOKEN_LIFE_TIME || '24h'
    },
    mongodb: {
        uri: <string>process.env.MONGODB_URI,
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
        clientID: <string>process.env.GOOGLE_CLIENT_ID,
        apiKey: <string>process.env.GOOGLE_API_KEY,
        serviceJson: <string>process.env.GOOGLE_SERVICE_JSON || "https://repairfindbucket.s3.eu-west-3.amazonaws.com/googleService.json"
    },

    i18n: {
        engine: <'google'| 'yandex'| 'libre'| 'deepl'>process.env.I18N_ENGINE || 'google', 
        key: <string>process.env.I18N_ENGINE_KEY,
    },

    apple: {
        apnAuthKey: <string>process.env.APN_AUTH_KEY,
        teamId: <string>process.env.APPLE_TEAM_ID,
        keyId: <string>process.env.APPLE_KEY_ID,
        env: <string>process.env.APPLE_ENV,
    },

    redis: {
        uri:  <string>process.env.REDIS_URI,
        host: <string>process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: <string>process.env.REDIS_PASSWORD,
        username: <string>process.env.REDIS_USERNAME,
        queueName: <string>process.env.REDIS_QUEUE_NAME ?? 'RepairFindQueue'

    },

    sentry:{
        dsn: <string>process.env.SENTRY_DSN,
    },
    aws: {
        secretAccessKey: <string>process.env.AWS_SECRET_KEY,
        accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
        region: <string>process.env.AWS_REGION,
        s3BucketName: <string>process.env.AWS_S3_BUCKET
    },
    paystack: {
        secretKey: <string>process.env.PAYSTACK_SECRET_KEY,
        publicKey: <string>process.env.PAYSTACK_PUBLIC_KEY,
        uri: <string>process.env.PAYSTACK_BASE_URL
    },

    paypal: {
        secretKey: <string>process.env.PAYPAL_CLIENT_SECRET,
        clientId: <string>process.env.PAYPAL_CLIENT_ID,
        apiUrl: <string>process.env.PAYPAL_API_URL
    },

    kyc: {
        appId: <string>process.env.KYC_APP_ID_KEMBLY,
        apiKey: <string>process.env.KYC_API_KEY,
        baseLiveUrl: <string>process.env.KYC_PROVIDER_BASE_LIVE_URL,
        baseSandboxUrl: <string>process.env.KYC_PROVIDER_SANDBOX_URL
    },

    certn: {
        certnKey: <string>process.env.CERTN_KEY,
    },

    twilio: {
        accountSid: <string>process.env.TWILIO_ACCOUNT_SID,
        authToken: <string>process.env.TWILIO_AUTH_TOKEN,
        twilioPhoneNumber: <string>process.env.TWILIO_PHONE_NUMBER,
        verificationServiceSid: <string>process.env.TWILIO_VERIFICATION_SERVICE_SID
    },

    agora: {
        appId: <string>process.env.AGORA_APP_ID,
        appCertificate: <string>process.env.AGORA_APP_CERTIFICATE,
    },

    logtail: {
        token: <string>process.env.LOGTAIL_TOKEN,
    },


    port: process.env.PORT as unknown as number,
    environment: <string>process.env.APN_ENV,

};


export const s3 = new AWS.S3({
    accessKeyId: <string>process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: <string>process.env.AWS_SECRET_KEY,
    endpoint: <string>process.env.AWS_S3_ENDPOINT || 's3-eu-west-3.amazonaws.com',
    signatureVersion: 'v4',
    region: config.aws.region
});