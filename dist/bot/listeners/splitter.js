"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Splitter {
    constructor() {
        this.maxChunks = 60;
        this.quotePairs = {
            '"': '"', "'": "'", '”': '”', '“': '”', '„': '”', "‘": "’", "‚": "’"
        };
        this.chunks = [];
        this.chunk = '';
        this.quote = '';
        this.escape = false;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYm90L2xpc3RlbmVycy9zcGxpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQXFCLFFBQVE7SUFBN0I7UUFDbUIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUN2QixlQUFVLEdBQWdDO1lBQ3pELEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHO1NBQ3JFLENBQUM7UUFFTSxXQUFNLEdBQWEsRUFBRSxDQUFDO1FBQ3RCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixXQUFNLEdBQVksS0FBSyxDQUFDO0lBOENsQyxDQUFDO0lBNUNDLFlBQVksQ0FBQyxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXZELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFNBQVMsQ0FBQyxRQUFpQixLQUFLO1FBQzlCLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVk7UUFDdEIsT0FBTyxDQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUN6RSxDQUFDO0lBQ0osQ0FBQztJQUVPLFVBQVUsQ0FBQyxJQUFZO1FBQzdCLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxLQUFLLENBQUM7UUFFOUIsSUFBSSxNQUFNLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFekUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLFVBQVUsQ0FBQyxJQUFZO1FBQzdCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUVoRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDakIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sV0FBVyxDQUFDLElBQVk7UUFDOUIsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDO0lBQ3JELENBQUM7Q0FDRjtBQXZERCwyQkF1REMifQ==