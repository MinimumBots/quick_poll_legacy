import { Guild, User } from 'discord.js';

import { DEFAULT_LOCALE } from './constants';
import { LocaleID } from './templates/locale';

export const Preferences: {
  fetchLocale(user: User, guild?: Guild | null): Promise<LocaleID>;
  fetchUserLocale(user: User): Promise<LocaleID | undefined>;
  fetchGuildLocale(guild: Guild | null): Promise<LocaleID | undefined>;
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
