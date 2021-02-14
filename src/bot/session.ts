import { Client, Message, MessageReaction, PartialUser, Snowflake, User } from 'discord.js';
import { COMMAND_EDITABLE_TIME } from './constants';

type Terminater = (requestID: Snowflake) => void;

export default class Session {
  constructor(
    public  readonly request   : Message,
    public           response  : Message,
    private readonly terminater: Terminater,
  ) {
    this.id   = request.id;
    this.user = request.author;
    this.bot  = request.client;

    request.react(this.cancelEmoji)
      .catch(console.error);

    this.bot.on('messageReactionAdd', this.onCancel);
    this.timeout = this.bot.setTimeout(this.close, COMMAND_EDITABLE_TIME);
  }

  public  readonly id  : Snowflake;
  private readonly user: User;
  private readonly bot : Client;

  private readonly timeout?: NodeJS.Timeout;

  private readonly cancelEmoji = '↩️';

  update(response: Message): void {
    this.response = response;
  }

  cancel(): void {
    if (this.timeout) this.bot.clearTimeout(this.timeout);

    this.response.delete()
      .catch(console.error);

    this.close();
  }

  private onCancel(reaction: MessageReaction, user: User | PartialUser): void {
    if (reaction.emoji.name === this.cancelEmoji && user.id === this.user.id)
      this.cancel();
  }

  close(): void {
    this.bot.off('messageReactionAdd', this.onCancel);

    this.request.reactions.cache.get(this.cancelEmoji)
      ?.users.remove()
        .catch(console.error);

    this.request.channel.messages.cache.delete(this.id);

    this.terminater(this.id);
  }
}
