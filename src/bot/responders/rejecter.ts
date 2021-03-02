import { HTTPError, Message } from 'discord.js';

import { BOT_OWNER_IDS, DEFAULT_LOCALE } from '../../constants';

import { Locales } from '../templates/locale';
import { Preferences } from '../preferences';
import { Utils } from '../utils';

export const Rejecter: {
  issue(exception: unknown, request: Message): Promise<Message | void>;

  forHTTPError(exception: HTTPError, request: Message): Promise<Message | void>;
  forUnknown(exception: unknown, request: Message): Promise<Message>;
  destroy(exception: unknown): void;

  report(exception: unknown, request: Message): Promise<void>;
  renderStacks(exception: unknown): string[];
} = {
  async issue(exception, request) {
    if (exception instanceof HTTPError)
      return await this.forHTTPError(exception, request);
    else
      return await this.forUnknown(exception, request);
  },

  async forHTTPError(exception, request) {
    if (exception.code / 500)
      return this.destroy(exception);
    else
      return await this.forUnknown(exception, request);
  },
  async forUnknown(exception, request) {
    const locale = await Preferences.fetchLocale(request.author, request.guild);
    const template = Locales[locale].errors.unknown();

    this.report(exception, request)
      .catch(console.error);

    return await request.channel.send(template);
  },
  destroy(exception) {
    console.error(exception);
  },

  async report(exception, request) {
    const stacks = this.renderStacks(exception);
    const template = Locales[DEFAULT_LOCALE].reports.error(
      request.content, stacks
    );
    const users = await Promise.all(
      BOT_OWNER_IDS.map(userID => request.client.users.fetch(userID))
    );

    await Promise.all(users.map(user => user.dmChannel?.send(template)));
  },
  renderStacks(exception) {
    let stack: string;

    if (exception instanceof Error)
      stack = exception.stack ?? exception.message;
    else
      stack = String(exception);

    return Utils.partingText(stack, 1024, '```', '```');
  }
}
