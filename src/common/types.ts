import * as vscode from 'vscode';

export const enum ExtPosition {
    panel = 'panel',
    explorer = 'explorer',
}

export class WebviewMessage {
    text: string;
    command: string;

    constructor(text: string, command: string) {
        this.text = text;
        this.command = command;
    }
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export const randomInt = (min:number, max:number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;