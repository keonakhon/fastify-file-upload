import sharp from "sharp";

// Helper Functions
import { uploadImageToS3 } from "./s3-function";
import { generateRandomNumber } from "./generate-uuid";

// Convert image to webp with quality 80%
const imgToWebpQualityFourFifths = async (img: any) => {
  try {
    // If image size greater than 700KB, resize and modify to be webp
    if (img.file.bytesRead >= 700000) {
      const webpImage = await sharp(await img.toBuffer()).webp({ quality: 80 });

      return webpImage;
    }

    // Modify to be webp
    const webpImage = await sharp(await img.toBuffer());

    return webpImage;
  } catch (err) {
    throw err;
  }
};

// Modify image to webp
const imageModification = async (
  image: any,
  imageType: string,
  appType: string,
  objectID: string,
  userID: string
) => {
  try {
    if (image.length) {
      // Map to upload each image file to AWS S3
      const dataResponseFromMapToS3 = await image.map(async (part: any) => {
        if (part.file) {
          // Generate UUID
          const uuidForImgName = await generateRandomNumber(6);

          const webpImage = await imgToWebpQualityFourFifths(part);

          // Upload image to S3
          const dataResponseFromS3 = await uploadImageToS3(
            webpImage,
            imageType,
            `${uuidForImgName}.webp`,
            part.filename,
            appType,
            objectID,
            userID
          );

          return dataResponseFromS3;
        } else {
          return;
        }
      });

      const awaitDataResponseFromS3 = await Promise.all(
        dataResponseFromMapToS3
      );

      return awaitDataResponseFromS3;
    } else {
      // Generate UUID
      const uuidForImgName = await generateRandomNumber(6);

      const webpImage = await imgToWebpQualityFourFifths(image);

      // Upload image to S3
      const dataResponseFromS3 = [
        await uploadImageToS3(
          webpImage,
          imageType,
          `${uuidForImgName}.webp`,
          image.filename,
          appType,
          objectID,
          userID
        )
      ];

      return dataResponseFromS3;
    }
  } catch (err) {
    throw err;
  }
};

export { imageModification };
