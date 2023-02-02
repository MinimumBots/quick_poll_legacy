import { PermissionsString, IntentsBitField } from 'discord.js';
import { Lang } from './bot/templates/locale';

export const DEBUG_MODE: boolean = process.env['DEBUG_MODE'] === 'true';

export const FAMILY_PASS_PHRASE: string
  = process.env['FAMILY_PASS_PHRASE'] ?? '';
export const TRANSACTION_API_ENDPOINT: string
  = process.env['TRANSACTION_API_ENDPOINT'] ?? '';

export const BOT_OWNER_IDS: string[]
  = process.env['BOT_OWNER_IDS']?.split(',') ?? [];

export const BOT_TOTAL_SHARDS: number | 'auto'
  = Number(process.env['BOT_TOTAL_SHARDS']) || 'auto';
export const BOT_SHARD_LIST: number[] | 'auto'
  = process.env['BOT_SHARD_LIST']?.split(',').map(Number) ?? 'auto';

export const COMMAND_PREFIX: string
  = process.env['COMMAND_PREFIX'] ?? '/';

export const BOT_DOCUMENT_URL: string
  = process.env['BOT_DOCUMENT_URL'] ?? '';
export const BOT_INVITE_URL: string
  = process.env['BOT_INVITE_URL'] ?? '';
export const SUPPORT_SERVER_URL: string
  = process.env['SUPPORT_SERVER_URL'] ?? '';
export const DONATION_SERVICE_URL: string
  = process.env['DONATION_SERVICE_URL'] ?? '';

export const BOT_INTENTS
  = IntentsBitField.Flags.Guilds
  | IntentsBitField.Flags.GuildEmojisAndStickers
  | IntentsBitField.Flags.GuildWebhooks
  | IntentsBitField.Flags.GuildMessages
  | IntentsBitField.Flags.GuildMessageReactions
  | IntentsBitField.Flags.MessageContent;

export const MINIMUM_BOT_PERMISSIONS: PermissionsString[] = [
  'ViewChannel',
  'SendMessages',
  'EmbedLinks',
];
export const DEFAULT_BOT_PERMISSIONS: PermissionsString[]
  = MINIMUM_BOT_PERMISSIONS.concat(
    'AddReactions',
    'ManageMessages',
    'AttachFiles',
    'ReadMessageHistory',
    'MentionEveryone',
    'UseExternalEmojis',
    'ManageWebhooks',
  );

export const POSTULATE_WEBHOOK_PERMISSIONS: PermissionsString[] = [
  'ViewChannel',
  'SendMessages',
  'SendTTSMessages',
  'EmbedLinks',
  'AttachFiles',
  'MentionEveryone',
];

export const DEFAULT_LANG: Lang = 'ja';

export const PRESENCE_UPDATE_INTERVAL = 60 * 1000;
export const COMMAND_EDITABLE_TIME = 5 * 60 * 1000;

export const MESSAGE_CACHE_LIFETIME = 60 * 60;
export const MESSAGE_SWEEP_INTERVAL = 60 * 10;

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
