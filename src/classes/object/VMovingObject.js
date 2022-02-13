class VMovingObject {
    constructor(x, y, width, height, movingDirection, movingOffset, id, color = Config.basicMovingObjectColor) {
        this.rect = new VRect(x, y, width, height);
        this.color = color;
        this.movingDirection = movingDirection;
        this.movingOffset = movingOffset;
        this.updatePosMovingObject = undefined;
        this.status = RampStatusEnum.OFF;
        this.id = id;
        this.xStart = x;
        this.yStart = y;
        this.directionStart = movingDirection;

        this.setStartingPos(x, y);
    }

    setStartingPos(x, y) {
        switch (this.movingDirection) {
            case ObjectDirectionEnum.UP_DOWN:
                this.startPos = createVector(x, y - this.movingOffset / 2.0 + this.rect.height / 2.0);
                break;
            case ObjectDirectionEnum.DOWN_UP:
                this.startPos = createVector(x, y + this.movingOffset / 2.0 + this.rect.height / 2.0);
                break;
            case ObjectDirectionEnum.LEFT_RIGHT:
                this.startPos = createVector(x + this.movingOffset / 2.0 + this.rect.width / 2.0, y);
                break;
            case ObjectDirectionEnum.RIGHT_LEFT:
                this.startPos = createVector(x - this.movingOffset / 2.0 + this.rect.width / 2.0, y);
                break;
            default:
                break;
        }
    }

    update() {
        if (this.status == RampStatusEnum.ON) {
            switch (this.movingDirection) {
                case ObjectDirectionEnum.UP_DOWN:
                    let prevPosY = this.rect.pos.y;
                    if (this.rect.pos.y > this.startPos.y - this.movingOffset / 2.0) {
                        this.rect.pos.y -= Config.movingObjectVelocity;
                    } else {
                        this.rect.pos.y = this.startPos.y - this.movingOffset / 2.0
                        this.movingDirection = ObjectDirectionEnum.DOWN_UP;
                    }
                    this.updatePosMovingObject = createVector(0, this.rect.pos.y - prevPosY);
                    break;
                case ObjectDirectionEnum.DOWN_UP:
                    let prevPosY2 = this.rect.pos.y;
                    if (this.rect.pos.y < this.startPos.y + this.movingOffset / 2.0) {
                        this.rect.pos.y += Config.movingObjectVelocity;
                    } else {
                        this.rect.pos.y = this.startPos.y + this.movingOffset / 2.0
                        this.movingDirection = ObjectDirectionEnum.UP_DOWN;
                    }
                    this.updatePosMovingObject = createVector(0, this.rect.pos.y - prevPosY2);
                    break;
                case ObjectDirectionEnum.LEFT_RIGHT:
                    let prevPosX = this.rect.pos.x;
                    if (this.rect.pos.x < this.startPos.x + this.movingOffset / 2.0) {
                        this.rect.pos.x += Config.movingObjectVelocity;
                    } else {
                        this.rect.pos.x = this.startPos.x + this.movingOffset / 2.0
                        this.movingDirection = ObjectDirectionEnum.RIGHT_LEFT;
                    }
                    this.updatePosMovingObject = createVector(this.rect.pos.x - prevPosX, 0);
                    break;
                case ObjectDirectionEnum.RIGHT_LEFT:
                    let prevPosX2 = this.rect.pos.x;
                    if (this.rect.pos.x > this.startPos.x - this.movingOffset / 2.0) {
                        this.rect.pos.x -= Config.movingObjectVelocity;
                    } else {
                        this.rect.pos.x = this.startPos.x - this.movingOffset / 2.0
                        this.movingDirection = ObjectDirectionEnum.LEFT_RIGHT;
                    }
                    this.updatePosMovingObject = createVector(this.rect.pos.x - prevPosX2, 0);
                    break;
            }
        }
    }

    show() {
        this.rect.show(this.color);
    }

    switch() {
        if (this.status == RampStatusEnum.OFF) {
            this.status = RampStatusEnum.ON;
        } else {
            this.status = RampStatusEnum.OFF;
        }
    }

    toJSON() {
        return {
            x: this.xStart, 
            y: this.yStart,
            width: this.rect.width + this.rect.compressWidth * 2.0,
            height: this.rect.height,
            movingDirection: this.directionStart,
            movingOffset: this.movingOffset,
            id: this.id,
            color: this.color
        }
    }
}