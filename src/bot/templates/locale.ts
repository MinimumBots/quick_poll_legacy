import {
  LoadingTemplate,
  SuccesseTemplate,
  ErrorTemplate,
  ReportTemplate,
  PermissionNameTemplate,
} from './template';

export type LocaleStructure = {
  permissionNames: PermissionNameTemplate;
  loadings : LoadingTemplate;
  successes: SuccesseTemplate;
  errors   : ErrorTemplate;
  reports  : ReportTemplate;
};

export const DefaultColors: {
  [Group in keyof LocaleStructure]: number;
} = {
　permissionNames: 0x000000,
  loadings : 0x9867c6,
  successes: 0x67b160,
  errors   : 0xffcc4d,
  reports  : 0xffcc4d,
}

import { ja } from './locales/ja';

export type Lang = 'ja';

export const Locales: {
  [Key in Lang]: LocaleStructure;
} = {
  ja
};
