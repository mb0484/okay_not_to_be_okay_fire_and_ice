class VRect {
    constructor(x, y, width, height, compressWidth = 0, compressHeight = 0) {
        let pos = createVector(x + (width - compressWidth * 2.0) / 2.0, y + height / 2.0);

        this.pos = pos;
        this.width = width - compressWidth * 2.0;
        this.height = height;
        this.compressWidth = compressWidth;
        this.compressHeight = compressHeight;
    }

    intersection(othrRect, comporessWidth = false, compressHeight = false) {
        let curXLeft = this.bottomLeftCorner(comporessWidth, compressHeight).x;
        let curXRight = this.bottomRightCorner(comporessWidth, compressHeight).x;
        let curYDown = this.bottomLeftCorner(comporessWidth, compressHeight).y;
        let curYUp = this.upperLeftCorner(comporessWidth, compressHeight).y;

        for (let curX = curXLeft; curX <= curXRight; curX += Config.checkDetectBnd) {
            for (let curY = curYUp; curY <= curYDown; curY += Config.checkDetectBnd) {
                if (curX > othrRect.bottomLeftCorner().x && curX < othrRect.bottomRightCorner().x &&
                    curY > othrRect.upperRightCorner().y && curY < othrRect.bottomRightCorner().y) {
                        return true;
                }
            }
        }

        return false;
    }

    intersectionWithPoint(pointX, pointY) {
        if (pointX >= this.bottomLeftCorner().x && pointX <= this.bottomRightCorner().x &&
            pointY >= this.upperRightCorner().y && pointY <= this.bottomRightCorner().y) {
                return true;
        }
        return false
    }

    show(color = [100, 100, 100]) {
        fill(color);
        stroke(255);
        strokeWeight(0.1);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y, this.width, this.height);
    }

    bottomRightCorner(widthCompress = false, heightCompress = false) {
        return createVector(
            this.pos.x + this.width / 2.0 + (this.compressWidth * widthCompress), 
            this.pos.y + this.height / 2.0 + (this.compressHeight * heightCompress));
    }

    bottomLeftCorner(widthCompress = false, heightCompress = false) {
        return createVector(
            this.pos.x - this.width / 2.0 - (this.compressWidth * widthCompress), 
            this.pos.y + this.height / 2.0 + (this.compressHeight * heightCompress));
    }

    upperRightCorner(widthCompress = false, heightCompress = false) {
        return createVector(
            this.pos.x + this.width / 2.0 + (this.compressWidth * widthCompress), 
            this.pos.y - this.height / 2.0 - (this.compressHeight * heightCompress));
    }

    upperLeftCorner(widthCompress = false, heightCompress = false) {
        return createVector(
            this.pos.x - this.width / 2.0 - (this.compressWidth * widthCompress), 
            this.pos.y - this.height / 2.0, - (this.compressHeight * heightCompress));
    }
}
