import {
  MessageEmbed,
  MessageEmbedFooter,
  MessageEmbedImage,
  MessageEmbedThumbnail,
  MessageEmbedAuthor,
  EmbedFieldData
} from 'discord.js';

export type TemplateValues = { [key: string]: string };

export class Template {
  constructor(private readonly template: {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: number;
    color?: number;
    footer?: { text: string; iconURL?: string; };
    image?: { url: string; };
    thumbnail?: { url: string; };
    author?: { name: string; url?: string; iconURL?: string; };
    fields?: { name: string; value: string; inline?: boolean; }[];
    field?: { name: string; value: string; inline?: boolean; };
  }) {}

  render(values?: TemplateValues): MessageEmbed {
    return new MessageEmbed(
      {
        title      : this.renderTitle(values),
        description: this.renderDescription(values),
        url        : this.renderURL(values),
        timestamp  : this.renderTimestamp(),
        color      : this.renderColor(),
        footer     : this.renderFooter(values),
        image      : this.renderImage(values),
        thumbnail  : this.renderThumbnail(values),
        author     : this.renderAuthor(values),
        fields     : this.renderFields(values),
      }
    );
  }

  renderTitle(values?: TemplateValues): string | undefined {
    return this.replace(this.template.title, values);
  }

  renderDescription(values?: TemplateValues): string | undefined {
    return this.replace(this.template.description, values);
  }

  renderURL(values?: TemplateValues): string | undefined {
    return this.replace(this.template.url, values);
  }

  renderTimestamp(): number | undefined {
    return this.template.timestamp;
  }

  renderColor(): number | undefined {
    return this.template.color;
  }

  renderFooter(values?: TemplateValues): MessageEmbedFooter | undefined {
    const text    = this.replace(this.template.footer?.text, values);
    const iconURL = this.replace(this.template.footer?.iconURL, values);
    return text ? { text, iconURL } : undefined;
  }

  renderImage(values?: TemplateValues): MessageEmbedImage | undefined {
    const url = this.replace(this.template.image?.url, values);
    return url ? { url } : undefined;
  }

  renderThumbnail(values?: TemplateValues): MessageEmbedThumbnail | undefined {
    const url = this.replace(this.template.thumbnail?.url, values);
    return url ? { url } : undefined;
  }

  renderAuthor(values?: TemplateValues): MessageEmbedAuthor | undefined {
    const name    = this.replace(this.template.author?.name, values);
    const url     = this.replace(this.template.author?.url, values);
    const iconURL = this.replace(this.template.author?.iconURL, values);
    return name ? { name, url, iconURL } : undefined;
  }

  renderFields(values?: TemplateValues): EmbedFieldData[] {
    const fields: EmbedFieldData[] = [];

    for (const field of this.template.fields ?? []) {
      const name   = this.replace(field.name, values);
      const value  = this.replace(field.value, values);
      const inline = field.inline;
      fields.push({ name, value, inline });
    }

    return fields;
  }

  addField(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    const name   = this.replace(this.template.field?.name, values);
    const value  = this.replace(this.template.field?.value, values);
    const inline = this.template.field?.inline;
    return name ? embed.addField(name, value, inline) : embed;
  }

  private replace(
    target: string | undefined, values: TemplateValues = {}
  ): string | undefined {
    if (!target) return;
    return target.replace(/{{ (\w+) }}/gm, (_, key) => values[key] ?? '');
  }
}

export interface TemplatesStructure {
  loadings : { [key: string]: Template };
  successes: { [key: string]: Template };
  errors   : { [key: string]: Template };
  reports  : { [key: string]: Template };
}
