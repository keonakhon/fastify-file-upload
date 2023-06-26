// Load the AWS SDK for Node.js
import AWS from "aws-sdk";

// Environment
import ConfigKey from "./environment/env-index";

// Set the region
AWS.config.update({ region: "ap-southeast-1" });

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// Helper Functions
import { insertLog } from "./img-log";

const BucketName = ConfigKey.AWS_BUCKET_NAME;

// Upload Image to AWS S3
const uploadImageToS3 = async (
  file: any,
  typeOfFile: string,
  fileName: string,
  originFileName: string,
  appType: string,
  objectID: string,
  userID: string
) => {
  try {
    // call S3 to retrieve upload file to specified bucket
    const uploadParams = {
      Bucket: BucketName,
      Key: `${typeOfFile}/${fileName}` /* path & file name */,
      Body: await file.toBuffer() /* file or buffer */
    };

    const imageMetadata = await file.metadata();

    // call S3 to retrieve upload file to specified bucket
    const s3UploadedData = await s3.upload(uploadParams).promise();

    // Save S3 Uploaded Object data to DB
    await insertLog(
      userID,
      fileName,
      originFileName,
      s3UploadedData.Location,
      imageMetadata.size,
      imageMetadata.width,
      imageMetadata.height,
      appType,
      objectID,
      typeOfFile
    );

    return s3UploadedData.Key;
  } catch (err) {
    throw err;
  }
};

// Get Image Object from AWS S3
const getImageFromS3 = async (typeOfFile: string, fileName: string) => {
  try {
    // Parameters
    const getParams = {
      Bucket: BucketName,
      Key: `${typeOfFile}/${fileName}` /* path & file name */
    };

    const s3Object = await s3.getObject(getParams);

    return s3Object;
  } catch (err) {
    throw err;
  }
};

export { uploadImageToS3, getImageFromS3 };
