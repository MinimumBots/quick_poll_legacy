import { APIEmbed, PermissionsString } from 'discord.js';

export type PermissionNameTemplate = Record<PermissionsString, string>;

export type LoadingTemplate = {
  poll(exclusive: boolean): APIEmbed;
};

export type SuccesseTemplate = {
  help(): APIEmbed;
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
  ): APIEmbed;
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
  ): APIEmbed;
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
  ): APIEmbed;
  endpoll(): APIEmbed;
};

export type ErrorTemplate = {
  unknown()          : APIEmbed;
  lackPermissions    (permissions: PermissionsString[]): APIEmbed;
  lackYourPermissions(permissions: PermissionsString[]): APIEmbed;
  duplicateChannels(): APIEmbed;
  unusableChannel()  : APIEmbed;
  unusableRole()     : APIEmbed;
  ungivenQuestion()  : APIEmbed;
  tooManyOptions()   : APIEmbed;
  tooLongQuestion()  : APIEmbed;
  tooLongOption()    : APIEmbed;
  duplicateEmojis()  : APIEmbed;
  unusableEmoji()    : APIEmbed;
  ungivenMessageID() : APIEmbed;
  notFoundChannel()  : APIEmbed;
  notFoundPoll()     : APIEmbed;
  missingFormatPoll(): APIEmbed;
  unavailableExport(): APIEmbed;
};

export type ReportTemplate = {
  error(
    executedCommand: string,
    traceTexts     : string[],
  ): APIEmbed;
};
