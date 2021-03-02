import {
  LoadingTemplate,
  SuccesseTemplate,
  ErrorTemplate,
  ReportTemplate
} from './template';

export type LocaleStructure = {
  loadings : LoadingTemplate;
  successes: SuccesseTemplate;
  errors   : ErrorTemplate;
  reports  : ReportTemplate;
};

import { ja } from './locales/ja';

export type LocaleID = 'ja';

export const Locales: {
  [ID in LocaleID]: LocaleStructure;
} = {
  ja
};
