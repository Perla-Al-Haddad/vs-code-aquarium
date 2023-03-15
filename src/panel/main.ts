// This script will be run within the webview itself

import { FishType } from "../common/types";
import { createFish } from "./fish";
import { Goldfish } from "./fishes/GoldFish";


let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

/**
 * This function initializes the canvas in the html of the webview
 * 
 * @returns 
 */
function initCanvas() {
    canvas = document.getElementById('aquariumCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.log('Canvas not ready');
        return;
    }
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) {
        console.log('Canvas context not ready');
        return;
    }
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}


function addFishToPanel(fishType: FishType, baseAquariumUri: string) {
    var fishSpriteElement: HTMLImageElement = document.createElement('img');
    fishSpriteElement.className = 'fish';
    (document.getElementById('fishContainer') as HTMLDivElement).appendChild(
        fishSpriteElement,
    );

    const root = baseAquariumUri + '/' + fishType + '.gif';
    let fish = createFish(fishType, fishSpriteElement, root);
    fish.nextFrame();
}


export function aquariumPanelApp(baseAquariumUri: string) {
    // move background code to here

    console.log("Starting aquarium session");

    initCanvas();

    window.addEventListener('message', (event): void => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'spawn-fish':
                console.log("spawn-fish event");
                console.log(message);
                addFishToPanel(message["type"], baseAquariumUri);
                break;
        }
    });
}