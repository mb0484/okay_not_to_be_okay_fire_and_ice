
let outerWalls = [];

let walls = [];
let fireElements = [];
let movingElements = [];
let ramps = [];
let stripeWalls = [];

let fireBoyGates = undefined;
let iceGirlGates = undefined;

let canvas;
let img;
let k = 0;

let w, h;

var time;
var wait = 200;

let fireBoy;
let iceGirl;

let buildMode;
let buildGreenWaterImage;

let prevMovingObjectBlock = undefined;

let enableMapBuild = true;

let levels = ["level_2023_1.json"] //["level_1.json", "level_2.json", "level_3.json"];
let curLevel = 0;

let gameOver = false;

function createUI() {
    w = Config.playingSurfaceWidth;
    h = Config.playingSurfaceHeight;

    canvas = createCanvas(w - w % Config.blockWidth, h - h % Config.blockHeight);
    canvas.parent('canvas');
}

function setup() {
    this.createUI();

    this.createWallBoundaries();

    this.loadCharacters();

    time = millis();

    frameRate(Config.frameRate);

    buildMode = GameModeEnum.IN_START_MENU;

    buildGreenWaterImage = loadImage('assets/green_water_1.png');
    rampImage = loadImage('assets/ramp_off.png');
    stripeImage = loadImage('assets/stripes_red.png');
    fireBoyGatesImg = loadImage('assets/fire_boy_gates.png');
    iceGirlGatesImg = loadImage('assets/ice_girl_gates.png')
}

function loadCharacters() {
    fireBoy = new VPlayerObject(
        Config.blockWidth + Config.characterWallMargin + Config.characterWidthCompress, 
        height - Config.blockHeight - Config.characterHeight,
        'assets/fire_boy_water_girl_animation_base_all.png',
        'assets/fire_boy_water_girl_animation_base_all_flipped.png', 
        0, 0, 2, walls, fireElements, movingElements, ramps, stripeWalls);

    iceGirl = new VPlayerObject(
        w - Config.blockWidth - Config.characterWallMargin - Config.characterWidthCompress - 25, 
        height - Config.blockHeight - Config.characterHeight,
        'assets/fire_boy_water_girl_animation_base_all.png',
        'assets/fire_boy_water_girl_animation_base_all_flipped.png', 
        1, 1, 3, walls, fireElements, movingElements, ramps, stripeWalls);
}

function draw() {
    if (gameOver) {
        gameOver = false;
        reloadLevel();
    }

    //menu btns
    let startBtn = document.getElementById("playBtn");
    let resumeBtn = document.getElementById("resumeBtn");
    let reloadLevelBtn = document.getElementById("reloadLevelBtn");
    let restartGameBtn = document.getElementById("restartGameBtn");
    let thankYouText = document.getElementById("thankYouTextForManca");

    clear();
    background(255, 90);

    //normal play mode
    if (buildMode !== GameModeEnum.IN_START_MENU && buildMode !== GameModeEnum.IN_RESUME_GAME_MENU && buildMode !== GameModeEnum.END_GAME_MENU) {
        startBtn.style.display = "none";
        resumeBtn.style.display = "none";
        reloadLevelBtn.style.display = "none";
        restartGameBtn.style.display = "none";
        thankYouText.style.display = "none";

        fireBoyGates && fireBoyGates.show();
        iceGirlGates && iceGirlGates.show();

        buildMode === GameModeEnum.NORMAL && iceGirl.update();
        buildMode === GameModeEnum.NORMAL && iceGirl.show();

        buildMode === GameModeEnum.NORMAL && fireBoy.update();
        buildMode === GameModeEnum.NORMAL && fireBoy.show();

        for (let vWall of walls) {
            vWall.show();
        }

        for (let stripeWall of stripeWalls) {
            stripeWall.show();
        }

        for (let movingElement of movingElements) {
            movingElement.update();
            movingElement.show();
        }

        switch (buildMode) {
            case GameModeEnum.BUILD_GREEN_WATER:
                image(buildGreenWaterImage, 
                    mouseX - (mouseX % Config.blockWidth), 
                    mouseY - (mouseY % Config.blockHeight),
                    Config.basicFlameWidth, 
                    Config.basicFlameHeight);
                break;
            case GameModeEnum.BUILD_FLOOR:
                let curBlock = new VBlock(mouseX - (mouseX % Config.blockWidth), mouseY - (mouseY % Config.blockHeight), Config.basicWallColor, ObjectEnum.FLOOR);
                curBlock.show();
                break;
            case GameModeEnum.BUILD_WALL:
                let curBlockWall = new VBlock(mouseX - (mouseX % Config.blockWidth), mouseY - (mouseY % Config.blockHeight), Config.basicWallColor, ObjectEnum.WALL);
                curBlockWall.show();
                break;
            case GameModeEnum.BUILD_MOVING_OBJECT:
                let curMovingObject = new VBlock(mouseX - (mouseX % Config.blockWidth), mouseY - (mouseY % Config.blockHeight), Config.basicMovingObjectColor, ObjectEnum.WALL, Config.blockWidth * 2.0);
                curMovingObject.show();
                break;
            case GameModeEnum.BUILD_RAMP:
                image(rampImage, 
                    mouseX - (mouseX % Config.blockWidth), 
                    mouseY - (mouseY % Config.blockHeight),
                    Config.basicRampWidth, 
                    Config.basicRampHeight);
                break;
            case GameModeEnum.BUILD_STRIPE_WALL:
                image(stripeImage, 
                    mouseX - (mouseX % Config.blockWidth), 
                    mouseY - (mouseY % Config.blockHeight),
                    Config.basicStripeWidth, 
                    Config.basicStripeHeight);
                break;
            case GameModeEnum.BUILD_FIRE_BOY_GATES:
                image(fireBoyGatesImg, 
                    mouseX - (mouseX % Config.blockWidth), 
                    mouseY - (mouseY % Config.blockHeight),
                    Config.gatesWidth, 
                    Config.gatesHeight);
                break;
            case GameModeEnum.BUILD_ICE_GIRL_GATES:
                image(iceGirlGatesImg, 
                    mouseX - (mouseX % Config.blockWidth), 
                    mouseY - (mouseY % Config.blockHeight),
                    Config.gatesWidth, 
                    Config.gatesHeight);
                break;
            default:
                break;
        }

        if (prevMovingObjectBlock) {
            prevMovingObjectBlock.show();
        }

        for (let ramp of ramps) {
            ramp.show();
        }

        for (let fireElement of fireElements) {
            fireElement.update();
            fireElement.show();
        }

        // check if level complete
        if (fireBoy.onFinish && iceGirl.onFinish) {
            console.log("level complete!");
            curLevel += 1;

            if (curLevel == levels.length) {
                buildMode = GameModeEnum.END_GAME_MENU;
                curLevel = 0;
            } else {
                loadLevel();
            }
        }
    } 
    //in menu
    else if (buildMode === GameModeEnum.IN_START_MENU) {
        startBtn.style.display = "block";
        resumeBtn.style.display = "none";
        reloadLevelBtn.style.display = "none";
        restartGameBtn.style.display = "none";
        thankYouText.style.display = "none";

        for (let outerWall of outerWalls) {
            outerWall.show();
        }
    } else if (buildMode === GameModeEnum.END_GAME_MENU) {
        startBtn.style.display = "block";
        thankYouText.style.display = "block";
        startBtn.textContent = "Play again";

        for (let outerWall of outerWalls) {
            outerWall.show();
        }
    } else {
        startBtn.style.display = "none";
        thankYouText.style.display = "none";
        resumeBtn.style.display = "block";
        reloadLevelBtn.style.display = "block";
        restartGameBtn.style.display = "block";

        for (let outerWall of outerWalls) {
            outerWall.show();
        }
    }
}

function mousePressed() {
    switch (buildMode) {
        case GameModeEnum.BUILD_GREEN_WATER:
            let pointsX = [mouseX, mouseX + Config.blockWidth, mouseX + 2 * Config.blockWidth, mouseX + 3 * Config.blockWidth];

            for (let pointX of pointsX) {
                for (let wall of walls) {
                    if (wall.type == ObjectEnum.FLOOR && wall.rect.intersectionWithPoint(pointX, mouseY)) {
                        walls.push(
                            new VBlock(
                                wall.rect.bottomLeftCorner().x, 
                                wall.rect.upperLeftCorner().y + Config.blockHeight - Config.blockWithWaterHeight, 
                                Config.basicWallColor, ObjectEnum.FLOOR, Config.blockWidth, Config.blockWithWaterHeight));

                        if (pointX === mouseX) {
                            fireElements.push(
                                new VPictureObject(
                                    wall.rect.bottomLeftCorner().x, 
                                    wall.rect.upperLeftCorner().y + Config.blockHeight - Config.blockWithWaterHeight - Config.basicFlameHeight,
                                    Config.basicFlameWidth,
                                    Config.basicFlameHeight,
                                    ['assets/green_water_1.png', 'assets/green_water_1.png', 'assets/green_water_1.png', 'assets/green_water_1.png',
                                     'assets/green_water_2.png', 'assets/green_water_2.png', 'assets/green_water_2.png', 'assets/green_water_2.png']));
                        }

                        walls.splice(walls.indexOf(wall), 1);

                        break;
                    }
                }
            }

            return;
        case GameModeEnum.BUILD_FLOOR:
            walls.push(new VBlock(mouseX - (mouseX % Config.blockWidth), mouseY - (mouseY % Config.blockHeight), Config.basicWallColor, ObjectEnum.FLOOR));
            return;
        case GameModeEnum.BUILD_WALL:
            walls.push(new VBlock(mouseX - (mouseX % Config.blockWidth), mouseY - (mouseY % Config.blockHeight), Config.basicWallColor, ObjectEnum.WALL));
            return;
        case GameModeEnum.BUILD_MOVING_OBJECT:
            if (prevMovingObjectBlock && 
                (mouseX - (mouseX % Config.blockWidth) == prevMovingObjectBlock.rect.bottomLeftCorner().x) && 
                (mouseY - (mouseY % Config.blockHeight) < prevMovingObjectBlock.rect.bottomLeftCorner().y)) {
                    movingElements.push(
                        new VMovingObject(
                            prevMovingObjectBlock.rect.upperLeftCorner().x, 
                            prevMovingObjectBlock.rect.upperLeftCorner().y, 
                            Config.movingObjectWidth, Config.movingObjectHeight, 
                            ObjectDirectionEnum.UP_DOWN, 
                            prevMovingObjectBlock.rect.upperLeftCorner().y - (mouseY - (mouseY % Config.movingObjectHeight)),
                            int(Math.random() * Config.randomNumberMultiplier))
                    );
                    prevMovingObjectBlock = undefined;
            } else if (prevMovingObjectBlock && 
                (mouseX - (mouseX % Config.blockWidth) == prevMovingObjectBlock.rect.bottomLeftCorner().x) && 
                (mouseY - (mouseY % Config.blockHeight) > prevMovingObjectBlock.rect.bottomLeftCorner().y)) {
                    movingElements.push(
                        new VMovingObject(
                            prevMovingObjectBlock.rect.upperLeftCorner().x, 
                            prevMovingObjectBlock.rect.upperLeftCorner().y, 
                            Config.movingObjectWidth, Config.movingObjectHeight, 
                            ObjectDirectionEnum.DOWN_UP, 
                            (mouseY - (mouseY % Config.blockHeight)) - prevMovingObjectBlock.rect.upperLeftCorner().y,
                            int(Math.random() * Config.randomNumberMultiplier))
                    );
                    prevMovingObjectBlock = undefined;
            } else if (prevMovingObjectBlock && 
                (mouseX - (mouseX % Config.blockWidth) > prevMovingObjectBlock.rect.bottomLeftCorner().x) && 
                (mouseY - (mouseY % Config.blockHeight) == prevMovingObjectBlock.rect.upperLeftCorner().y)) {
                    movingElements.push(
                        new VMovingObject(
                            prevMovingObjectBlock.rect.upperLeftCorner().x, 
                            prevMovingObjectBlock.rect.upperLeftCorner().y, 
                            Config.movingObjectWidth, Config.movingObjectHeight, 
                            ObjectDirectionEnum.LEFT_RIGHT, 
                            (mouseX - (mouseX % Config.movingObjectWidth)) - prevMovingObjectBlock.rect.upperLeftCorner().x,
                            int(Math.random() * Config.randomNumberMultiplier))
                    );
                    prevMovingObjectBlock = undefined;
            } else if (prevMovingObjectBlock && 
                (mouseX - (mouseX % Config.blockWidth) < prevMovingObjectBlock.rect.bottomLeftCorner().x) && 
                (mouseY - (mouseY % Config.blockHeight) == prevMovingObjectBlock.rect.upperLeftCorner().y)) {
                    movingElements.push(
                        new VMovingObject(
                            prevMovingObjectBlock.rect.upperLeftCorner().x, 
                            prevMovingObjectBlock.rect.upperLeftCorner().y, 
                            Config.movingObjectWidth, Config.movingObjectHeight, 
                            ObjectDirectionEnum.RIGHT_LEFT, 
                            prevMovingObjectBlock.rect.upperLeftCorner().x - (mouseX - (mouseX % Config.movingObjectWidth)),
                            int(Math.random() * Config.randomNumberMultiplier))
                    );
                    prevMovingObjectBlock = undefined;
            } else {
                prevMovingObjectBlock = new VBlock(mouseX - (mouseX % Config.blockWidth), mouseY - (mouseY % Config.blockHeight), Config.basicMovingObjectColor, ObjectEnum.WALL, Config.blockWidth * 2.0);
            }
            return;
        case GameModeEnum.BUILD_RAMP:
            ramps.push(
                new VRamp(
                    mouseX - (mouseX % Config.blockWidth), 
                    mouseY - (mouseY % Config.blockHeight),
                    Config.basicRampWidth,
                    Config.basicRampHeight,
                    ['assets/ramp_off.png', 'assets/ramp_on.png']));
            return;
        case GameModeEnum.ASSIGN_RAMP_SWITCH_OBJECT:
            for (let movingElement of movingElements) {
                if (movingElement.rect.intersectionWithPoint(mouseX, mouseY)) {
                    for (let ramp of ramps) {
                        if (!ramp.assignedElement) {
                            ramp.assignedElement = movingElement;
                            break;
                        }
                    }
                    break;
                }
            }
            for (let stripeWall of stripeWalls) {
                if (stripeWall.rect.intersectionWithPoint(mouseX, mouseY)) {
                    for (let ramp of ramps) {
                        if (!ramp.assignedElement) {
                            ramp.assignedElement = stripeWall;
                            break;
                        }
                    }
                    break;
                }
            }
            return;
        case GameModeEnum.EREASE_ELEMENT:
            for (let wall of walls) {
                if (wall.rect.intersectionWithPoint(mouseX, mouseY)) {
                    walls.splice(walls.indexOf(wall), 1);
                    break;
                }
            }
            for (let fireElement of fireElements) {
                if (fireElement.rect.intersectionWithPoint(mouseX, mouseY)) {
                    fireElements.splice(fireElements.indexOf(fireElement), 1);
                    break;
                }
            }
            for (let movingElement of movingElements) {
                if (movingElement.rect.intersectionWithPoint(mouseX, mouseY)) {
                    movingElements.splice(movingElements.indexOf(movingElement), 1);
                    break;
                }
            }
            for (let ramp of ramps) {
                if (ramp.rect.intersectionWithPoint(mouseX, mouseY)) {
                    ramps.splice(ramps.indexOf(ramp), 1);
                    break;
                }
            }
            for (let stripeWall of stripeWalls) {
                if (stripeWall.rect.intersectionWithPoint(mouseX, mouseY)) {
                    stripeWalls.splice(stripeWalls.indexOf(stripeWall), 1);
                    break;
                }
            }
            return;
        case GameModeEnum.BUILD_STRIPE_WALL:
            stripeWalls.push(new Stripe(
                mouseX - (mouseX % Config.blockWidth), 
                mouseY - (mouseY % Config.blockHeight),
                Config.basicStripeWidth,
                Config.basicStripeHeight,
                ['assets/stripes_red.png'],
                int(Math.random() * Config.randomNumberMultiplier)));
            return;
        case GameModeEnum.BUILD_FIRE_BOY_GATES:
            fireBoyGates = new VPictureObject(
                mouseX - (mouseX % Config.blockWidth), 
                mouseY - (mouseY % Config.blockHeight),
                Config.gatesWidth,
                Config.gatesHeight,
                ['assets/fire_boy_gates.png']);
            fireBoy.gates = fireBoyGates;
            return;
        case GameModeEnum.BUILD_ICE_GIRL_GATES:
            iceGirlGates = new VPictureObject(
                mouseX - (mouseX % Config.blockWidth), 
                mouseY - (mouseY % Config.blockHeight),
                Config.gatesWidth,
                Config.gatesHeight,
                ['assets/ice_girl_gates.png']);
            iceGirl.gates = iceGirlGates;
            return;
        default:
            return;
    }
}

function keyPressed() {
    //console.log(keyCode)
    switch (keyCode) {
        // left arrow - go left
        case 37:
            fireBoy.startMovingLeft();
            return;
        // up arrow - jump
        case 38:
            fireBoy.startJump();
            return;
        // right arrow - go right
        case 39:
            fireBoy.startMovingRight();
            return;
        // down arrow - switch ramp
        case 40:
            let curRamp = fireBoy.checkCollisionWithRampObject();
            if (curRamp) {
                curRamp.switch();
            }
            return;
        // a - go left
        case 65:
            iceGirl.startMovingLeft();
            return;
        // w - jump
        case 87:
            iceGirl.startJump();
            return;
        // d - go right
        case 68:
            iceGirl.startMovingRight();
            return;
        // s - switch ramp
        case 83:
            let curRamp2 = iceGirl.checkCollisionWithRampObject();
            if (curRamp2) {
                curRamp2.switch();
            }
            return;
        // c - clear map
        case enableMapBuild && 67:
            clearMap();
            return;
        // e - erease element
        case enableMapBuild && 69:
            buildMode = GameModeEnum.EREASE_ELEMENT;
            return;
        // f - build floor
        case enableMapBuild && 70:
            buildMode = GameModeEnum.BUILD_FLOOR;
            return;
        // g - build green water
        case enableMapBuild && 71:
            buildMode = GameModeEnum.BUILD_GREEN_WATER;
            return;
        // k - build ramp
        case enableMapBuild && 75:
            buildMode = GameModeEnum.BUILD_RAMP;
            return;
        // m - load menu
        case buildMode !== GameModeEnum.IN_START_MENU && 77:
            buildMode = GameModeEnum.IN_RESUME_GAME_MENU;
            return;
        // n - normal mode
        case enableMapBuild && 78:
            buildMode = GameModeEnum.NORMAL;
            prevMovingObjectBlock = undefined;
            return;
        // p - assign object to ramp
        case enableMapBuild && 80:
            buildMode = GameModeEnum.ASSIGN_RAMP_SWITCH_OBJECT;
            return;
        // q - save
        case enableMapBuild && 81:
            downloadMap();
            return;
        // u - build stripe wall
        case enableMapBuild && 85:
            buildMode = GameModeEnum.BUILD_STRIPE_WALL;
            return;
        // v - build moving object
        case enableMapBuild && 86:
            buildMode = GameModeEnum.BUILD_MOVING_OBJECT;
            prevMovingObjectBlock = undefined;
            return;
        // f - build wall
        case enableMapBuild && 87:
            buildMode = GameModeEnum.BUILD_WALL;
            return;
        // 1 - build fireboy gates
        case enableMapBuild && 49:
            buildMode = GameModeEnum.BUILD_FIRE_BOY_GATES;
            return;
        // 2 - build icegirl gates
        case enableMapBuild && 50:
            buildMode = GameModeEnum.BUILD_ICE_GIRL_GATES;
            return;

        // l - build wall
        case enableMapBuild && 76:
            loadLevel();
            return;
    }
}

function downloadMap() {
    let data = JSON.stringify({width: w, height: h, walls: [...walls], fireElements: [...fireElements], movingElements: [...movingElements], ramps: [...ramps], stripeWalls: [...stripeWalls], fireBoyGates: fireBoyGates, iceGirlGates: iceGirlGates});
    download(data, 'save.json');
}

function download(data, name) {
    let a = document.createElement('a');
    let file = new Blob([data], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

function loadLevel() {
    loadCharacters();

    console.log("levels[curLevel]: ", levels[curLevel])

    $.getJSON("levels/" + levels[curLevel], function(level) {    
        walls = [];
        fireElements = [];
        movingElements = [];
        ramps = [];
        stripeWalls = [];

        for (let wall of level.walls) {
            walls.push(new VBlock(
                wall.x,
                wall.y,
                wall.color,
                wall.type,
                wall.width,
                wall.height
            ))
        }

        for (let fireElement of level.fireElements) {
            fireElements.push(new VPictureObject(
                fireElement.x,
                fireElement.y,
                fireElement.width,
                fireElement.height,
                fireElement.animationImages
            ))
        }

        for (let movingElement of level.movingElements) {
            movingElements.push(new VMovingObject(
                movingElement.x,
                movingElement.y,
                movingElement.width,
                movingElement.height,
                movingElement.movingDirection,
                movingElement.movingOffset,
                movingElement.id,
                movingElement.color
            ))
        }

        for (let stripeWall of level.stripeWalls) {
            stripeWalls.push(new Stripe(
                stripeWall.x,
                stripeWall.y,
                stripeWall.width,
                stripeWall.height,
                stripeWall.animationImages,
                stripeWall.id
            ))
        }

        for (let ramp of level.ramps) {
            let curRamp = new VRamp(
                ramp.x,
                ramp.y,
                ramp.width,
                ramp.height,
                ramp.animationImages
            );

            for (let stripeWall of stripeWalls) {
                if (stripeWall.id == ramp.assignedElementId) {
                    curRamp.assignedElement = stripeWall;
                    break;
                }
            }

            for (let movingElement of movingElements) {
                if (movingElement.id == ramp.assignedElementId) {
                    curRamp.assignedElement = movingElement;
                    break;
                }
            }

            ramps.push(curRamp);
        }

        if (level.fireBoyGates) {
            fireBoyGates = new VPictureObject(
                level.fireBoyGates.x,
                level.fireBoyGates.y,
                level.fireBoyGates.width,
                level.fireBoyGates.height,
                level.fireBoyGates.animationImages
            )
        }

        if (level.iceGirlGates) {
            iceGirlGates = new VPictureObject(
                level.iceGirlGates.x,
                level.iceGirlGates.y,
                level.iceGirlGates.width,
                level.iceGirlGates.height,
                level.iceGirlGates.animationImages
            )
        }

        fireBoy.walls = walls;
        fireBoy.fireElements = fireElements;
        fireBoy.movingObjects = movingElements;
        fireBoy.stripeWalls = stripeWalls;
        fireBoy.ramps = ramps;
        fireBoy.curActiveMovingObject = undefined;
        fireBoy.gates = fireBoyGates;

        iceGirl.walls = walls;
        iceGirl.fireElements = fireElements;
        iceGirl.movingObjects = movingElements;
        iceGirl.stripeWalls = stripeWalls;
        iceGirl.ramps = ramps;
        iceGirl.curActiveMovingObject = undefined;
        iceGirl.gates = iceGirlGates;
    });
}

function keyReleased() {
    switch (keyCode) {
        // left arrow - stop going left
        case 37:
            fireBoy.stopMovingLeft();
            return;
        // right arrow - stop going right
        case 39:
            fireBoy.stopMovingRight();
            return;
        // a - stop going left
        case 65:
            iceGirl.stopMovingLeft();
            return;
        // d - stop going right
        case 68:
            iceGirl.stopMovingRight();
            return;
    }
}

function createWallBoundaries() {

    // place bricks top-down
    for (let y = 0; y <= height - Config.blockHeight; y += Config.blockHeight) {
        let wallLeft = new VBlock(0, y, Config.basicWallColor, ObjectEnum.WALL);
        let wallRight = new VBlock(width - Config.blockWidth, y, Config.basicWallColor, ObjectEnum.WALL);
        walls.push(wallLeft, wallRight);
        outerWalls.push(wallLeft, wallRight);
    }

    // place bricks left-right
    for (let x = 0; x <= width - Config.blockWidth; x += Config.blockWidth) {
        let wallTop = new VBlock(x, 0, Config.basicWallColor, ObjectEnum.FLOOR);

        let wallBottom = new VBlock(x, height - Config.blockHeight, Config.basicWallColor, ObjectEnum.FLOOR);
        walls.push(wallTop, wallBottom);
        outerWalls.push(wallTop, wallBottom);
    }
}

function clearMap() {
    outerWalls = [];
    walls = [];
    fireElements = [];
    movingElements = [];
    ramps = [];
    stripeWalls = [];

    fireBoyGates = undefined;
    iceGirlGates = undefined;

    this.createWallBoundaries();

    fireBoy.walls = walls;
    fireBoy.fireElements = fireElements;
    fireBoy.movingObjects = movingElements;
    fireBoy.stripeWalls = stripeWalls;
    fireBoy.ramps = ramps;
    fireBoy.curActiveMovingObject = undefined;
    fireBoy.gates = fireBoyGates;

    iceGirl.walls = walls;
    iceGirl.fireElements = fireElements;
    iceGirl.movingObjects = movingElements;
    iceGirl.stripeWalls = stripeWalls;
    iceGirl.ramps = ramps;
    iceGirl.curActiveMovingObject = undefined;
    iceGirl.gates = iceGirlGates;
}

function startGame() {
    console.log("Start again");
    buildMode = GameModeEnum.NORMAL;
    curLevel = 0;
    loadLevel();
}

function resumeGame() {
    buildMode = GameModeEnum.NORMAL;
}

function reloadLevel() {
    buildMode = GameModeEnum.NORMAL;
    loadLevel();
}

