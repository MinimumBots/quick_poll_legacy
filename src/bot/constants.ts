import { Intents, DMChannel, NewsChannel, TextChannel } from 'discord.js';
import { LocaleTypes } from './responses/locales';

export const BOT_OWNER_IDS: string[]
  = process.env['npm_package_config_botOwnerIDs']?.split(',') ?? [];

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

export const DEFAULT_LOCALE: LocaleTypes = 'ja';

export type USABLE_CHANNEL_TYPES = DMChannel | TextChannel | NewsChannel;
export type USABLE_GUILD_CHANNEL_TYPES = TextChannel | NewsChannel;

export const PRESENCE_UPDATE_INTERVAL = 60 * 1000;
export const COMMAND_EDITABLE_TIME = 3 * 60 * 1000;

export const RATE_RESET_SCHEDULE = '0 * * * *';
export const USER_RATE_LIMIT    = 60;
export const BOT_RATE_LIMIT     = 30;
export const WEBHOOK_RATE_LIMIT = 30;

export const POLL_MAX_OPTIONS = 20;
export const POLL_QUESTION_MAX = 200;
export const POLL_OPTION_MAX   = 80;
