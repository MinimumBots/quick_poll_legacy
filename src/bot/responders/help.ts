import { Client, Guild, MessageEmbed, User } from 'discord.js';

import { DEFAULT_BOT_PERMISSIONS } from '../../constants';
import { Allocater, Responder } from '../allotters/allocater';
import { Locales } from '../templates/locale';
import { Preferences } from '../preferences';

export const Help: {
  initialize(bot: Client): void;
  entryResponder(bot: Client): void;
  botInviteURL: string;
  generateInviteURL(bot: Client): void;

  respond: Responder;
  getEmbed: (user: User, guild: Guild | null) => Promise<MessageEmbed>;
} = {
  initialize(bot) {
    this.entryResponder(bot);
    this.generateInviteURL(bot);
  },
  entryResponder(bot) {
    if (!bot.user) 
      bot.setTimeout(() => this.entryResponder(bot), 30000);
    else {
      Allocater.responders.set(
        `<@${bot.user.id}>`,  (...params) => this.respond(...params)
      );
      Allocater.responders.set(
        `<@!${bot.user.id}>`, (...params) => this.respond(...params)
      );
    }
  },
  botInviteURL: '',
  generateInviteURL(bot) {
    bot.generateInvite({ permissions: DEFAULT_BOT_PERMISSIONS })
      .then(url => this.botInviteURL = url)
      .catch(() => bot.setTimeout(() => this.generateInviteURL(bot), 30000));
  },

  async respond(request, _, args, response) {
    if (args.length) return;

    const embed = await this.getEmbed(request.author, request.guild);
    return response ? response.edit(embed) : request.channel.send(embed);
  },

  async getEmbed(user, guild) {
    const lang = await Preferences.fetchLang(user, guild);
    const template = Locales[lang].successes.help(this.botInviteURL);
    return new MessageEmbed(template);
  }
}
