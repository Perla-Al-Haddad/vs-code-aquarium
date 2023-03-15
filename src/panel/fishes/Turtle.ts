import { AbstractFish } from "./AbstractFish";

export class Turtle extends AbstractFish {
    // private

    constructor(
        el: HTMLImageElement,
        petRoot: string
    ) {
        super(el, petRoot);

        this.speed = 0.5;
    }
}