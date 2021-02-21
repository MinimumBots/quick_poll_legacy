import { Guild } from 'discord.js';
import { DEFAULT_LOCALE } from './constants';
import { LocaleTypes } from './responses/locales';

export const Preference = {
  async fetchLocale(guild?: Guild): Promise<LocaleTypes> {
    return DEFAULT_LOCALE;
  }
};
