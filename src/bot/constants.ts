import {
  Intents,
  DMChannel,
  NewsChannel,
  TextChannel,
  Permissions,
  PermissionString
} from 'discord.js';
import { Locale } from './templates/template';

export const DEBUG_MODE: boolean = process.env['DEBUG_MODE'] === 'true';

export const BOT_OWNER_IDS: string[]
  = process.env['BOT_OWNER_IDS']?.split(',') ?? [];

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

export const DEFAULT_BOT_PERMISSIONS: PermissionString[] = [
  'ADD_REACTIONS',
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'MANAGE_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'USE_EXTERNAL_EMOJIS',
  'MANAGE_WEBHOOKS',
];
export const MINIMUM_BOT_PERMISSIONS: PermissionString[] = [
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'EMBED_LINKS',
];

Permissions.FLAGS

export const DEFAULT_LOCALE: Locale = 'ja';

export type USABLE_CHANNEL_TYPES = DMChannel | TextChannel | NewsChannel;
export type USABLE_GUILD_CHANNEL_TYPES = TextChannel | NewsChannel;

export const PRESENCE_UPDATE_INTERVAL = 60 * 1000;
export const COMMAND_EDITABLE_TIME = 3 * 60 * 1000;

export const USER_RATE_LIMIT = 60;
export const BOT_RATE_LIMIT  = 30;

export const COMMAND_MAX_OPTIONS  = 20;
export const COMMAND_QUESTION_MAX = 200;
export const COMMAND_OPTION_MAX   = 80;
