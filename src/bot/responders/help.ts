import { Client, Message, MessageEmbedOptions, Snowflake } from 'discord.js';

import { DEFAULT_BOT_PERMISSIONS } from '../../constants';
import { Allocater, RequestChunk } from '../allotters/allocater';
import { Lang, Locales } from '../templates/locale';

export namespace Help{
  let botInviteURL = '';

  export function initialize(bot: Client, botID: Snowflake): void {
    Allocater.entryResponder(`<@${botID}>`,  chunk => respond(chunk));
    Allocater.entryResponder(`<@!${botID}>`, chunk => respond(chunk));

    bot.generateInvite({ permissions: DEFAULT_BOT_PERMISSIONS })
      .then(url => botInviteURL = url)
      .catch(console.error);
  }

  async function respond(chunk: RequestChunk): Promise<Message | null> {
    if (chunk.args.length) return null;

    return chunk.response
      ? chunk.response.edit({ embed: getEmbed(chunk.lang) })
      : chunk.request.channel.send({ embed: getEmbed(chunk.lang) });
  }

  export function getEmbed(lang: Lang): MessageEmbedOptions {
    return Locales[lang].successes.help(botInviteURL);
  }
}
