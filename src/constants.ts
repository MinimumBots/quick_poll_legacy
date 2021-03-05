import {
  Intents,
  DMChannel,
  NewsChannel,
  TextChannel,
  PermissionString,
} from 'discord.js';
import { Lang } from './bot/templates/locale';

export const DEBUG_MODE: boolean = process.env['DEBUG_MODE'] === 'true';

export const BOT_OWNER_IDS: string[]
  = process.env['BOT_OWNER_IDS']?.split(',') ?? [];

export const BOT_TOTAL_SHARDS: number | 'auto'
  = Number(process.env['BOT_TOTAL_SHARDS']) || 'auto';

export const COMMAND_PREFIX: string
  = process.env['npm_package_config_commandPrefix'] ?? '/';

export const BOT_DOCUMENT_URL: string
  = process.env['npm_package_config_botDocumentURL'] ?? '';
export const SUPPORT_SERVER_URL: string
  = process.env['npm_package_config_supportServerURL'] ?? '';
export const DONATION_SERVICE_URL: string
  = process.env['npm_package_config_donationServiceURL'] ?? '';

export const BOT_INTENTS
  = Intents.FLAGS.GUILDS
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

export const DEFAULT_LANG: Lang = 'ja';

export type USABLE_CHANNEL = DMChannel | TextChannel | NewsChannel;
export type USABLE_GUILD_CHANNEL = TextChannel | NewsChannel;

export const PRESENCE_UPDATE_INTERVAL = 60 * 1000;
export const COMMAND_EDITABLE_TIME = 3 * 60 * 1000;

export const USER_RATE_LIMIT = 60;
export const BOT_RATE_LIMIT  = 30;

export const COMMAND_MAX_CHOICES  = 20;
export const COMMAND_QUESTION_MAX = 200;
export const COMMAND_CHOICE_MAX   = 80;

export const COLORS = {
  HELP  : 0xff9440,
  POLL  : 0x3b88c3,
  EXPOLL: 0x3b88c4,
  RESULT: 0xdd2e44,
  ENDED : 0x818181,
};
