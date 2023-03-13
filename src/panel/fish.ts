import { Goldfish } from "./fishes/GoldFish";

export function createFish(
    petType: string,
    el: HTMLImageElement,
    collision: HTMLDivElement,
    petRoot: string,
) {
    switch (petType) {
        case "Goldfish":
            return new Goldfish(el, collision, petRoot);
        default:
            throw Error("Pet type doesn't exist");
    }
}