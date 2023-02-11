"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Splitter {
    maxChunks = 60;
    quotePairs = {
        '"': '"', "'": "'", '”': '”', '“': '”', '„': '”', "‘": "’", "‚": "’"
    };
    chunks = [];
    chunk = '';
    quote = '';
    escape = false;
    addCharacter(char) {
        this.chunk += char;
    }
    overLength() {
        if (this.chunks.length <= this.maxChunks)
            return false;
        this.chunks = [];
        return true;
    }
    pushChunk(force = false) {
        if (this.chunk || force)
            this.chunks.push(this.chunk);
        this.chunk = '';
        return this.chunks;
    }
    parseSyntax(char) {
        return (this.parseQuote(char) || this.parseSpace(char) || this.parseEscape(char));
    }
    parseQuote(char) {
        const { quote, escape } = this;
        const closed = char === quote;
        if (escape || (quote || !this.quotePairs[char]) && !closed)
            return false;
        this.pushChunk(closed);
        this.quote = closed ? '' : this.quotePairs[char];
        return true;
    }
    parseSpace(char) {
        if (this.escape || this.quote || !/\s/.test(char))
            return false;
        this.pushChunk();
        return true;
    }
    parseEscape(char) {
        return this.escape = !this.escape && char === '\\';
    }
}
exports.default = Splitter;
