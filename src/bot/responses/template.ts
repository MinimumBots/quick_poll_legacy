import { MessageEmbed } from "discord.js";

interface TemplateStructure {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: number;
  color?: number;
  footer?: {
    text: string;
    icon_url?: string;
  };
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  field?: {
    name: string;
    value: string;
    inline?: boolean;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

type TemplateValues = { [key: string]: string };

export class Template {
  constructor(private readonly template: TemplateStructure) {}

  renderAll(values: TemplateValues): MessageEmbed {

    return new MessageEmbed();
  }

  renderTitle(values: TemplateValues): string | undefined {
    if (this.template.title) return this.replace(this.template.title, values);
  }

  private replace(target: string, values: TemplateValues): string {
    return target.replace(/{{ (\w+) }}/g, (_, key) => values[key] ?? '');
  }
}

export interface TemplatesStructure {
  loadings : { [key: string]: Template };
  successes: { [key: string]: Template };
  errors   : { [key: string]: Template };
}
