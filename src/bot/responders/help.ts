import { Client, Message, MessageEmbedOptions, Snowflake } from 'discord.js';

import { DEFAULT_BOT_PERMISSIONS } from '../../constants';
import { Allocater, RequestData } from '../allotters/allocater';
import { Lang, Locales } from '../templates/locale';

export namespace Help{
  export function initialize(bot: Client, botID: Snowflake): void {
    entryResponder(botID);
    generateInviteURL(bot);
  }

  function entryResponder(botID: Snowflake): void {
    Allocater.responders.set(
      `<@${botID}>`,  data => respond(data)
    );
    Allocater.responders.set(
      `<@!${botID}>`, data => respond(data)
    );
  }

  let botInviteURL = '';

  function generateInviteURL(bot: Client): void {
    bot.generateInvite({ permissions: DEFAULT_BOT_PERMISSIONS })
      .then(url => botInviteURL = url)
      .catch(console.error);
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
