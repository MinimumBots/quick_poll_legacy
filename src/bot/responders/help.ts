import { APIEmbed, Client, Message } from 'discord.js';
import { Counter } from '../../transactions/counter';

import { Allocater, RequestChunk } from '../allotters/allocater';
import { Lang, Locales } from '../templates/locale';

export namespace Help{
  export function initialize(bot: Client<true>): void {
    Allocater.entryResponder(`<@${bot.user.id}>`,  chunk => respond(chunk));
    Allocater.entryResponder(`<@!${bot.user.id}>`, chunk => respond(chunk));
  }

  async function respond(chunk: RequestChunk): Promise<Message | null> {
    if (chunk.args.length) return null;

    Counter.count('help');

    return chunk.response
      ? chunk.response.edit({ embeds: [getEmbed(chunk.lang)] })
      : chunk.request.channel.send({ embeds: [getEmbed(chunk.lang)] });
  }

  export function getEmbed(lang: Lang): APIEmbed {
    return Locales[lang].successes.help();
  }
}
