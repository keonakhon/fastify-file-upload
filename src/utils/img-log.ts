// Save details of image for the new upload or edit to logs
import { pgPool } from "../configs/db-connection";

// Utils or Helpers
import * as Error4xxHandler from "./errors/english/4xx.json";

// Add image upload log
const insertLog = async (
  user_id: string,
  file_name: string,
  origin_name: string,
  link: string,
  size: string,
  width: string,
  height: string,
  app_type: string,
  object_id: string,
  track: string
) => {
  try {
    return await pgPool.query(
      `INSERT INTO upload.file (user_id,
        file_name, origin_name, link, size,
        width, height, app_type, object_id, track)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
      [
        user_id,
        file_name,
        origin_name,
        link,
        size,
        width,
        height,
        app_type,
        object_id,
        track
      ]
    );
  } catch (err) {
    throw err;
  }
};

// Find Logs by User ID and File Name, for customer
const findLogByUserIdAndFile = async (
  user_id: string,
  file_name: string,
  imgPath: string
) => {
  try {
    const uploadedData = await pgPool.query(
      `SELECT id FROM upload.file WHERE user_id = $1 AND file_name = $2 AND track = $3
        ORDER BY created_at ASC`,
      [user_id, file_name, imgPath]
    );

    if (!uploadedData.rowCount) {
      throw Error4xxHandler.ImageDoesNotExistOrYouDontHavePermission;
    }

    return uploadedData;
  } catch (err) {
    throw err;
  }
};

// Find Logs by File Name, for admin
const findLogByFile = async (file_name: string, imgPath: string) => {
  try {
    const uploadedData = await pgPool.query(
      `SELECT id FROM upload.file WHERE file_name = $1 AND track = $2
        ORDER BY created_at ASC`,
      [file_name, imgPath]
    );

    if (!uploadedData.rowCount) {
      throw Error4xxHandler.ImageDoesNotExist;
    }

    return uploadedData;
  } catch (err) {
    throw err;
  }
};

export { insertLog, findLogByUserIdAndFile, findLogByFile };
