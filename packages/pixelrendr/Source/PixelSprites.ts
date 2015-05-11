// Compatability shim for ES3
interface Uint8ClampedArray extends ArrayBufferView {
    BYTES_PER_ELEMENT: number;
    length: number;
    [index: number]: number;
    get(index: number): number;
    set(index: number, value: number): void;
    set(array: Uint8Array, offset?: number): void;
    set(array: number[], offset?: number): void;
    subarray(begin: number, end?: number): Uint8Array;
}
declare var Uint8ClampedArray: {
    prototype: Uint8ClampedArray;
    new (length: number): Uint8ClampedArray;
    new (array: Uint8Array): Uint8ClampedArray;
    new (array: number[]): Uint8ClampedArray;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8ClampedArray;
    BYTES_PER_ELEMENT: number;
}

interface IPixelSprite {
    processed: boolean;
    multiple: boolean;
}

class PixelSpriteSingle implements IPixelSprite {
    processed: boolean = false;
    multiple: boolean;
    sprite: Uint8ClampedArray;
}

class PixelSpriteMultiple implements IPixelSprite {
    processed: boolean = false;
    multiple: boolean = true; 

    direction: string;

    topheight: number;
    rightwidth: number;
    bottomheight: number;
    leftwidth: number;
    middleStretch: boolean;

    sprites: {
        top?: Uint8ClampedArray;
        right?: Uint8ClampedArray;
        bottom?: Uint8ClampedArray;
        left?: Uint8ClampedArray;
        middle?: Uint8ClampedArray;
    }
}