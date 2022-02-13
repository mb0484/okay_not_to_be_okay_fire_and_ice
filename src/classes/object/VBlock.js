class VBlock {

    constructor(x, y, color = Config.basicWallColor, type, width = Config.blockWidth, height = Config.blockHeight) {
        this.pos = createVector(x, y);
        this.color = color;
        this.rect = new VRect(x, y, width, height);
        this.type = type;
    }

    show() {
        this.rect.show(this.color);
    }

    toJSON() {
        return {
            x: this.rect.pos.x - (this.rect.width - this.rect.compressWidth * 2.0) / 2.0, 
            y: this.rect.pos.y - this.rect.height / 2.0,
            type: this.type,
            width: this.rect.width + this.rect.compressWidth * 2.0,
            height: this.rect.height,
            color: this.color
        }
    }

}