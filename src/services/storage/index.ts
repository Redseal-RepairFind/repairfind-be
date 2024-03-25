import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config, s3 } from '../../config';
import { promisify } from 'util';
import * as fs from 'fs';
import axios, { AxiosResponse } from 'axios';
import AWS from 'aws-sdk';
import * as crypto from 'crypto';
import { Readable } from 'stream';
import * as path from 'path';


export const memoryUpload = multer({
  storage: multer.memoryStorage(), // Store images in memory before uploading to S3
});



export const diskUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original filename
    },
  })
});



export const uploadToS3 = async (buffer: Buffer, originalFilename: string): Promise<null | { Location: string, response: any }> => {

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
    return null
  }
  const awsAccessKey: string = process.env.AWS_ACCESS_KEY_ID;
  const awsAccessSecretKey: string = process.env.AWS_SECRET_ACCESS_KEY?.toString();
  const awsBucketName: string = process.env.AWS_BUCKET_NAME?.toString();

  const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsAccessSecretKey,
    },
  });

  const timestamp = Date.now().toString();
  const key = `${timestamp}-${originalFilename}`;

  const params = {
    Bucket: awsBucketName,
    Key: key,
    Body: buffer,
    ACL: 'public-read',
  };

  const command = new PutObjectCommand(params);

  try {
    const response = await s3.send(command);
    console.log('uploadToS3', response)
    const fileLocation = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    return { response, Location: fileLocation };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};





export const s3FileUpload = async (files: Express.Multer.File[]): Promise<string[] | undefined> => {

  const readFileAsync = promisify(fs.readFile);
  const s3UploadAsync = promisify(s3.upload.bind(s3));

  try {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      let { originalname, buffer, mimetype, path } = file;

      if (path && !buffer) {
        buffer = await readFileAsync(path);
      }

      const fileName = originalname?.split('\\')?.pop()?.split('/').pop() ?? '';
      const objectName = `${new Date().getTime() + fileName}`;
      const fileExtension = originalname.slice((originalname.lastIndexOf(".") - 1 >>> 0) + 2);

      const parameters: AWS.S3.PutObjectRequest = {
        Bucket: config.aws.s3BucketName,
        Key: objectName,
        Body: buffer,
        ContentType: mimetype ?? `image/${fileExtension}`,
      };

      const data = await s3UploadAsync(parameters);
      console.log(`File uploaded successfully. ${data.Location}`);
      uploadedUrls.push(data.Location);
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading files to s3:', error);
    return undefined;
  }
};




export async function transferFileToS3(url: any, key: any) {
  try {
    // Download the file from the URL
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    // Calculate the content length
    let contentLength = 0;
    response.data.on('data', (chunk: string | any[]) => {
      contentLength += chunk.length;
    });


    try {
      // Download the file from the URL
      const response: AxiosResponse<Readable> = await axios({
        url,
        method: 'GET',
        responseType: 'stream' // Set responseType to stream to handle binary data
      });

      // Create a Buffer to store the response data
      const chunks: any[] = [];
      response.data.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      await response.data.on('end', async () => {
        // Concatenate the chunks into a single Buffer
        const dataBuffer = Buffer.concat(chunks);

        // Calculate MD5 hash of the content
        const contentMD5 = crypto.createHash('md5').update(dataBuffer).digest('base64');

        // Extract filename and extension from the URL
        const urlPath = new URL(url).pathname;
        const filename = path.basename(urlPath);
        const extension = path.extname(filename);
        

        const uploadParams = {
          Bucket: config.aws.s3BucketName,
          Key: key + extension, // Append the extension to the key
          Body: dataBuffer,
          ContentLength: dataBuffer.length, // Provide the content length
          ContentMD5: contentMD5 // Provide the calculated MD5 hash
        };

        let s3Response = await s3.upload(uploadParams).promise();

        console.log('File uploaded successfully. URL:', s3Response);
        return s3Response
      });

    } catch (error) {
      console.error('Error transferring file to S3:', error);
    }



  } catch (error) {
    console.error('Error transferring file to S3:', error);
  }
}



export async function transferFileToS3Sync(url: string, key: string): Promise<any> {
  
  return new Promise(async (resolve, reject) => {
    try {
      // Download the file from the URL
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });

      // Calculate the content length
      let contentLength = 0;
      response.data.on('data', (chunk: Buffer) => {
        contentLength += chunk.length;
      });

      // Create an array to store file data chunks
      const chunks: any[] = [];
      response.data.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      // When the download is complete, concatenate the chunks into a single Buffer
      response.data.on('end', async () => {
        try {
          // Concatenate the chunks into a single Buffer
          const dataBuffer = Buffer.concat(chunks);

          // Calculate MD5 hash of the content
          const contentMD5 = crypto.createHash('md5').update(dataBuffer).digest('base64');

          // Extract filename and extension from the URL
          const filename = path.basename(url);
          const extension = path.extname(filename);


          // Upload the file to S3
          const uploadParams = {
            Bucket: config.aws.s3BucketName,
            Key: key + extension, // Append the extension to the key
            Body: dataBuffer,
            ContentLength: dataBuffer.length, // Provide the content length
            ContentMD5: contentMD5 // Provide the calculated MD5 hash
          };

          const s3Response = await s3.upload(uploadParams).promise();
          // console.log('File uploaded successfully. URL:', s3Response.Location);
          resolve(s3Response.Location); // Resolve with the S3 file URL
        } catch (error) {
          console.error('Error uploading file to S3:', error);
          reject(error); // Reject with the error if uploading fails
        }
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      reject(error); // Reject with the error if downloading fails
    }
  });
}
