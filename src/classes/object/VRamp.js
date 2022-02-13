class VRamp extends VPictureObject {
    constructor(x, y, width, height, animationImages) {
        super(x, y, width, height, animationImages);
        this.status = RampStatusEnum.OFF;
        this.assignedElement = undefined;
    }

    switch() {
        if (this.status == RampStatusEnum.OFF) {
            this.animationImagesPointer = this.images.length - 1;
            this.status = RampStatusEnum.ON;
        } else {
            this.animationImagesPointer = 0;
            this.status = RampStatusEnum.OFF;
        }
        this.assignedElement && this.assignedElement.switch();
    }

    toJSON() {
        return {
            x: this.rect.pos.x - (this.rect.width - this.rect.compressWidth * 2.0) / 2.0, 
            y: this.rect.pos.y - this.rect.height / 2.0,
            width: this.rect.width + this.rect.compressWidth * 2.0,
            height: this.rect.height,
            animationImages: this.animationImages,
            assignedElementId: this.assignedElement.id
        }
    }
}