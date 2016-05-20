/// <reference path="../changelinr/ChangeLinr.d.ts" />
/// <reference path="../stringfilr/StringFilr.d.ts" />
declare module "IPixelRendr" {
    import { IChangeLinr } from "IChangeLinr";
    import { IStringFilr } from "IStringFilr";
    export type IPixel = [number, number, number, number];
    export type IPalette = IPixel[];
    export interface ILibrary {
        raws: any;
        sprites?: IRenderLibrary;
    }
    export interface IRender {
        source: ICommand;
        sprites: IRenderSprites;
        filter: IFilterAttributes;
        containers: IRenderContainerListing[];
    }
    export interface IRenderSprites {
        [i: string]: Uint8ClampedArray | ISpriteMultiple;
    }
    export interface IRenderContainerListing {
        container: IRenderLibrary;
        key: string;
    }
    export interface IRenderLibrary {
        [i: string]: IRenderLibrary | IRender;
    }
    export interface ISpriteAttributes {
        filter?: IFilter;
        [i: string]: number | IFilter;
    }
    export type ICommand = string | any[];
    export type IFilterCommand = [string, string[], string];
    export type IMultipleCommand = [string, string, ISpriteMultipleSettings];
    export type ISameCommand = [string, string[]];
    export interface IFilter {
        0: string;
        1: {
            [i: string]: string;
        };
    }
    export interface IFilterContainer {
        [i: string]: IFilter;
    }
    export interface IFilterAttributes {
        filter: IFilter;
    }
    export interface ISpriteMultipleSettings {
        top?: string;
        topheight?: number;
        right?: string;
        rightwidth?: number;
        bottom?: string;
        bottomheight?: number;
        left?: string;
        leftwidth?: number;
        middle?: string;
        middleStretch?: boolean;
    }
    export interface ISpriteMultiple {
        sprites: IClampedArraysContainer;
        direction: string;
        topheight: number;
        rightwidth: number;
        bottomheight: number;
        leftwidth: number;
        middleStretch: boolean;
    }
    export interface IClampedArraysContainer {
        [i: string]: Uint8ClampedArray;
    }
    export interface IGeneralSpriteGenerator {
        (render: IRender, key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
    }
    export interface IPixelRendrEncodeCallback {
        (result: string, image: HTMLImageElement, ...args: any[]): any;
    }
    export interface IPixelRendrSettings {
        paletteDefault: IPalette;
        library?: any;
        filters?: IFilterContainer;
        scale?: number;
        flipVert?: string;
        flipHoriz?: string;
        spriteWidth?: string;
        spriteHeight?: string;
        Uint8ClampedArray?: typeof Uint8ClampedArray;
    }
    export interface IPixelRendr {
        getPaletteDefault(): IPalette;
        getBaseLibrary(): any;
        getScale(): number;
        getBaseFiler(): IStringFilr<any>;
        getProcessorBase(): IChangeLinr;
        getProcessorDims(): IChangeLinr;
        getProcessorEncode(): IChangeLinr;
        resetLibrary(library: any): void;
        resetRender(key: string): void;
        getSpriteBase(key: string): Uint8ClampedArray | ISpriteMultiple;
        decode(key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
        encode(image: HTMLImageElement, callback?: IPixelRendrEncodeCallback, ...args: any[]): string;
        encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void;
        generatePaletteFromRawData(data: Uint8ClampedArray, forceZeroColor?: boolean, giveArrays?: boolean): Uint8ClampedArray[];
        memcpyU8(source: Uint8ClampedArray | number[], destination: Uint8ClampedArray | number[], readloc?: number, writeloc?: number, writelength?: number): void;
    }
}
declare module "Render" {
    import { ICommand, IFilterAttributes, IRender, IRenderContainerListing, IRenderSprites } from "IPixelRendr";
    export class Render implements IRender {
        source: string | any[];
        sprites: IRenderSprites;
        filter: IFilterAttributes;
        containers: IRenderContainerListing[];
        constructor(source: ICommand, filter?: IFilterAttributes);
    }
}
declare module "SpriteMultiple" {
    import { IClampedArraysContainer, IRender, ISpriteMultiple } from "IPixelRendr";
    export class SpriteMultiple implements ISpriteMultiple {
        sprites: IClampedArraysContainer;
        direction: string;
        topheight: number;
        rightwidth: number;
        bottomheight: number;
        leftwidth: number;
        middleStretch: boolean;
        constructor(sprites: IClampedArraysContainer, render: IRender);
    }
}
declare module "PixelRendr" {
    import { IChangeLinr } from "IChangeLinr";
    import { IStringFilr } from "IStringFilr";
    import { IPixelRendrEncodeCallback, IPalette, IPixelRendr, IPixelRendrSettings, ISpriteMultiple } from "IPixelRendr";
    export class PixelRendr implements IPixelRendr {
        private library;
        private BaseFiler;
        private ProcessorBase;
        private ProcessorDims;
        private ProcessorEncode;
        private paletteDefault;
        private digitsizeDefault;
        private digitsplit;
        private scale;
        private flipVert;
        private flipHoriz;
        private spriteWidth;
        private spriteHeight;
        private filters;
        private commandGenerators;
        private Uint8ClampedArray;
        constructor(settings: IPixelRendrSettings);
        getPaletteDefault(): IPalette;
        getScale(): number;
        getBaseLibrary(): any;
        getBaseFiler(): IStringFilr<string[] | any>;
        getProcessorBase(): IChangeLinr;
        getProcessorDims(): IChangeLinr;
        getProcessorEncode(): IChangeLinr;
        getSpriteBase(key: string): Uint8ClampedArray | ISpriteMultiple;
        resetLibrary(library: any): void;
        resetRender(key: string): void;
        decode(key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
        encode(image: HTMLImageElement, callback?: IPixelRendrEncodeCallback, ...args: any[]): string;
        encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void;
        generatePaletteFromRawData(data: Uint8ClampedArray, forceZeroColor?: boolean, giveArrays?: boolean): Uint8ClampedArray[];
        memcpyU8(source: Uint8ClampedArray | number[], destination: Uint8ClampedArray | number[], readloc?: number, writeloc?: number, writelength?: number): void;
        private libraryParse(reference);
        private generateRenderSprite(render, key, attributes);
        private generateSpriteSingleFromRender(render, key, attributes);
        private generateSpriteCommandMultipleFromRender(render, key, attributes);
        private generateSpriteCommandSameFromRender(render, key, attributes);
        private generateSpriteCommandFilterFromRender(render, key, attributes);
        private generateRendersFromFilter(directory, filter);
        private replaceRenderInContainers(render, replacement);
        private spriteUnravel(colors);
        private spriteExpand(colors);
        private spriteApplyFilter(colors, key, attributes);
        private spriteGetArray(colors);
        private spriteRepeatRows(sprite, key, attributes);
        private spriteFlipDimensions(sprite, key, attributes);
        private flipSpriteArrayHoriz(sprite, attributes);
        private flipSpriteArrayVert(sprite, attributes);
        private flipSpriteArrayBoth(sprite);
        private imageGetData(image);
        private imageGetPixels(data);
        private imageMapPalette(information);
        private imageCombinePixels(information);
        private getDigitSizeFromArray(palette);
        private getDigitSizeFromObject(palette);
        private getPaletteReference(palette);
        private getPaletteReferenceStarting(palette);
        private getClosestInPalette(palette, rgba);
        private stringOf(text, times?);
        private makeDigit(num, size, prefix?);
        private makeSizedDigit(size, digit);
        private arrayReplace(array, removed, inserted);
        private arrayDifference(a, b);
        private getValueIndices(array);
        private followPath(object, path, index);
    }
}
