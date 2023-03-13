
export class Goldfish {

    private el: HTMLImageElement;
    private collision: HTMLDivElement;
    petRoot: string;

    constructor(
        spriteElement: HTMLImageElement,
        collisionElement: HTMLDivElement,
        petRoot: string,
    ) {
        this.el = spriteElement;
        this.collision = collisionElement;
        this.petRoot = petRoot;
        this.initSprite();

    }

    initSprite() {
        this.el.style.left = `0px`;
        this.el.style.bottom = `0px`;
        this.el.style.width = '77px';
        this.el.style.height = '49px';
        this.el.style.maxWidth = `77px`;
        this.el.style.maxHeight = `49px`;
        this.el.src = this.petRoot;
        // this.el.style.backgroundImage = this.petRoot;
    }

}