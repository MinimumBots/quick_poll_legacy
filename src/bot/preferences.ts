import { Guild, User } from 'discord.js';

import { DEFAULT_LOCALE } from './constants';
import { Locale } from './templates/template';

export const Preferences: {
  fetchUserLocale(user: User): Promise<Locale | undefined>;
  fetchLocale(guild: Guild | null): Promise<Locale>;
} = {
  async fetchUserLocale(user) {
    return DEFAULT_LOCALE;
  },
  async fetchLocale(guild) {
    return DEFAULT_LOCALE;
  }
};
