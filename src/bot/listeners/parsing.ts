export default class Parsing {
  readonly maxChunks: number = 60;
  readonly quotePairs: { [quote: string]: string } = {
    '"': '"', "'": "'", '”': '”', '“': '”', '„': '”', "‘": "’", "‚": "’"
  };

  private chunks: string[] = [];
  private chunk: string = '';
  private quote: string = '';
  private escape: boolean = false;

  overLength(): boolean {
    if (this.chunks.length <= this.maxChunks) return false;

    this.chunks = [];
    return true;
  }

  addCharacter(char: string): void {
    this.chunk += char;
  }

  pushChunk(force: boolean = false): string[] {
    if (this.chunk || force) this.chunks.push(this.chunk);
    this.chunk = '';
    return this.chunks;
  }

  parseSyntax(char: string): boolean {
    return (
      this.parseQuote(char) || this.parseSpace(char) || this.parseEscape(char)
    );
  }

  private parseQuote(char: string): boolean {
    const { quote, escape } = this;
    const closed = char === quote;

    if (escape || (quote || !this.quotePairs[char]) && !closed) return false;

    this.pushChunk(closed);
    this.quote = closed ? '' : this.quotePairs[char];
    return true;
  }

  private parseSpace(char: string): boolean {
    if (this.escape || this.quote || !/\s/.test(char)) return false;

    this.pushChunk();
    return true;
  }

  private parseEscape(char: string): boolean {
    return this.escape = !this.escape && char === '\\';
  }
}
