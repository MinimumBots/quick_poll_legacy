import { MessageEmbedOptions } from 'discord.js';

export type LoadingTemplate = {
  poll(): MessageEmbedOptions;
};

export type SuccesseTemplate = {
  help(
    botInviteURL: string,
  ): MessageEmbedOptions;
  poll(
    authorIconURL: string,
    authorName   : string,
    question     : string,
    choices      : string,
    messageID    : string,
  ): MessageEmbedOptions;
  expoll(
    authorIconURL: string,
    authorName   : string,
    question     : string,
    choices      : string,
    messageID    : string,
  ): MessageEmbedOptions;
  graphpoll(
    authorIconURL: string,
    authorName   : string,
    question     : string,
    choices      : string[],
    choiceCounts : number[],
    choiceRates  : number[],
    choiceGraphs : string[],
  ): MessageEmbedOptions;
  listpoll(
    authorIconURL   : string,
    authorName      : string,
    question        : string,
    choices         : string[],
    choiceCounts    : number[],
    choiceRates     : number[],
    choiceUsersLists: string[],
  ): MessageEmbedOptions;
};

export type ErrorTemplate = {
  unknown()             : MessageEmbedOptions;
  lackPermission(permissionNames: string): MessageEmbedOptions;
  tooManyOptions()      : MessageEmbedOptions;
  tooLongQuestion()     : MessageEmbedOptions;
  tooLongOption()       : MessageEmbedOptions;
  duplicateEmojis()     : MessageEmbedOptions;
  unknownEmoji()        : MessageEmbedOptions;
  unusableEmoji()       : MessageEmbedOptions;
  unavailableExclusive(): MessageEmbedOptions;
  notExistPoll()        : MessageEmbedOptions;
  notPolled()           : MessageEmbedOptions;
};

export type ReportTemplate = {
  error(
    executedCommand: string,
    traceTexts     : string[],
  ): MessageEmbedOptions;
};
