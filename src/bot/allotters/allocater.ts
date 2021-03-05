import { Client, Collection, Message, Snowflake } from 'discord.js';

import { DEBUG_MODE } from '../../constants';
import Session from './session';
import { Help } from '../responders/help';
import { Rejecter } from '../responders/rejecter';
import { Utils } from '../utils';

export type Responder = (
  request: Message, prefix: string, args: string[], response?: Message
) => Promise<Message | undefined>;
export type CommandArgs = string[];

export const Allocater: {
  initialize(bot: Client): void;

  readonly responders: Collection<string, Responder>;
  readonly sessions  : Collection<Snowflake, Session>;

  submit(request: Message, prefix: string, args: CommandArgs): void;
  respond(
    request: Message, responder: Responder, prefix: string, args: CommandArgs
  ): void;

  exception(exception: unknown, request: Message): void;

  allocate(request: Message, response?: Message, session?: Session): void;
  free(requestID: Snowflake): void;
} = {
  initialize(bot) {
    Help.initialize(bot);
  },

  responders: new Collection,
  sessions  : new Collection,

  submit(request, prefix, args) {
    const responder = this.responders.get(prefix);
    if (responder) this.respond(request, responder, prefix, args);
  },
  respond(request, responder, prefix, args) {
    const session = this.sessions.get(request.id);
    const response = session?.response;

    responder(request, prefix, args, response)
      .then(response => this.allocate(request, response, session))
      .catch(exception => this.exception(exception, request));
  },

  exception(exception, request) {
    if (DEBUG_MODE) console.error(exception);

    Rejecter.issue(exception, request)
      .then(response => response && this.allocate(request, response))
      .catch(console.error);
  },

  allocate(request, response, session) {
    if (!response)
      Utils.removeMessageCache(request);
    else if (!session)
      this.sessions.set(
        request.id, new Session(request, response, id => this.free(id))
      );
  },
  free(requestID) {
    this.sessions.delete(requestID);
  }
};
