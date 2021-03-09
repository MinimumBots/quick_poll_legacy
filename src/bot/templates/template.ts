import { MessageEmbedOptions, PermissionString } from 'discord.js';

export type PermissionNameTemplate = {
  [Name in PermissionString]: string;
};

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
    selectors    : string[],
    choices      : string[],
    messageID    : string,
  ): MessageEmbedOptions;
  expoll(
    authorIconURL: string,
    authorName   : string,
    question     : string,
    selectors    : string[],
    choices      : string[],
    messageID    : string,
  ): MessageEmbedOptions;
  graphpoll(
    pollURL      : string,
    authorIconURL: string,
    authorName   : string,
    question     : string,
    selectors    : string[],
    choices      : string[],
    choiceCounts : number[],
    choiceRates  : number[],
    choiceGraphs : string[],
  ): MessageEmbedOptions;
  listpoll(
    pollURL         : string,
    authorIconURL   : string,
    authorName      : string,
    question        : string,
    selectors       : string[],
    choices         : string[],
    choiceCounts    : number[],
    choiceRates     : number[],
    choiceUsersLists: string[],
  ): MessageEmbedOptions;
};

export type ErrorTemplate = {
  unknown()             : MessageEmbedOptions;
  lackPermission(permissionNames: string[]): MessageEmbedOptions;
  duplicateChannels()   : MessageEmbedOptions;
  unusableChannel()     : MessageEmbedOptions;
  unavailableChannel()  : MessageEmbedOptions;
  unusableRole()        : MessageEmbedOptions;
  ungivenQuestion()     : MessageEmbedOptions;
  tooManyOptions()      : MessageEmbedOptions;
  tooLongQuestion()     : MessageEmbedOptions;
  tooLongOption()       : MessageEmbedOptions;
  duplicateEmojis()     : MessageEmbedOptions;
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
