import { MessageEmbedOptions, PermissionString } from 'discord.js';

export type PermissionNameTemplate = {
  [Name in PermissionString]: string;
};

export type LoadingTemplate = {
  poll(exclusive: boolean): MessageEmbedOptions;
};

export type SuccesseTemplate = {
  help(
    botInviteURL: string,
  ): MessageEmbedOptions;
  poll(
    exclusive    : boolean,
    authorIconURL: string,
    authorName   : string,
    question     : string,
    selectors    : string[],
    choices      : string[],
    imageName    : string | null,
    channelID    : string,
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
    choiceTops   : boolean[],
    choiceRates  : string[],
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
    choiceTops      : boolean[],
    choiceRates     : string[],
    choiceUsersLists: string[],
  ): MessageEmbedOptions;
  endpoll(): MessageEmbedOptions;
};

export type ErrorTemplate = {
  unknown()          : MessageEmbedOptions;
  lackPermissions    (permissions: PermissionString[]): MessageEmbedOptions;
  lackYourPermissions(permissions: PermissionString[]): MessageEmbedOptions;
  duplicateChannels(): MessageEmbedOptions;
  unusableChannel()  : MessageEmbedOptions;
  unusableRole()     : MessageEmbedOptions;
  ungivenQuestion()  : MessageEmbedOptions;
  tooManyOptions()   : MessageEmbedOptions;
  tooLongQuestion()  : MessageEmbedOptions;
  tooLongOption()    : MessageEmbedOptions;
  duplicateEmojis()  : MessageEmbedOptions;
  unusableEmoji()    : MessageEmbedOptions;
  ungivenMessageID() : MessageEmbedOptions;
  notFoundChannel()  : MessageEmbedOptions;
  notFoundPoll()     : MessageEmbedOptions;
  missingFormatPoll(): MessageEmbedOptions;
  unavailableExport(): MessageEmbedOptions;
};

export type ReportTemplate = {
  error(
    executedCommand: string,
    traceTexts     : string[],
  ): MessageEmbedOptions;
};
