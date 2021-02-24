import { Collection, Message, Snowflake } from 'discord.js';

import Session from './session';
import { Rejecter } from '../responders/rejecter';

export type Responder
  = (request: Message, args: string[], response?: Message) => Promise<Message>;
export type CommandArgs = string[];

export const Allocater: {
  readonly responders: Collection<string, Responder>;
  readonly sessions  : Collection<Snowflake, Session>;

  submit(request: Message, prefix: string, args: CommandArgs): void;
  respond(request: Message, responder: Responder, args: CommandArgs): void;

  exception(exception: unknown, request: Message): void;

  allocate(request: Message, response: Message, session?: Session): void;
  free(requestID: Snowflake): void;
} = {
  responders: new Collection,
  sessions  : new Collection,

  submit(request, prefix, args) {
    const responder = this.responders.get(prefix);
    if (responder) this.respond(request, responder, args);
  },
  respond(request, responder, args) {
    const session = this.sessions.get(request.id);
    const response = session?.response;

    responder(request, args, response)
      .then(response => this.allocate(request, response, session))
      .catch(exception => this.exception(exception, request));
  },

  exception(exception, request) {
    Rejecter.issue(exception, request)
      .then(response => response && this.allocate(request, response))
      .catch(console.error);
  },

  allocate(request, response, session) {
    if (!session) this.sessions.set(
      request.id,
      new Session(request, response, this.free)
    );
  },
  free(requestID) {
    this.sessions.delete(requestID);
  }
};
