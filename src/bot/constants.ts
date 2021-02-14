import { Intents } from 'discord.js';

export const COMMAND_PREFIX
  = process.env['npm_package_config_commandPrefix'] ?? '/';

export const BOT_DOCUMENT_URL
  = process.env['npm_package_config_botDocumentURL'] ?? '';
export const SUPPORT_SERVER_URL
  = process.env['npm_package_config_supportServerURL'] ?? '';
export const DONATION_SERVICE_URL
  = process.env['npm_package_config_donationServiceURL'] ?? '';

export const BOT_INTENTS = 0
  | Intents.FLAGS.GUILDS
  | Intents.FLAGS.GUILD_EMOJIS
  | Intents.FLAGS.GUILD_WEBHOOKS
  | Intents.FLAGS.GUILD_MESSAGES
  | Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  | Intents.FLAGS.DIRECT_MESSAGES
  | Intents.FLAGS.DIRECT_MESSAGE_REACTIONS;

export const PRESENCE_UPDATE_INTERVAL = 60 * 1000;
export const COMMAND_EDITABLE_TIME = 3 * 60 * 1000;

export const RATE_RESET_SCHEDULE = '0 * * * *';
export const USER_RATE_LIMIT    = 30;
export const BOT_RATE_LIMIT     = 20;
export const WEBHOOK_RATE_LIMIT = 20;
