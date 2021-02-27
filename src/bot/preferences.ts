import { Guild, User } from 'discord.js';

import { DEFAULT_LOCALE } from './constants';
import { Locale } from './templates/template';

export const Preferences: {
  fetchLocale(user: User, guild?: Guild | null): Promise<Locale>;
  fetchUserLocale(user: User): Promise<Locale | undefined>;
  fetchGuildLocale(guild: Guild | null): Promise<Locale | undefined>;
} = {
  async fetchLocale(user, guild) {
    return (
      await this.fetchUserLocale(user)
      ?? (guild && await this.fetchGuildLocale(guild))
      ?? DEFAULT_LOCALE
    );
  },
  async fetchUserLocale(user) {
    return undefined;
  },
  async fetchGuildLocale(guild) {
    return undefined;
  }
};
