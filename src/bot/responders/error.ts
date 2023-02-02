import { APIEmbed, PermissionsString } from 'discord.js';

import { ErrorTemplate } from '../templates/template';
import { Lang, Locales } from '../templates/locale';

export default class CommandError {
  embed: APIEmbed;

  constructor(
    readonly name: keyof ErrorTemplate,
    readonly lang: Lang,
    readonly permissions?: PermissionsString[],
  ) {
    this.embed = Locales[lang].errors[name](permissions ?? []);
  }
}
