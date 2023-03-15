import { FishType } from "../common/types";
import { Goldfish } from "./fishes/GoldFish";
import { Turtle } from "./fishes/Turtle";

export function createFish(
    fishType: FishType,
    el: HTMLImageElement,
    petRoot: string,
) {
    switch (fishType) {
        case FishType.goldfish:
            return new Goldfish(el, petRoot);
        case FishType.turtle: 
            return new Turtle(el, petRoot);
        default:
            throw Error("Fish type doesn't exist");
    }
}