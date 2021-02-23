import { Guild } from 'discord.js';
import { DEFAULT_LOCALE } from './constants';
import { LocaleTypes } from './templates/locale';

export const Preference = {
  async fetchLocale(guild?: Guild): Promise<LocaleTypes> {
    return DEFAULT_LOCALE;
  }
};
