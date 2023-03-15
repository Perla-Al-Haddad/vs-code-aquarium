import { Point, randomInt } from "../../common/types";

const PADDING = 20;

export abstract class AbstractFish {

    private el: HTMLImageElement;
    petRoot: string;

    private _hdirection: number;
    private _vdirection: number;
    private _left: number;
    private _bottom: number;
    private _width: number;
    private _height: number;
    protected speed: number;

    constructor(
        spriteElement: HTMLImageElement,
        petRoot: string,
    ) {
        this.el = spriteElement;
        this.petRoot = petRoot;
        this.initSprite();
        
        this._hdirection = randomInt(0, 1) ? 1 : -1;
        this._vdirection = randomInt(0, 1) ? 1 : -1;
        
        this._left = 0;
        this._bottom = 0;
        this._width = 0;
        this._height = 0;

        this.speed = 1;
    }

    initSprite() {
        let self = this;
        self.el.style.display = 'none';
        
        this.el.addEventListener("load", function () {
            self.calculateSpriteWidth(this);

            let spawn: Point = self.getRandomSpawnPosition();
            self._left = spawn.x;
            self._bottom = spawn.y;
            self.el.style.left = spawn.x + `px`;
            self.el.style.bottom = spawn.y + `px`;

            self.el.style.display = 'block';
            if (self._hdirection === -1) {
                self.el.classList.add('flip');
            }
        });
        this.el.src = this.petRoot;
    }

    getRandomSpawnPosition(): Point {
        const body: HTMLElement = document.body;

        let center = new Point(body.clientWidth, body.clientHeight);
        let spawn = new Point(
            randomInt(this._width * 2, center.x - this._width * 2),
            randomInt(this._height * 2, center.y - this._height * 2)
        );

        return spawn;
    }

    calculateSpriteWidth(image: HTMLImageElement) {
        this._width = image.width;
        this._height = image.height;

        this.el.style.width = this._width.toString() + 'px';
        this.el.style.height = this._height.toString() + 'px';
        this.el.style.maxWidth = this._width.toString() + 'px';
        this.el.style.maxHeight = this._height.toString() + 'px';
    }

    moveRight() {
        this._hdirection = 1;
        this.el.classList.remove("flip");
    }
    moveLeft() {
        this._hdirection = -1;
        this.el.classList.add("flip");
    }
    moveHoriz() {
        if (
            this._left + PADDING > document.body.clientWidth && 
            this._left > 0
        ) {
            this.moveLeft();
        } else if (this._left + this._width - PADDING < 0) {
            this.moveRight();
        }
        this._left = this._left + this.speed * this._hdirection;
        this.el.style.left = this._left.toString() + 'px';
    }

    moveUp() {
        this._vdirection = 1;
    }
    moveDown() {
        this._vdirection = -1;
    }
    moveVert() {
        if (
            this._bottom + this._height > document.body.clientHeight &&
            this._bottom > 0
        ) {
            this.moveDown();
        } else if (this._bottom < 0) {
            this.moveUp();
        }
        this._bottom = this._bottom + this.speed * this._vdirection;
        this.el.style.bottom = this._bottom.toString() + 'px';
    }

    nextFrame() {
        setTimeout(() => {
            this.moveHoriz();
            this.moveVert();

            this.nextFrame();
        }, 25);
    }

}