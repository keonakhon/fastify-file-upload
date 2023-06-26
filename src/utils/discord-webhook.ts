import { EmbedBuilder, WebhookClient } from "discord.js";

// Environment
import ConfigKey from "./environment/env-index";

// Utils or Helpers
import logger from "./errors/logger";

// Send Message To Discord Channel
const sendMessageToDiscordChannel = (message: string) => {
  try {
    const webhookClient = new WebhookClient({
      id: ConfigKey.DISCORD_WEBHOOK_ID,
      token: ConfigKey.DISCORD_WEBHOOK_TOKEN
    });

    return webhookClient.send({
      content: message,
      username: ConfigKey.DISCORD_WEBHOOK_USERNAME
    });
  } catch (err: any) {
    // Add Log
    return logger.error(err.message);
  }
};

export { sendMessageToDiscordChannel };
