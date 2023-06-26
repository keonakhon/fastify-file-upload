// Utils or Helpers
import logger from "./logger";
import { sendMessageToDiscordChannel } from "../discord-webhook";
import { generateRandomNumber } from "../generate-uuid";

// Error Handler
const errorHandler = async (
  method: string,
  routerPath: string,
  reply: any,
  errorObj: any,
  statusCodeNumber?: number
) => {
  const httpRequestMethodAndPath = `:[${method}] :${routerPath}`;
  const uuidError = generateRandomNumber(4);
  try {
    let statusCode = statusCodeNumber ? statusCodeNumber : 500;

    if (errorObj.statusCode) {
      statusCode = errorObj.statusCode;

      return reply.code(statusCode).send(errorObj);
    } else if (
      errorObj.name === "UnauthorizedError" ||
      errorObj.name === "TokenExpiredError"
    ) {
      statusCode = 401;

      return reply.code(statusCode).send(errorObj);
    } else {
      const errorMessage = `${httpRequestMethodAndPath} - #${uuidError} - Else Condition - ${errorObj}`;

      // Add Log
      logger.error(errorMessage);

      // Send Error Message to Discord
      sendMessageToDiscordChannel(errorMessage);

      return reply.code(statusCode).send(errorObj);
    }
  } catch (err: any) {
    const errorMessage = `${httpRequestMethodAndPath} - #${uuidError} - Catch Condition - ${errorObj}`;

    // Add Log
    logger.error(errorMessage);

    // Send Error Message to Discord
    sendMessageToDiscordChannel(errorMessage);

    return reply.code(500).send(err);
  }
};

export default errorHandler;
