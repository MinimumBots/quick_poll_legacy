import { DiscordAPIError, Message } from 'discord.js';

import { BOT_OWNER_IDS, DEFAULT_LANG } from '../../constants';

import { Locales } from '../templates/locale';
import { Preferences } from '../preferences';
import { Utils } from '../utils';

export namespace Rejecter {
  export async function issue(
    exception: unknown, request: Message<true>
  ): Promise<Message<true> | void> {
    if (exception instanceof DiscordAPIError)
      return await forAPIError(exception, request);
    else
      return await forUnknown(exception, request);
  }

  async function forAPIError(
    exception: DiscordAPIError, request: Message<true>
  ): Promise<Message<true> | void> {
    if (exception.status / 500)
      return destroy(exception);
    else
      return await forUnknown(exception, request);
  }

  async function forUnknown(
    exception: unknown, request: Message<true>
  ): Promise<Message<true>> {
    const lang = await Preferences.fetchLang(request.author, request.guild);
    const embeds = [Locales[lang].errors.unknown()];

    report(exception, request)
      .catch(console.error);

    return await request.channel.send({ embeds });
  }

  function destroy(exception: unknown): void {
    console.error(exception);
  }

  async function report(exception: unknown, request: Message<true>): Promise<void> {
    const stacks = renderStacks(exception);
    const embeds = [Locales[DEFAULT_LANG].reports.error(request.content, stacks)];
    const users = await Promise.all(
      BOT_OWNER_IDS.map(userID => request.client.users.fetch(userID))
    );
    const dmChannels = await Promise.all(users.map(user => user.createDM()));

    await Promise.all(dmChannels.map(channel => channel.send({ embeds })));
  }

  function renderStacks(exception: unknown): string[] {
    let stack: string;

    if (exception instanceof Error)
      stack = exception.stack ?? exception.message;
    else
      stack = JSON.stringify(exception, null, 2);

    return Utils.partingText(stack, 1024, '', '');
  }
}
