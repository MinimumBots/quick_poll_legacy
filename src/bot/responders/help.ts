import { Client, Guild, Message, MessageEmbed, User } from 'discord.js';

import { DEFAULT_BOT_PERMISSIONS, USABLE_CHANNEL_TYPES } from '../constants';
import { Allocater, Responder } from '../allotters/allocater';
import { Templates } from '../templates/template';
import { Preferences } from '../preferences';

export const Help: {
  initialize(bot: Client): void;
  entryResponder(bot: Client): void;
  generateInviteURL(bot: Client): void;
  botInviteURL: string;

  respond: Responder;
  create: (
    channel: USABLE_CHANNEL_TYPES, embed: MessageEmbed
  ) => Promise<Message>;
  edit: (response: Message, embed: MessageEmbed) => Promise<Message>;

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
        `<@${bot.user.id}>`,  (...params) => Help.respond(...params)
      );
      Allocater.responders.set(
        `<@!${bot.user.id}>`, (...params) => Help.respond(...params)
      );
    }
  },
  generateInviteURL(bot) {
    bot.generateInvite({ permissions: DEFAULT_BOT_PERMISSIONS })
      .then(url => this.botInviteURL = url)
      .catch(() => bot.setTimeout(() => this.generateInviteURL(bot), 30000));
  },
  botInviteURL: '',

  async respond(request, args, response) {
    if (args.length) return;

    const embed = await this.getEmbed(request.author, request.guild);
    if (!response)
      return this.create(request.channel, embed);
    else
      return this.edit(response, embed);
  },
  create(channel, embed) {
    return channel.send(embed);
  },
  edit(response, embed) {
    return response.edit(embed);
  },

  async getEmbed(user, guild) {
    const locale = await Preferences.fetchLocale(user, guild);
    return Templates[locale].successes['help'].render({
      botInviteURL: this.botInviteURL
    });
  }
}
