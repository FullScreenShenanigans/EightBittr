declare module QuadsKeepr {
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

    export interface IQuadsKeeprSettings {
        /**
         * An ObjectMakr used to create Quadrants.
         */
        ObjectMaker: ObjectMakr.IObjectMakr;

        /**
         * How many QuadrantRows to keep at a time.
         */
        numRows: number;

        /**
         * How many QuadrantCols to keep at a time.
         */
        numCols: number;

        /**
         * How wide each Quadrant should be.
         */
        quadrantWidth: number;

        /**
         * How high each Quadrant should be.
         */
        quadrantHeight: number;

        /**
         * The names of groups Things may be in within Quadrants.
         */
        groupNames: string[];

        /**
         * Callback for when Quadrants are added, called on the newly contained area.
         */
        onAdd?: IQuadrantChangeCallback;

        /**
         * Callback for when Quadrants are removed, called on the formerly contained area.
         */
        onRemove?: IQuadrantChangeCallback;

        /**
         * The initial horizontal edge (rounded; by default, 0).
         */
        startLeft?: number;

        /**
         * The initial vertical edge (rounded; by default, 0).
         */
        startTop?: number;

        /**
         * String key under which Things store their top (by default, "top").
         */
        keyTop?: string;

        /**
         * String key under which Things store their right (by default, "right").
         */
        keyRight?: string;

        /**
         * String key under which Things store their bottom (by default, "bottom").
         */
        keyBottom?: string;

        /**
         * String key under which Things store their left (by default, "left").
         */
        keyLeft?: string;

        /**
         * String key under which Things store their number of Quadrants (by default, "numQuads").
         */
        keyNumQuads?: string;

        /**
         * String key under which Things store their quadrants (by default, "quadrants").
         */
        keyQuadrants?: string;

        /**
         * String key under which Things store their changed status (by default, "changed").
         */
        keyChanged?: string;

        /**
         * String key under which Things store their horizontal tolerance (by default, "tolx").
         */
        keyToleranceX?: string;

        /**
         * String key under which Things store their vertical tolerance (by default, "toly").
         */
        keyToleranceY?: string;

        /**
         * String key under which Things store their group (by default, "group").
         */
        keyGroupName?: string;

        /**
         * String key under which Things store their horizontal offset.
         */
        keyOffsetX?: string;

        /**
         * String key under which Things store their vertical offset.
         */
        keyOffsetY?: string;
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
