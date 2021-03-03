import { Guild, User } from 'discord.js';

import { DEFAULT_LANG } from '../constants';
import { Lang } from './templates/locale';

export const Preferences: {
  fetchLang(user: User, guild?: Guild | null): Promise<Lang>;
  fetchUserLang(user: User): Promise<Lang | undefined>;
  fetchGuildLang(guild: Guild | null): Promise<Lang | undefined>;
} = {
  async fetchLang(user, guild) {
    return (
      await this.fetchUserLang(user)
      ?? (guild && await this.fetchGuildLang(guild))
      ?? DEFAULT_LANG
    );
  },
  async fetchUserLang(user) {
    return undefined;
  },
  async fetchGuildLang(guild) {
    return undefined;
  }
};
