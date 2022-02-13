class Stripe extends VPictureObject {
    constructor(x, y, width, height, animationImages, id) {
        super(x, y, width, height, animationImages);
        this.status = RampStatusEnum.ON;
        this.id = id;
    }

    show() {
        if (this.status == RampStatusEnum.ON) {
            super.show();
        }
    }

    switch() {
        if (this.status == RampStatusEnum.ON) {
            this.status = RampStatusEnum.OFF;
        } else {
            this.status = RampStatusEnum.ON;
        }
    }

    toJSON() {
        return {
            x: this.rect.pos.x - (this.rect.width - this.rect.compressWidth * 2.0) / 2.0, 
            y: this.rect.pos.y - this.rect.height / 2.0,
            width: this.rect.width + this.rect.compressWidth * 2.0,
            height: this.rect.height,
            animationImages: this.animationImages,
            id: this.id
        }
    }
}