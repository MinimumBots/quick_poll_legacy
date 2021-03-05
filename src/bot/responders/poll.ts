import { Client, Collection, Channel, Message, MessageEmbedOptions, Role, Snowflake, GuildChannel } from 'discord.js';

import { COMMAND_PREFIX, USABLE_GUILD_CHANNEL } from '../../constants';
import { Lang, Locales } from '../templates/locale';
import { Allocater, Responder } from '../allotters/allocater';
import { Preferences } from '../preferences';
import CommandError from './error';

type Channels = Collection<Snowflake, Channel>;
type Choice = { emoji: string, text: string };

interface ParsedData {
  exclusive: boolean;
  channel?: USABLE_GUILD_CHANNEL;
  roles   : Role[];
  question: string;
  choices : Choice[];
}

export const Poll: {
  readonly prefixes: { poll: string, expoll: string };

  initialize(bot: Client): void;

  respond: Responder;

  generate(
    request: Message,
    prefix: string,
    args: string[],
    response: Message,
    lang: Lang,
  ): Promise<MessageEmbedOptions>;

  parse(
    request: Message, prefix: string, args: string[], lang: Lang
  ): ParsedData;
  parseChannel(
    request: Message, args: string[], lang: Lang
  ): USABLE_GUILD_CHANNEL | undefined;
  parseRoles(request: Message, args: string[], lang: Lang): Role[];
  parseQuestion(args: string[], lang: Lang): string;
  parseChoices(args: string[], lang: Lang): Choice[];

  getChannelID(
    arg: string, channel: USABLE_GUILD_CHANNEL | undefined, lang: Lang
  ): Snowflake | undefined;
  searchChannel(
    request: Message, channels: Channels, channelID: Snowflake, lang: Lang
  ): USABLE_GUILD_CHANNEL;

  giveSelectors(response: Message, data: ParsedData): Promise<void>;

  render(data: ParsedData): MessageEmbedOptions;
  renderError(error: string): MessageEmbedOptions;

  // hasPollPermissions(request: Message): boolean;
  // hasExpollPermissions(request: Message): boolean;

} = {
  prefixes: {
    poll  : `${COMMAND_PREFIX}poll`,
    expoll: `${COMMAND_PREFIX}expoll`,
  },

  initialize() {
    Allocater.responders.set(
      this.prefixes.poll,   (...params) => this.respond(...params)
    );
    Allocater.responders.set(
      this.prefixes.expoll, (...params) => this.respond(...params)
    );
  },

  async respond(request, prefix, args, response) {
    const lang = await Preferences.fetchLang(request.author, request.guild);
    response ??= await request.channel.send(Locales[lang].loadings.poll());

    const embed = await this.generate(request, prefix, args, response, lang);
    
    return response.edit({ embed });
  },

  async generate(request, prefix, args, response, lang) {
    try {
      const data = this.parse(request, prefix, args, lang);
      this.giveSelectors(response, data);
      return this.render(data);
    }
    catch (error: unknown) {
      if (typeof error === 'string') return this.renderError(error);
      throw error;
    }
  },

  parse(request, prefix, args, lang) {
    return {
      exclusive: prefix === this.prefixes.expoll,
      channel: this.parseChannel(request, args, lang),
      roles  : this.parseRoles  (request, args, lang),
      question: this.parseQuestion(args, lang),
      choices : this.parseChoices (args, lang),
    };
  },
  parseChannel(request, args, lang) {
    const channels = request.mentions.channels as Channels;
    let channel: USABLE_GUILD_CHANNEL | undefined;

    for (const arg of args) {
      const channelID = this.getChannelID(arg, channel, lang);
      if (!channelID) break;
      channel = this.searchChannel(request, channels, channelID, lang);
      args.shift();
    }
    return channel;
  },

  getChannelID(arg, channel, lang) {
    const match = arg.match(/^<#(\d+)>$/);
    if (!match) return;
    if (match && channel) throw new CommandError('duplicateChannels', lang);
    return match[1];
  },
  searchChannel(request, channels, channelID, lang) {
    const channel = channels.get(channelID);
    if (!channel) throw new CommandError('unusableChannel', lang);
    if (channel.type === 'dm')
      throw new CommandError('unavailableChannel', lang);
    if (
      !(channel instanceof GuildChannel)
      || channel.guild.id !== request.guild?.id
      || !channel.isText()
    ) throw new CommandError('unusableChannel', lang);
    return channel;
  }
};
