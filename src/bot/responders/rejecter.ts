import { HTTPError, Message } from 'discord.js';

import { BOT_OWNER_IDS, DEFAULT_LANG } from '../../constants';

import { Locales } from '../templates/locale';
import { Preferences } from '../preferences';
import { Utils } from '../utils';

export namespace Rejecter {
  export async function issue(
    exception: unknown, request: Message
  ): Promise<Message | void> {
    if (exception instanceof HTTPError)
      return await forHTTPError(exception, request);
    else
      return await forUnknown(exception, request);
  }

  async function forHTTPError(
    exception: HTTPError, request: Message
  ): Promise<Message | void> {
    if (exception.code / 500)
      return destroy(exception);
    else
      return await forUnknown(exception, request);
  }

  async function forUnknown(
    exception: unknown, request: Message
  ): Promise<Message> {
    const lang = await Preferences.fetchLang(request.author, request.guild);
    const template = Locales[lang].errors.unknown();

    report(exception, request)
      .catch(console.error);

    return await request.channel.send(template);
  }

  function destroy(exception: unknown): void {
    console.error(exception);
  }

  async function report(exception: unknown, request: Message): Promise<void> {
    const stacks = renderStacks(exception);
    const template = Locales[DEFAULT_LANG].reports.error(
      request.content, stacks
    );
    const users = await Promise.all(
      BOT_OWNER_IDS.map(userID => request.client.users.fetch(userID))
    );

    await Promise.all(users.map(user => user.dmChannel?.send(template)));
  }

  function renderStacks(exception: unknown): string[] {
    let stack: string;

    if (exception instanceof Error)
      stack = exception.stack ?? exception.message;
    else
      stack = String(exception);

    return Utils.partingText(stack, 1024, '```', '```');
  }
}
