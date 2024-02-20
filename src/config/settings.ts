export const config = {
    jwtPrivateKey: <string>process.env.JWT_PRIVATE_KEY,
    mongodb: {
        uri: <string>process.env.MONGODB_URI,
        collections: {
            conversations: 'conversations',
            messages: 'messages',
            userVerifications: 'user_verifications',
            users: 'users',
            userAuthTokens: 'user_auth_tokens',
            userAuths: 'user_auths',
            assets: 'assets',
            transactions: 'transactions',
            ledgers: 'ledgers',
            userNotifications: 'user_notifications',
            challenges: 'challenges',
            challengeTasks: 'challenge_tasks',
            challengeParticipants: 'challenge_participants',
            challengeSubscribers: 'challenge_subscribers',
            challengeRequests: 'challenge_requests',
            userFollowers: 'user_followers',
            taskReminder: 'task_reminders',
            challengeTags: 'challenge_tags'
        }
    },

    google: {
        clientID: <string>process.env.GOOGLE_CLIENT_ID
    },

    redis: {
        uri: <string>process.env.REDIS_URI,
        password: <string>process.env.REDIS_PASSWORD
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

    kyc: {
        appId: <string>process.env.KYC_APP_ID_KEMBLY,
        apiKey: <string>process.env.KYC_API_KEY,
        baseLiveUrl: <string>process.env.KYC_PROVIDER_BASE_LIVE_URL,
        baseSandboxUrl: <string>process.env.KYC_PROVIDER_SANDBOX_URL
    },

    twilio: {
        accountSid: <string>process.env.TWILIO_ACCOUNT_SID,
        authToken: <string>process.env.AUTH_TOKEN,
        twilioPhoneNumber: <string>process.env.TWILIO_PHONE_NUMBER
    },

    port: process.env.PORT as unknown as number

};
