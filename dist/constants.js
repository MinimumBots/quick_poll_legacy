"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLORS = exports.COMMAND_CHOICE_MAX = exports.COMMAND_QUESTION_MAX = exports.COMMAND_MAX_CHOICES = exports.BOT_RATE_LIMIT = exports.USER_RATE_LIMIT = exports.GUILD_RATE_LIMIT = exports.MESSAGE_SWEEP_INTERVAL = exports.MESSAGE_CACHE_LIFETIME = exports.COMMAND_EDITABLE_TIME = exports.PRESENCE_UPDATE_INTERVAL = exports.DEFAULT_LANG = exports.POSTULATE_WEBHOOK_PERMISSIONS = exports.DEFAULT_BOT_PERMISSIONS = exports.MINIMUM_BOT_PERMISSIONS = exports.BOT_INTENTS = exports.DONATION_SERVICE_URL = exports.SUPPORT_SERVER_URL = exports.BOT_INVITE_URL = exports.BOT_DOCUMENT_URL = exports.COMMAND_PREFIX = exports.BOT_SHARD_LIST = exports.BOT_TOTAL_SHARDS = exports.BOT_OWNER_IDS = exports.COUNTER_API_HOST_NAME = exports.TRANSACTION_API_ENDPOINT = exports.FAMILY_PASS_PHRASE = exports.DEBUG_MODE = void 0;
const discord_js_1 = require("discord.js");
exports.DEBUG_MODE = process.env['DEBUG_MODE'] === 'true';
exports.FAMILY_PASS_PHRASE = process.env['FAMILY_PASS_PHRASE'] ?? '';
exports.TRANSACTION_API_ENDPOINT = process.env['TRANSACTION_API_ENDPOINT'] ?? '';
exports.COUNTER_API_HOST_NAME = process.env['COUNTER_API_HOST_NAME'] ?? '';
exports.BOT_OWNER_IDS = process.env['BOT_OWNER_IDS']?.split(',') ?? [];
exports.BOT_TOTAL_SHARDS = Number(process.env['BOT_TOTAL_SHARDS']) || 'auto';
exports.BOT_SHARD_LIST = process.env['BOT_SHARD_LIST']?.split(',').map(Number) ?? 'auto';
exports.COMMAND_PREFIX = process.env['COMMAND_PREFIX'] ?? '/';
exports.BOT_DOCUMENT_URL = process.env['BOT_DOCUMENT_URL'] ?? '';
exports.BOT_INVITE_URL = process.env['BOT_INVITE_URL'] ?? '';
exports.SUPPORT_SERVER_URL = process.env['SUPPORT_SERVER_URL'] ?? '';
exports.DONATION_SERVICE_URL = process.env['DONATION_SERVICE_URL'] ?? '';
exports.BOT_INTENTS = discord_js_1.IntentsBitField.Flags.Guilds
    | discord_js_1.IntentsBitField.Flags.GuildEmojisAndStickers
    | discord_js_1.IntentsBitField.Flags.GuildWebhooks
    | discord_js_1.IntentsBitField.Flags.GuildMessages
    | discord_js_1.IntentsBitField.Flags.GuildMessageReactions
    | discord_js_1.IntentsBitField.Flags.MessageContent;
exports.MINIMUM_BOT_PERMISSIONS = [
    'ViewChannel',
    'SendMessages',
    'EmbedLinks',
];
exports.DEFAULT_BOT_PERMISSIONS = exports.MINIMUM_BOT_PERMISSIONS.concat('AddReactions', 'ManageMessages', 'AttachFiles', 'ReadMessageHistory', 'MentionEveryone', 'UseExternalEmojis', 'ManageWebhooks');
exports.POSTULATE_WEBHOOK_PERMISSIONS = [
    'ViewChannel',
    'SendMessages',
    'SendTTSMessages',
    'EmbedLinks',
    'AttachFiles',
    'MentionEveryone',
];
exports.DEFAULT_LANG = 'ja';
exports.PRESENCE_UPDATE_INTERVAL = 60 * 1000;
exports.COMMAND_EDITABLE_TIME = 5 * 60 * 1000;
exports.MESSAGE_CACHE_LIFETIME = 60 * 60;
exports.MESSAGE_SWEEP_INTERVAL = 60 * 10;
exports.GUILD_RATE_LIMIT = 30;
exports.USER_RATE_LIMIT = 20;
exports.BOT_RATE_LIMIT = 10;
exports.COMMAND_MAX_CHOICES = 20;
exports.COMMAND_QUESTION_MAX = 200;
exports.COMMAND_CHOICE_MAX = 80;
exports.COLORS = {
    HELP: 0xff9440,
    POLL: 0x3b88c3,
    EXPOLL: 0x3b88c4,
    RESULT: 0xdd2e44,
    ENDED: 0x818181,
};
