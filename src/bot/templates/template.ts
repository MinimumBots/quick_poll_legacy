import {
  MessageEmbed,
  MessageEmbedFooter,
  MessageEmbedImage,
  MessageEmbedThumbnail,
  MessageEmbedAuthor,
  EmbedFieldData
} from 'discord.js';

export type TemplateData = {
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
}

type TemplateValues = { [key: string]: string };

export class Template {
  constructor(readonly template: TemplateData) {}

  render(values?: TemplateValues): MessageEmbed {
    return this.supply(new MessageEmbed, values);
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

  renderTimestamp(values?: TemplateValues): number | undefined {
    const timestamp = values?.['timestamp'];
    const date = timestamp ? new Date(timestamp) : undefined;
    return date?.getTime() ?? this.template.timestamp;
  }

  renderColor(values?: TemplateValues): number | undefined {
    const colorHex = values?.['color'];
    const color = colorHex ? parseInt(colorHex, 16) : undefined;
    return color ?? this.template.color;
  }

  renderFooter(values?: TemplateValues): MessageEmbedFooter | undefined {
    const text    = this.replace(this.template.footer?.text,    values);
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
    const name    = this.replace(this.template.author?.name,    values);
    const url     = this.replace(this.template.author?.url,     values);
    const iconURL = this.replace(this.template.author?.iconURL, values);
    return name ? { name, url, iconURL } : undefined;
  }

  renderFields(values?: TemplateValues): EmbedFieldData[] {
    const fields: EmbedFieldData[] = [];

    for (const field of this.template.fields ?? []) {
      const name   = this.replace(field.name,  values);
      const value  = this.replace(field.value, values);
      const inline = field.inline;
      fields.push({ name, value, inline });
    }

    return fields;
  }

  supply(...params: [MessageEmbed, TemplateValues?]): MessageEmbed {
    this.supplyTitle      (...params);
    this.supplyDescription(...params);
    this.supplyURL        (...params);
    this.supplyTimestamp  (...params);
    this.supplyColor      (...params);
    this.supplyFooter     (...params);
    this.supplyImage      (...params);
    this.supplyThumbnail  (...params);
    this.supplyAuthor     (...params);
    this.supplyFields     (...params);
    return params[0];
  }

  supplyTitle(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.title = this.renderTitle(values) ?? null;
    return embed;
  }

  supplyDescription(
    embed: MessageEmbed, values?: TemplateValues
  ): MessageEmbed {
    embed.description = this.renderDescription(values) ?? null;
    return embed
  }

  supplyURL(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.url = this.renderURL(values) ?? null;
    return embed;
  }

  supplyTimestamp(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.timestamp = this.renderTimestamp(values) ?? null;
    return embed;
  }

  supplyColor(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.color = this.renderColor(values) ?? null
    return embed
  }

  supplyFooter(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.footer = this.renderFooter(values) ?? null;
    return embed;
  }

  supplyImage(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.image = this.renderImage(values) ?? null;
    return embed;
  }

  supplyThumbnail(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.thumbnail = this.renderThumbnail(values) ?? null
    return embed;
  }

  supplyAuthor(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    embed.author = this.renderAuthor(values) ?? null
    return embed;
  }

  supplyFields(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    return embed.addFields(this.renderFields(values));
  }

  appendField(embed: MessageEmbed, values?: TemplateValues): MessageEmbed {
    const name   = this.replace(this.template.field?.name,  values);
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
