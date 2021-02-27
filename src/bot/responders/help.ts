import { Guild, Message, MessageEmbed, User } from 'discord.js';

import { USABLE_CHANNEL_TYPES } from '../constants';
import { bot, botInviteURL } from '../bot';
import { Allocater, Responder } from '../allotters/allocater';
import { Templates } from '../templates/template';
import { Preferences } from '../preferences';

const Help: {
  respond: Responder;
  create: (channel: USABLE_CHANNEL_TYPES, embed: MessageEmbed) => Promise<Message>;
  edit: (response: Message, embed: MessageEmbed) => Promise<Message>;

  getEmbed: (user: User, guild: Guild | null) => Promise<MessageEmbed>;
} = {
  async respond(request, args, response) {
    if (args !== []) return undefined;

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
    return Templates[locale].successes['help'].render({ botInviteURL });
  }
}

function entryResponder(): void {
  const botUser = bot.user;
  if (!botUser) {
    bot.setTimeout(entryResponder, 30000);
    return;
  }

  Allocater.responders.set(botUser.toString(),  Help.respond);
  Allocater.responders.set(`<@!${botUser.id}>`, Help.respond);
}

bot.on('ready', entryResponder);
