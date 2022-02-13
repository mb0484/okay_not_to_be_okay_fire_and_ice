class VPlayerObject {
    constructor(x, y, imgPath, flippedImgPath, posStacionary, posJumping, posWalking, walls, fireElements, movingObjects, ramps, stripeWalls) {
        this.rect = new VRect(x, y, Config.characterWidth, Config.characterHeight, Config.characterWidthCompress, Config.characterHeightCompress);

        this.baseImg = loadImage(imgPath);
        this.baseImgFlipped = loadImage(flippedImgPath);

        this.posStacionary = posStacionary;
        this.posJumping = posJumping;
        this.posWalking = posWalking;

        this.moveMode = [ModeEnum.STATIONARY, ModeEnum.STATIONARY];
        this.curJumpingVelocity = 0.0;
        this.startJumpingPos = undefined;

        this.curWalkImage = 0;
        this.walkFrameRate = 0;

        this.walls = walls;
        this.fireElements = fireElements;
        this.movingObjects = movingObjects;
        this.ramps = ramps;
        this.stripeWalls = stripeWalls;

        this.curActiveMovingObject = undefined;
        this.gates = undefined;

        this.onFinish = false;
    }

    getImages() {
        this.imgStationary = this.baseImg.get(
            Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 0, 
            Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posStacionary, 
            Config.characterPictWidth, 
            Config.characterPictHeight);

        this.jumpInTheAirImg = this.baseImg.get(
            Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 1, 
            Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posJumping, 
            Config.characterPictWidth, 
            Config.characterPictHeight);
        
        this.movingRightImages = [
            this.baseImg.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 0, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
            this.baseImg.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 1, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
            this.baseImg.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 2, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
            this.baseImg.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 3, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
        ];

        this.movingLeftImages = [
            this.baseImgFlipped.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 0, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
            this.baseImgFlipped.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 1, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
            this.baseImgFlipped.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 2, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
            this.baseImgFlipped.get(
                Config.leftMarginPictCharacters + (Config.leftAdditionalMarginPictCharacters + Config.characterPictWidth) * 3, 
                Config.upperMarginPictCharacters + (Config.upperAdditionalMarginPictCharacters + Config.characterPictHeight) * this.posWalking, 
                Config.characterPictWidth, 
                Config.characterPictHeight),
        ];
    }

    checkCollision(compressWidth = false, compressHeight = false) {
        for (let wall of this.walls) {
            if (this.rect.intersection(wall.rect, compressWidth, compressHeight)) {
                return wall;
            }
        }
        for (let movingObject of this.movingObjects) {
            if (this.rect.intersection(movingObject.rect, compressWidth, compressHeight)) {
                return movingObject;
            }
        }
        for (let stripeWall of this.stripeWalls) {
            if (stripeWall.status == RampStatusEnum.ON && this.rect.intersection(stripeWall.rect, compressWidth, compressHeight)) {
                return stripeWall;
            }
        }
        return undefined;
    }

    checkCollisionWithFireElemnt() {
        for (let fireElement of this.fireElements) {
            if (this.rect.intersection(fireElement.rect)) {
                console.log("game over!");
                gameOver = true;
                return;
            }
        }
    }

    checkCollisionWithMovingObject() {
        for (let movingObject of this.movingObjects) {
            if (this.rect.intersection(movingObject.rect)) {
                return movingObject;
            }
        }
        return undefined;
    }

    checkCollisionWithGates() {
        if (this.gates) {
            if (this.rect.intersection(this.gates.rect)) {
                this.onFinish = true;
                return;
            }
        }
        this.onFinish = false;
    }

    checkCollisionWithRampObject() {
        for (let ramp of this.ramps) {
            if (this.rect.intersection(ramp.rect)) {
                return ramp;
            }
        }
        return undefined;
    }

    update() {
        this.getImages();
        this.checkCollisionWithGates();

        let intersectionFloor = this.checkCollision(false, true);
        if (intersectionFloor && intersectionFloor instanceof VMovingObject && intersectionFloor.status == RampStatusEnum.ON) {
            this.curActiveMovingObject = intersectionFloor;
        } else {
            this.curActiveMovingObject = undefined;
        }

        if (this.curActiveMovingObject && this.curActiveMovingObject.updatePosMovingObject) {
            this.rect.pos.x += this.curActiveMovingObject.updatePosMovingObject.x;
            this.rect.pos.y += this.curActiveMovingObject.updatePosMovingObject.y;
        }

        if (this.moveMode[0] == ModeEnum.JUMPING_UP) {
            this.rect.pos.y -= this.curJumpingVelocity;
            this.curJumpingVelocity -= Config.gravityForce;
            if (this.curJumpingVelocity < 0) {
                this.curJumpingVelocity = 0;
                this.moveMode[0] = ModeEnum.JUMPING_HIGHEST_POINT;
            }

            this.curActiveMovingObject = undefined;
            let intersectionFloor = this.checkCollision();
            if (intersectionFloor) {
                this.rect.pos.y = intersectionFloor.rect.bottomLeftCorner().y + this.rect.height / 2.0 + 2;
                this.moveMode[0] = ModeEnum.JUMPING_DOWN;
                this.curJumpingVelocity = 0;
            }
        } if (this.moveMode[0] == ModeEnum.JUMPING_HIGHEST_POINT) {
            this.moveMode[0] = ModeEnum.JUMPING_DOWN;
        } if (this.moveMode[0] == ModeEnum.JUMPING_DOWN) {
            this.rect.pos.y += this.curJumpingVelocity;
            this.curJumpingVelocity += Config.gravityForce;

            let intersectionFloor = this.checkCollision();
            if (intersectionFloor) {
                if (intersectionFloor instanceof VMovingObject && intersectionFloor.status == RampStatusEnum.ON) {
                    this.curActiveMovingObject = intersectionFloor;
                }
                this.rect.pos.y = intersectionFloor.rect.upperLeftCorner().y - this.rect.height / 2.0;
                this.moveMode[0] = ModeEnum.STATIONARY;
            }
        }
        
        
        if (this.moveMode[1] == ModeEnum.MOVE_RIGHT) {
            if (this.walkFrameRate > Config.moveFrameRate) {
                this.curWalkImage = (this.curWalkImage + 1) % 4;
                this.walkFrameRate = 0;
            } else {
                this.walkFrameRate += 1;
            }
            this.rect.pos.x += Config.moveRightVelocity;

            let intersectionFloor = this.checkCollision(false, true);
            let intersectionWall = this.checkCollision();
            if (intersectionWall) {
                this.rect.pos.x = intersectionWall.rect.upperLeftCorner().x - this.rect.width / 2.0;
            } if (!intersectionFloor && this.moveMode[0] == ModeEnum.STATIONARY) {
                this.moveMode[0] = ModeEnum.JUMPING_DOWN;
                this.curJumpingVelocity = 0;
                this.curActiveMovingObject = undefined;
            }
        } if (this.moveMode[1] == ModeEnum.MOVE_LEFT) {
            if (this.walkFrameRate > Config.moveFrameRate) {
                this.curWalkImage = (this.curWalkImage + 1) % 4;
                this.walkFrameRate = 0;
            } else {
                this.walkFrameRate += 1;
            }
            this.rect.pos.x -= Config.moveRightVelocity;

            let intersectionFloor = this.checkCollision(false, true);
            let intersectionWall = this.checkCollision();
            if (intersectionWall) {
                this.rect.pos.x = intersectionWall.rect.upperRightCorner().x + this.rect.width / 2.0;
            } if (!intersectionFloor && this.moveMode[0] == ModeEnum.STATIONARY) {
                this.moveMode[0] = ModeEnum.JUMPING_DOWN;
                this.curJumpingVelocity = 0;
                this.curActiveMovingObject = undefined;
            }
        }

        this.checkCollisionWithFireElemnt();
    }

    show() {
        let curSelectedImage = undefined;

        switch (this.moveMode[0]) {
            case ModeEnum.JUMPING_HIGHEST_POINT:
                curSelectedImage = this.jumpInTheAirImg;
                break;
            case ModeEnum.JUMPING_UP:
                curSelectedImage = this.jumpInTheAirImg;
                break;
            case ModeEnum.JUMPING_DOWN:
                curSelectedImage = this.jumpInTheAirImg;
                break;
            default:
                curSelectedImage = this.imgStationary;
                break;
        }

        switch (this.moveMode[1]) {
            case ModeEnum.MOVE_RIGHT:
                curSelectedImage = this.movingRightImages[this.curWalkImage];
                break;
            case ModeEnum.MOVE_LEFT:
                curSelectedImage = this.movingLeftImages[this.curWalkImage];
                break;
            default:
                //curSelectedImage = this.imgStationary;
                break;
        }

        //this.rect.show();

        image(curSelectedImage, 
            this.rect.upperLeftCorner(true).x, 
            this.rect.upperLeftCorner().y, 
            Config.characterWidth, 
            Config.characterHeight);
    }

    startJump() {
        if (this.moveMode[0] == ModeEnum.STATIONARY) {
            this.startJumpingPos = this.rect.pos.y;
            this.moveMode[0] = ModeEnum.JUMPING_UP;
            this.curJumpingVelocity = Config.startingVelocityUp;
        }
    }

    startMovingRight() {
        this.moveMode[1] = ModeEnum.MOVE_RIGHT;
    }

    stopMovingRight() {
        this.moveMode[1] = ModeEnum.STATIONARY;
        this.walkFrameRate = 0;
    }

    startMovingLeft() {
        this.moveMode[1] = ModeEnum.MOVE_LEFT;
    }

    stopMovingLeft() {
        this.moveMode[1] = ModeEnum.STATIONARY;
        this.walkFrameRate = 0;
    }
}