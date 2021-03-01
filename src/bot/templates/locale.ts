import { Template, TemplateData } from './template';
import { localeData as ja } from './locales/ja';

type LocaleGroup = 'loadings' | 'successes' | 'errors' | 'reports';

export type LocaleStructure<T> = {
  [Group in LocaleGroup]: { [name: string]: T };
};

const localeGroups: LocaleGroup[] = [
  'loadings', 'successes', 'errors', 'reports'
];
const defaultColors: { [Group in LocaleGroup]: number } = {
  loadings : 0x9867c6,
  successes: 0x67b160,
  errors   : 0xffcc4d,
  reports  : 0xffcc4d,
};

function organizeTemplate(
  data: LocaleStructure<TemplateData>, group: LocaleGroup, name: string
): Template {
  const datum = { ...data[group][name] };
  datum.color ??= defaultColors[group];
  return new Template(datum);
}

function organizeLocale(
  data: LocaleStructure<TemplateData>
): LocaleStructure<Template> {
  const locale: LocaleStructure<Template> = {
    loadings: {}, successes: {}, errors: {}, reports: {}
  };

  for (const group of localeGroups)
    for (const name in data[group])
      locale[group][name] = organizeTemplate(data, group, name);

  return locale;
}

export type LocaleID = 'ja';

export const Locales: { [ID in LocaleID]: LocaleStructure<Template> } = {
  ja: organizeLocale(ja)
};