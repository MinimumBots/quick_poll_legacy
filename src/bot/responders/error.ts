import { MessageEmbedOptions, PermissionString } from 'discord.js';

import { ErrorTemplate } from '../templates/template';
import { Lang, Locales } from '../templates/locale';

export default class CommandError {
  embed: MessageEmbedOptions;

  constructor(
    readonly name: keyof ErrorTemplate,
    readonly lang: Lang,
    readonly permissions?: PermissionString[],
  ) {
    this.embed = Locales[lang].errors[name](permissions ?? []);
  }
}
