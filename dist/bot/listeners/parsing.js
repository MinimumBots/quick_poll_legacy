"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parsing {
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
exports.default = Parsing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ib3QvbGlzdGVuZXJzL3BhcnNpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFxQixPQUFPO0lBQTVCO1FBQ21CLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFDdkIsZUFBVSxHQUFnQztZQUN6RCxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRztTQUNyRSxDQUFDO1FBRU0sV0FBTSxHQUFhLEVBQUUsQ0FBQztRQUN0QixVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFVBQUssR0FBVyxFQUFFLENBQUM7UUFDbkIsV0FBTSxHQUFZLEtBQUssQ0FBQztJQThDbEMsQ0FBQztJQTVDQyxZQUFZLENBQUMsSUFBWTtRQUN2QixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsVUFBVTtRQUNSLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPLEtBQUssQ0FBQztRQUV2RCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxTQUFTLENBQUMsUUFBaUIsS0FBSztRQUM5QixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSztZQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFZO1FBQ3RCLE9BQU8sQ0FDTCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDekUsQ0FBQztJQUNKLENBQUM7SUFFTyxVQUFVLENBQUMsSUFBWTtRQUM3QixNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssS0FBSyxDQUFDO1FBRTlCLElBQUksTUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRXpFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxVQUFVLENBQUMsSUFBWTtRQUM3QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxLQUFLLENBQUM7UUFFaEUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLFdBQVcsQ0FBQyxJQUFZO1FBQzlCLE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQztJQUNyRCxDQUFDO0NBQ0Y7QUF2REQsMEJBdURDIn0=