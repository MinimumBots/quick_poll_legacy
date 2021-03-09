import { Client, Collection, Message, Snowflake } from 'discord.js';

import { DEBUG_MODE } from '../../constants';
import Session from './session';
import { Help } from '../responders/help';
import { Rejecter } from '../responders/rejecter';
import { Utils } from '../utils';
import { Preferences } from '../preferences';
import { Lang } from '../templates/locale';

export interface RequestData {
  request : Message;
  prefix  : string;
  args    : string[];
  response: Message | null;
  lang    : Lang;
}

export type Responder = (data: RequestData) => Promise<Message | undefined>;

export type CommandArgs = string[];

export namespace Allocater {
  export function initialize(bot: Client): void {
    Help.initialize(bot);
  }

  export const responders: Collection<string, Responder> = new Collection;
  const sessions: Collection<Snowflake, Session> = new Collection;

  export function submit(
    request: Message, prefix: string, args: CommandArgs
  ): void {
    const responder = responders.get(prefix);
    if (responder)
      respond(request, responder, prefix, args)
        .catch(console.error);
  }

  async function respond(
    request: Message, responder: Responder, prefix: string, args: CommandArgs
  ): Promise<void> {
    const session  = sessions.get(request.id);
    const response = session?.response ?? null;
    const lang     = await Preferences.fetchLang(request.author, request.guild);

    try {
      const newResponse = await responder({
        request, prefix, args, response, lang
      });
      allocate(request, newResponse, session);
    }
    catch (exception: unknown) {
      reject(exception, request);
    }
  }

  function reject(exception: unknown, request: Message): void {
    if (DEBUG_MODE) console.error(exception);

    Rejecter.issue(exception, request)
      .then(response => response && allocate(request, response))
      .catch(console.error);
  }

  function allocate(
    request: Message, response?: Message, session?: Session
  ): void {
    if (!response)
      Utils.removeMessageCache(request);
    else if (!session)
      sessions.set(
        request.id, new Session(request, response, id => free(id))
      );
  }

  function free(requestID: Snowflake): void {
    sessions.delete(requestID);
  }
};
