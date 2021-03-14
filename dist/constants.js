"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLORS = exports.COMMAND_CHOICE_MAX = exports.COMMAND_QUESTION_MAX = exports.COMMAND_MAX_CHOICES = exports.BOT_RATE_LIMIT = exports.USER_RATE_LIMIT = exports.COMMAND_EDITABLE_TIME = exports.PRESENCE_UPDATE_INTERVAL = exports.DEFAULT_LANG = exports.ASSUMING_DM_PERMISSIONS = exports.DEFAULT_BOT_PERMISSIONS = exports.MINIMUM_BOT_PERMISSIONS = exports.BOT_INTENTS = exports.DONATION_SERVICE_URL = exports.SUPPORT_SERVER_URL = exports.BOT_DOCUMENT_URL = exports.COMMAND_PREFIX = exports.BOT_TOTAL_SHARDS = exports.BOT_OWNER_IDS = exports.DEBUG_MODE = void 0;
const discord_js_1 = require("discord.js");
exports.DEBUG_MODE = process.env['DEBUG_MODE'] === 'true';
exports.BOT_OWNER_IDS = process.env['BOT_OWNER_IDS']?.split(',') ?? [];
exports.BOT_TOTAL_SHARDS = Number(process.env['BOT_TOTAL_SHARDS']) || 'auto';
exports.COMMAND_PREFIX = process.env['COMMAND_PREFIX'] ?? '/';
exports.BOT_DOCUMENT_URL = process.env['BOT_DOCUMENT_URL'] ?? '';
exports.SUPPORT_SERVER_URL = process.env['SUPPORT_SERVER_URL'] ?? '';
exports.DONATION_SERVICE_URL = process.env['DONATION_SERVICE_URL'] ?? '';
exports.BOT_INTENTS = discord_js_1.Intents.FLAGS.GUILDS
    | discord_js_1.Intents.FLAGS.GUILD_EMOJIS
    | discord_js_1.Intents.FLAGS.GUILD_WEBHOOKS
    | discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    | discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    | discord_js_1.Intents.FLAGS.DIRECT_MESSAGES
    | discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS;
exports.MINIMUM_BOT_PERMISSIONS = [
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'EMBED_LINKS',
];
exports.DEFAULT_BOT_PERMISSIONS = exports.MINIMUM_BOT_PERMISSIONS.concat('ADD_REACTIONS', 'MANAGE_MESSAGES', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'MANAGE_WEBHOOKS');
exports.ASSUMING_DM_PERMISSIONS = [
    'ADD_REACTIONS',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
];
exports.DEFAULT_LANG = 'ja';
exports.PRESENCE_UPDATE_INTERVAL = 60 * 1000;
exports.COMMAND_EDITABLE_TIME = 5 * 60 * 1000;
exports.USER_RATE_LIMIT = 60;
exports.BOT_RATE_LIMIT = 30;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FNb0I7QUFHUCxRQUFBLFVBQVUsR0FBWSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLE1BQU0sQ0FBQztBQUUzRCxRQUFBLGFBQWEsR0FDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBRXRDLFFBQUEsZ0JBQWdCLEdBQ3pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxNQUFNLENBQUM7QUFFekMsUUFBQSxjQUFjLEdBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLENBQUM7QUFFNUIsUUFBQSxnQkFBZ0IsR0FDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUM3QixRQUFBLGtCQUFrQixHQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLFFBQUEsb0JBQW9CLEdBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFakMsUUFBQSxXQUFXLEdBQ3BCLG9CQUFPLENBQUMsS0FBSyxDQUFDLE1BQU07TUFDcEIsb0JBQU8sQ0FBQyxLQUFLLENBQUMsWUFBWTtNQUMxQixvQkFBTyxDQUFDLEtBQUssQ0FBQyxjQUFjO01BQzVCLG9CQUFPLENBQUMsS0FBSyxDQUFDLGNBQWM7TUFDNUIsb0JBQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCO01BQ3JDLG9CQUFPLENBQUMsS0FBSyxDQUFDLGVBQWU7TUFDN0Isb0JBQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUM7QUFFOUIsUUFBQSx1QkFBdUIsR0FBdUI7SUFDekQsY0FBYztJQUNkLGVBQWU7SUFDZixhQUFhO0NBQ2QsQ0FBQztBQUNXLFFBQUEsdUJBQXVCLEdBQ2hDLCtCQUF1QixDQUFDLE1BQU0sQ0FDOUIsZUFBZSxFQUNmLGlCQUFpQixFQUNqQixjQUFjLEVBQ2Qsc0JBQXNCLEVBQ3RCLGtCQUFrQixFQUNsQixxQkFBcUIsRUFDckIsaUJBQWlCLENBQ2xCLENBQUM7QUFDUyxRQUFBLHVCQUF1QixHQUF1QjtJQUN6RCxlQUFlO0lBQ2YsY0FBYztJQUNkLGVBQWU7SUFDZixhQUFhO0lBQ2IsY0FBYztJQUNkLHNCQUFzQjtJQUN0QixrQkFBa0I7SUFDbEIscUJBQXFCO0NBQ3RCLENBQUM7QUFFVyxRQUFBLFlBQVksR0FBUyxJQUFJLENBQUM7QUFLMUIsUUFBQSx3QkFBd0IsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLFFBQUEscUJBQXFCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFdEMsUUFBQSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFFBQUEsY0FBYyxHQUFJLEVBQUUsQ0FBQztBQUVyQixRQUFBLG1CQUFtQixHQUFJLEVBQUUsQ0FBQztBQUMxQixRQUFBLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQUMzQixRQUFBLGtCQUFrQixHQUFLLEVBQUUsQ0FBQztBQUUxQixRQUFBLE1BQU0sR0FBRztJQUNwQixJQUFJLEVBQUksUUFBUTtJQUNoQixJQUFJLEVBQUksUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixLQUFLLEVBQUcsUUFBUTtDQUNqQixDQUFDIn0=