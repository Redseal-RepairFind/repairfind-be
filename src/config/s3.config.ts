import { config } from '.';
import * as AWS from 'aws-sdk';

export const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    endpoint: 's3-eu-central-1.amazonaws.com',
    signatureVersion: 'v4',
    region: config.aws.region
});


