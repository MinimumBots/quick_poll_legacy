import {
  LoadingTemplate,
  SuccesseTemplate,
  ErrorTemplate,
  ReportTemplate,
} from './template';

export type LocaleStructure = {
  loadings : LoadingTemplate;
  successes: SuccesseTemplate;
  errors   : ErrorTemplate;
  reports  : ReportTemplate;
};

export const DefaultColors: {
  [Group in keyof LocaleStructure]: number;
} = {
  loadings : 0x9867c6,
  successes: 0x67b160,
  errors   : 0xffcc4d,
  reports  : 0xffcc4d,
}

import { ja } from './locales/ja';

export type LocaleID = 'ja';

export const Locales: {
  [ID in LocaleID]: LocaleStructure;
} = {
  ja
};
