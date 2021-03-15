import { Client, Collection, Message, Snowflake } from 'discord.js';

import { DEBUG_MODE } from '../../constants';
import { Session } from './session';
import { Help } from '../responders/help';
import { Rejecter } from '../responders/rejecter';
import { Utils } from '../utils';
import { Preferences } from '../preferences';
import { Lang } from '../templates/locale';
import { Poll } from '../responders/poll';
import { Result } from '../responders/result';

export interface RequestData {
  botID   : Snowflake,
  request : Message,
  prefix  : string,
  args    : string[],
  response: Message | null,
  lang    : Lang,
}

export type Responder = (data: RequestData) => Promise<Message | null>;

export type CommandArgs = string[];

export namespace Allocater {
  export function initialize(bot: Client, botID: Snowflake): void {
    Help.initialize(bot, botID);
    Poll.initialize();
    Result.initialize();
  }

  export const responders: Collection<string, Responder> = new Collection;

  export function submit(
    request: Message, prefix: string, args: CommandArgs, botID: Snowflake
  ): void {
    const responder = responders.get(prefix);
    if (responder)
      respond(request, responder, prefix, args, botID)
        .catch(console.error);
  }

  async function respond(
    request: Message, responder: Responder,
    prefix: string, args: CommandArgs, botID: Snowflake
  ): Promise<void> {
    const session  = Session.get(request.id);
    const response = session?.response ?? null;
    const lang     = await Preferences.fetchLang(request.author, request.guild);

    try {
      const newResponse = await responder({
        botID, request, prefix, args, response, lang
      });
      if (!newResponse) return;

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
    request: Message, response: Message | null, session?: Session.Data | null
  ): void {
    if (!response)
      Utils.removeMessageCache(request);
    else if (!session)
      Session.create(request, response);
  }
};
