import { HTTPError, Message } from 'discord.js';

import {
  BOT_OWNER_IDS,
  DEFAULT_LOCALE,
  USABLE_CHANNEL_TYPES
} from '../constants';
import { Preference } from '../preference';
import { Template, TemplateValues } from './template';
import { LocaleTypes, LocaleTemplates } from './locales';
import { bot } from '../bot';
import { partingText } from '../utils';

export default class PollError {
  static async respond(
    exception: unknown, values: TemplateValues, message: Message
  ): Promise<void> {
    if (exception instanceof PollError)
      await this.respondPollError(exception, values, message);
    else if (exception instanceof HTTPError)
      await this.respondHTTPError(exception, message);
    else
      await this.respondUnknown(exception, message);
  }

  private static async respondPollError(
    exception: PollError, values: TemplateValues, message: Message
  ): Promise<void> {
    const locale: LocaleTypes = await this.getLocale(message.channel);
    const template: Template = LocaleTemplates[locale].errors[exception.name];

    if (template)
      await message.channel.send(template.render(values));
    else
      await this.respondUnknown(exception, message);
  }

  private static async respondHTTPError(
    exception: HTTPError, message: Message
  ) {
    if (exception.code / 500)
      this.destroy(exception);
    else
      await this.respondUnknown(exception, message);
  }

  private static async respondUnknown(exception: unknown, message: Message) {
    const locale: LocaleTypes = await this.getLocale(message.channel);
    const template: Template = LocaleTemplates[locale].errors['unknown'];

    message.channel.send(template.render())
      .catch(console.error);
    this.reportError(exception, message)
      .catch(console.error);
  }

  private static async reportError(exception: unknown, message: Message) {
    const users = await Promise.all(
      BOT_OWNER_IDS.map(userID => bot.users.fetch(userID))
    );
    const template = LocaleTemplates[DEFAULT_LOCALE].reports['error'];
    const text = this.generateErrorText(exception);
    const texts = partingText(text, 1024, '```', '```');
    const embed = template.render({ EXECUTED_COMMAND: message.content });

    texts.forEach((text, index) => template.addField(embed, {
      STACK_TRACE_NUMBER: `${index + 1}`, STACK_TRACE_TEXT: text
    }));

    await Promise.all(users.map(user => user.dmChannel?.send(embed)));
  }

  private static generateErrorText(exception: unknown): string {
    if (exception instanceof Error)
      return exception.stack ?? exception.message;
    else
      return String(exception);
  }

  private static destroy(exception: unknown) {
    console.error(exception);
  }

  private static async getLocale(
    channel: USABLE_CHANNEL_TYPES
  ): Promise<LocaleTypes> {
    const guild = channel.type !== 'dm' ? channel.guild : undefined;
    return Preference.fetchLocale(guild);
  }

  constructor(
    readonly name: string,
    readonly values: TemplateValues
  ) {}
}
