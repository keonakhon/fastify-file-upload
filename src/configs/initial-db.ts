import { Client } from "pg";
import fs from "fs";

// Utils or Helpers
import ConfigKey from "../utils/environment/env-index";
import logger from "../utils/errors/logger";
import { sendMessageToDiscordChannel } from "../utils/discord-webhook";
import { generateRandomNumber } from "../utils/generate-uuid";

const sqlToString = fs
  .readFileSync("./src/initialdb.d/00001_create-schema.sql")
  .toString();

export default async (): Promise<void> => {
  const client = new Client({
    connectionString: ConfigKey.HASURA_GRAPHQL_DATABASE_URL
  });
  try {
    await client.connect();
    await client.query(sqlToString);
  } catch (err: any) {
    const uuidError = generateRandomNumber(4);
    const errorText = String(err);
    const errorMessage = `#${uuidError} - Initial Database Error`;
    const errorMessageDiscord = `${errorMessage}`;
    const errorMessageLogger = `${errorMessage} - ${errorText}`;

    // Add Log
    logger.error(errorMessageLogger);

    // Send Error Message to Discord
    sendMessageToDiscordChannel(errorMessageDiscord);
  } finally {
    await client.end();
  }
};
