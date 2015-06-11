declare module QuadsKeepr {
    export interface IQuadsKeeprSettings {
        // An ObjectMakr used to create Quadrants.
        ObjectMaker: ObjectMakr.IObjectMakr;

        // How many QuadrantRows to keep at a time.
        numRows: number;

        // How many QuadrantCols to keep at a time.
        numCols: number;

        // How wide each Quadrant should be.
        quadrantWidth: number;

        // How high each Quadrant should be.
        quadrantHeight: number;

        // The names of groups Things may be in.
        groupNames: string[];

        // A callback for when Quadrants are added, called on the newly contained
        // area.
        onAdd?: IQuadrantChangeCallback;

        // A callback for when Quadrants are removed, called on the formerly 
        // contained area.
        onRemove?: IQuadrantChangeCallback;

        // A Number to use as the initial horizontal edge (rounded; by default, 0).
        startLeft?: number;

        // A Number to use as the initial vertical edge (rounded; by default, 0).
        startTop?: number;

        // The key under which Things store their top (by default, "top").
        keyTop?: string;

        // The key under which Things store their right (by default, "right").
        keyRight?: string;

        // The key under which Things store their bottom (by default, "bottom").
        keyBottom?: string;

        // The key under which Things store their left (by default, "left").
        keyLeft?: string;

        // The key under which Things store their number of quadrants (by default, 
        // "numquads").
        keyNumQuads?: string;

        // They key under which Things store their quadrants (by default, "quadrants").
        keyQuadrants?: string;

        // The key under which Things store whether they've changed visually (by default,
        // "changed").
        keyChanged?: string;

        // The key under which Things store horizontal tolerance (by default, "tolx").
        keyToleranceX?: string;

        // The key under which Things store vertical tolerance (by default, "toly").
        keyToleranceY?: string;

        // The key under which Things store which group they fall under (by default,
        // "group").
        keyGroupName?: string;

        // An attribute name for a Thing's * horizontal offset (if not given, ignored).
        keyOffsetX?: string;

        // The attribute name for a Thing's vertical offset(if not given, ignored).
        keyOffsetY?: string;
    }

    export interface IThing {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }

    export interface IThingsCollection {
        (i: string): IThing[];
    }

    export interface IThingsCounter {
        (i: string): number;
    }

    export interface IQuadrant {
        top: number;
        right: number;
        bottom: number;
        left: number;
        changed: boolean;
        things: IThingsCollection;
        numthings: IThingsCounter;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
    }

    export interface IQuadrantCollection {
        left: number;
        top: number;
        quadrants: IQuadrant[];
    }

    export interface IQuadrantRow extends IQuadrantCollection { }
    export interface IQuadrantCol extends IQuadrantCollection { }

    export interface IQuadrantChangeCallback {
        (direction: string, top: number, right: number, bottom: number, left: number): void;
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