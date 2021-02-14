"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceUpdateInterval = exports.BotIntents = void 0;
const discord_js_1 = require("discord.js");
exports.BotIntents = discord_js_1.Intents.NON_PRIVILEGED & ~(discord_js_1.Intents.FLAGS.GUILD_BANS
    | discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS
    | discord_js_1.Intents.FLAGS.GUILD_INVITES
    | discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES
    | discord_js_1.Intents.FLAGS.GUILD_MESSAGE_TYPING
    | discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_TYPING);
exports.PresenceUpdateInterval = 60 * 1000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBcUM7QUFFeEIsUUFBQSxVQUFVLEdBQUcsb0JBQU8sQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUNoRCxvQkFBTyxDQUFDLEtBQUssQ0FBQyxVQUFVO01BQ3hCLG9CQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQjtNQUNoQyxvQkFBTyxDQUFDLEtBQUssQ0FBQyxhQUFhO01BQzNCLG9CQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQjtNQUNoQyxvQkFBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0I7TUFDbEMsb0JBQU8sQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQ3RDLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMifQ==