class VPictureObject {
    constructor(x, y, width, height, animationImages) {
        this.rect = new VRect(x, y, width, height);
        this.images = [];
        this.animationImagesPointer = 0;
        this.width = width;
        this.height = height;
        this.animationImages = animationImages;

        for (let animationImage of this.animationImages) {
            this.images.push(loadImage(animationImage));
        }
    }

    show() {
        image(this.images[this.animationImagesPointer], 
            this.rect.upperLeftCorner().x, 
            this.rect.upperLeftCorner().y, 
            this.width, 
            this.height);
    }

    update() {
        this.animationImagesPointer = (this.animationImagesPointer + 1) % this.images.length;
    }

    toJSON() {
        return {
            x: this.rect.pos.x - (this.rect.width - this.rect.compressWidth * 2.0) / 2.0, 
            y: this.rect.pos.y - this.rect.height / 2.0,
            width: this.rect.width + this.rect.compressWidth * 2.0,
            height: this.rect.height,
            animationImages: this.animationImages
        }
    }
}