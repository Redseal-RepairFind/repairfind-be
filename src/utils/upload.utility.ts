import multer from 'multer';
// import multerS3 from 'multer-s3'
// import {S3Client} from '@aws-sdk/client-s3'

export const upload = multer({
    storage: multer.memoryStorage(), // Store images in memory before uploading to S3
});

// const  S3StorageEngine = (s3Config:
//     S3Client, bucketName: string)=> {
//         return multerS3({
//             s3: s3Config,
//             acl: 'public-read',
//             bucket: bucketName,
//             key: function(req, file, cb) {
//                 cb(null, `${Date.now().toString()}.
//                 ${file.originalname.split('.')}
//                 [file.originalname.split('.).length - 1]`);
//             }
//         })
//     }


// export const upload = multer({
//     storage: multer.memoryStorage(), // Store images in memory before uploading to S3
// });
  