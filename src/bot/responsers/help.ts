import { ClientUser } from 'discord.js';

let mentionRegex: RegExp;

export const initialize = (botUser: ClientUser | null): void => {
  if (botUser) mentionRegex = RegExp(`^<@!?${botUser.id}>$`);
}

export const validate = (content: string): boolean => {
  return mentionRegex.test(content);
}
