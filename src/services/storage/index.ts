import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config, s3 } from '../../config';
import { promisify } from 'util';
import * as fs from 'fs';

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



export const uploadToS3 = async (buffer: Buffer, originalFilename: string): Promise<null | {Location:string,response:any}> => {

  if(!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME){
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
    const fileLocation = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
    return { response,Location:fileLocation };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};


const readFileAsync = promisify(fs.readFile);
const s3UploadAsync = promisify(s3.upload.bind(s3));

export const s3FileUpload = async (files: Express.Multer.File[]): Promise<string[] | undefined> => {
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