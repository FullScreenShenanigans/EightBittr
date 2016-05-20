/// <reference path="../objectmakr/ObjectMakr.d.ts" />
declare module "IQuadsKeepr" {
    import { IObjectMakr } from "IObjectMakr";
    export interface IThing {
        top: number;
        right: number;
        bottom: number;
        left: number;
        changed: boolean;
        groupType: string;
        numQuadrants: number;
        offsetX?: number;
        offsetY?: number;
        quadrants: IQuadrant[];
    }
    export interface IThingsCollection {
        [i: string]: IThing[];
    }
    export interface IThingsCounter {
        [i: string]: number;
    }
    export interface IQuadrant extends IThing {
        things: IThingsCollection;
        numthings: IThingsCounter;
    }
    export interface IQuadrantCollection {
        left: number;
        top: number;
        quadrants: IQuadrant[];
    }
    export interface IQuadrantRow extends IQuadrantCollection {
        quadrants: IQuadrant[];
    }
    export interface IQuadrantCol extends IQuadrantCollection {
        quadrants: IQuadrant[];
    }
    export interface IQuadrantChangeCallback {
        (direction: string, top: number, right: number, bottom: number, left: number): void;
    }
    export interface IQuadsKeeprSettings {
        ObjectMaker: IObjectMakr;
        numRows: number;
        numCols: number;
        quadrantWidth: number;
        quadrantHeight: number;
        groupNames: string[];
        checkOffsetX?: boolean;
        checkOffsetY?: boolean;
        onAdd?: IQuadrantChangeCallback;
        onRemove?: IQuadrantChangeCallback;
        startLeft?: number;
        startTop?: number;
    }
    export interface IQuadsKeepr {
        top: number;
        right: number;
        bottom: number;
        left: number;
        getQuadrantRows(): IQuadrantRow[];
        getQuadrantCols(): IQuadrantCol[];
        getNumRows(): number;
        getNumCols(): number;
        getQuadrantWidth(): number;
        getQuadrantHeight(): number;
        resetQuadrants(): void;
        shiftQuadrants(dx?: number, dy?: number): void;
        pushQuadrantRow(callUpdate?: boolean): IQuadrantRow;
        pushQuadrantCol(callUpdate?: boolean): IQuadrantCol;
        popQuadrantRow(callUpdate?: boolean): void;
        popQuadrantCol(callUpdate?: boolean): void;
        unshiftQuadrantRow(callUpdate?: boolean): IQuadrantRow;
        unshiftQuadrantCol(callUpdate?: boolean): IQuadrantCol;
        shiftQuadrantRow(callUpdate?: boolean): void;
        shiftQuadrantCol(callUpdate?: boolean): void;
        determineAllQuadrants(group: string, things: IThing[]): void;
        determineThingQuadrants(thing: IThing): void;
        setThingInQuadrant(thing: IThing, quadrant: IQuadrant, group: string): void;
    }
}
declare module "QuadsKeepr" {
    import { IQuadrant, IQuadrantRow, IQuadrantCol, IQuadsKeepr, IQuadsKeeprSettings, IThing } from "IQuadsKeepr";
    export class QuadsKeepr implements IQuadsKeepr {
        top: number;
        right: number;
        bottom: number;
        left: number;
        private ObjectMaker;
        private numRows;
        private numCols;
        private offsetX;
        private offsetY;
        private checkOffsetX;
        private checkOffsetY;
        private startLeft;
        private startTop;
        private quadrantRows;
        private quadrantCols;
        private quadrantWidth;
        private quadrantHeight;
        private groupNames;
        private onAdd;
        private onRemove;
        constructor(settings: IQuadsKeeprSettings);
        getQuadrantRows(): IQuadrantRow[];
        getQuadrantCols(): IQuadrantCol[];
        getNumRows(): number;
        getNumCols(): number;
        getQuadrantWidth(): number;
        getQuadrantHeight(): number;
        resetQuadrants(): void;
        shiftQuadrants(dx?: number, dy?: number): void;
        pushQuadrantRow(callUpdate?: boolean): IQuadrantRow;
        pushQuadrantCol(callUpdate?: boolean): IQuadrantCol;
        popQuadrantRow(callUpdate?: boolean): void;
        popQuadrantCol(callUpdate?: boolean): void;
        unshiftQuadrantRow(callUpdate?: boolean): IQuadrantRow;
        unshiftQuadrantCol(callUpdate?: boolean): IQuadrantCol;
        shiftQuadrantRow(callUpdate?: boolean): void;
        shiftQuadrantCol(callUpdate?: boolean): void;
        determineAllQuadrants(group: string, things: IThing[]): void;
        determineThingQuadrants(thing: IThing): void;
        setThingInQuadrant(thing: IThing, quadrant: IQuadrant, group: string): void;
        private adjustOffsets();
        private shiftQuadrant(quadrant, dx, dy);
        private createQuadrant(left, top);
        private createQuadrantRow(left?, top?);
        private createQuadrantCol(left, top);
        private getTop(thing);
        private getRight(thing);
        private getBottom(thing);
        private getLeft(thing);
        private markThingQuadrantsChanged(thing);
        private findQuadrantRowStart(thing);
        private findQuadrantRowEnd(thing);
        private findQuadrantColStart(thing);
        private findQuadrantColEnd(thing);
    }
}
