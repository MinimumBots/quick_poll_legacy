import { Client, Message, MessageEmbedOptions } from 'discord.js';

import { DEFAULT_BOT_PERMISSIONS } from '../../constants';
import { Allocater, RequestData } from '../allotters/allocater';
import { Lang, Locales } from '../templates/locale';

export namespace Help{
  export function initialize(bot: Client): void {
    entryResponder(bot);
    generateInviteURL(bot);
  }

  function entryResponder(bot: Client): void {
    if (!bot.user) 
      bot.setTimeout(() => entryResponder(bot), 30000);
    else {
      Allocater.responders.set(
        `<@${bot.user.id}>`,  data => respond(data)
      );
      Allocater.responders.set(
        `<@!${bot.user.id}>`, data => respond(data)
      );
    }
  }

  let botInviteURL = '';

  function generateInviteURL(bot: Client): void {
    bot.generateInvite({ permissions: DEFAULT_BOT_PERMISSIONS })
      .then(url => botInviteURL = url)
      .catch(() => bot.setTimeout(() => generateInviteURL(bot), 30000));
  }

  async function respond(data: RequestData): Promise<Message | null> {
    if (data.args.length) return null;

    return data.response
      ? data.response.edit({ embed: getEmbed(data.lang) })
      : data.request.channel.send({ embed: getEmbed(data.lang) });
  }

  export function getEmbed(lang: Lang): MessageEmbedOptions {
    return Locales[lang].successes.help(botInviteURL);
  }
}
