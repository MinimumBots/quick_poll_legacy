import { Message,  MessageEmbedOptions } from 'discord.js';
import { COMMAND_PREFIX } from '../../constants';

import { Allocater, RequestChunk } from '../allotters/allocater';
import { DefaultColors } from '../templates/locale';

export namespace Transition {
  export function initialize(): void {
    Allocater.entryResponder('/poll',     chunk => respond(chunk, 'poll'));
    Allocater.entryResponder('/expoll',   chunk => respond(chunk, 'expoll'));
    Allocater.entryResponder('/sumpoll',  chunk => respond(chunk, 'sumpoll'));
    Allocater.entryResponder('/endpoll',  chunk => respond(chunk, 'endpoll'));
    Allocater.entryResponder('/csvpoll',  chunk => respond(chunk, 'csvpoll'));
  }

  async function respond(
    chunk: RequestChunk, name: string
  ): Promise<Message | null> {
    const embed: MessageEmbedOptions = {
      color: DefaultColors.errors,
      title: `⚠️ コマンドプレフィックスは「/」から「${COMMAND_PREFIX}」へ変更されました`,
      description: `\`/${name}\` は \`${COMMAND_PREFIX}${name}\` になります`
    }

    return chunk.response
      ? chunk.response.edit({ embed })
      : chunk.request.channel.send({ embed });
  }
}
