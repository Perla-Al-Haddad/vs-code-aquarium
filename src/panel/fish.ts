import { Goldfish } from "./fishes/GoldFish";
import { Turtle } from "./fishes/Turtle";

export function createFish(
    petType: string,
    el: HTMLImageElement,
    petRoot: string,
) {
    switch (petType) {
        case "Goldfish":
            return new Goldfish(el, petRoot);
        case "Turtle": 
            return new Turtle(el, petRoot);
        default:
            throw Error("Pet type doesn't exist");
    }
}