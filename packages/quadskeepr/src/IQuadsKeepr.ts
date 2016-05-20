/// <reference path="../typings/objectmakr/ObjectMakr.d.ts" />

import { IObjectMakr } from "IObjectMakr";

/**
 * Any bounding box that can be within quadrant(s).
 */
export interface IThing {
    /**
     * The top border of the bounding box.
     */
    top: number;

    /**
     * The right border of the bounding box.
     */
    right: number;

    /**
     * The bottom border of the bounding box.
     */
    bottom: number;

    /**
     * The left border of the bounding box.
     */
    left: number;

    /**
     * Whether this has been changed since the last game tick.
     */
    changed: boolean;

    /**
     * Which group of Things this belongs to.
     */
    groupType: string;

    /**
     * How many quadrants this is a member of.
     */
    numQuadrants: number;

    /**
     * How far this is visually displaced horizontally. 
     */
    offsetX?: number;

    /**
     * How far this is visually displaced vertically.
     */
    offsetY?: number;

    /**
     * Quadrants this is a member of.
     */
    quadrants: IQuadrant[];
}

/**
 * Some collection of Thing groups, keyed by group name.
 */
export interface IThingsCollection {
    [i: string]: IThing[];
}

/** 
 * For each group name in a Quadrant, how many Things it has of that name.
 * 
 * @remarks .numthings[groupName] <= .things[groupName].length, as the .things
 *          Arrays are not resized when Things are remved.
 */
export interface IThingsCounter {
    [i: string]: number;
}

/**
 * A single cell in a grid structure containing any number of Things.
 */
export interface IQuadrant extends IThing {
    /**
     * Groups of Things known to overlap (be within) the Quadrant, by group.
     */
    things: IThingsCollection;

    /**
     * How many Things are in the Quadrant across all groups.
     */
    numthings: IThingsCounter;
}

/**
 * A straight line of Quadrants, border-to-border.
 */
export interface IQuadrantCollection {
    /**
     * The leftmost border (of the leftmost Quadrant).
     */
    left: number;

    /**
     * The top border (of the top Quadrant).
     */
    top: number;

    /**
     * The Quadrants, in order.
     */
    quadrants: IQuadrant[];
}

/**
 * A complete row of Quadrants, border-to-border.
 */
export interface IQuadrantRow extends IQuadrantCollection {
    /**
     * The Quadrants, in order from left to right.
     */
    quadrants: IQuadrant[];
}

/**
 * A complete column of Quadrants, border-to-border.
 */
export interface IQuadrantCol extends IQuadrantCollection {
    /**
     * The Quadrants, in order from top to bottom.
     */
    quadrants: IQuadrant[];
}

/**
 * A callback for a newly added or removed area from the grid.
 * 
 * @param direction The direction the changed area is, relative to the existing grid.
 * @param top   The top border of the new area.
 * @param right   The right border of the new area.
 * @param bottom   The bottom border of the new area.
 * @param left  The left border of the new area.
 */
export interface IQuadrantChangeCallback {
    (direction: string, top: number, right: number, bottom: number, left: number): void;
}

/**
 * Settings to initialize a new IQuadsKeepr.
 */
export interface IQuadsKeeprSettings {
    /**
     * An ObjectMakr used to create Quadrants.
     */
    ObjectMaker: IObjectMakr;

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
     * Whether to factor horizontal visual displacement for bounding boxes.
     */
    checkOffsetX?: boolean;

    /**
     * Whether to factor vertical visual displacement for bounding boxes.
     */
    checkOffsetY?: boolean;

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
}

/**
 * Adjustable quadrant-based collision detection.
 */
export interface IQuadsKeepr {
    /**
     * The top boundary for all quadrants.
     */
    top: number;

    /**
     * The right boundary for all quadrants.
     */
    right: number;

    /**
     * The bottom boundary for all quadrants.
     */
    bottom: number;

    /**
     * The left boundary for all quadrants.
     */
    left: number;

    /**
     * @returns The listing of Quadrants grouped by row.
     */
    getQuadrantRows(): IQuadrantRow[];

    /**
     * @returns The listing of Quadrants grouped by column.
     */
    getQuadrantCols(): IQuadrantCol[];

    /**
     * @returns How many Quadrant rows there are.
     */
    getNumRows(): number;

    /**
     * @returns How many Quadrant columns there are.
     */
    getNumCols(): number;

    /**
     * @returns How wide each Quadrant is.
     */
    getQuadrantWidth(): number;

    /**
     * @returns How high each Quadrant is.
     */
    getQuadrantHeight(): number;

    /**
     * Completely resets all Quadrants. The grid structure of rows and columns
     * is remade with new Quadrants according to startLeft and startTop.
     */
    resetQuadrants(): void;

    /**
     * Shifts each Quadrant horizontally and vertically, along with the row and
     * column containers. Offsets are adjusted to check for row or column 
     * deletion and insertion.
     * 
     * @param dx   How much to shift horizontally (will be rounded).
     * @param dy   How much to shift vertically (will be rounded).
     */
    shiftQuadrants(dx?: number, dy?: number): void;

    /**
     * Adds a QuadrantRow to the end of the quadrantRows Array.
     * 
     * @param callUpdate   Whether this should call the onAdd trigger 
     *                     with the new row's bounding box.
     * @returns The newly created QuadrantRow.
     */
    pushQuadrantRow(callUpdate?: boolean): IQuadrantRow;

    /**
     * Adds a QuadrantCol to the end of the quadrantCols Array.
     * 
     * @param callUpdate   Whether this should call the onAdd trigger 
     *                     with the new col's bounding box.
     * @returns The newly created QuadrantCol.
     */
    pushQuadrantCol(callUpdate?: boolean): IQuadrantCol;

    /**
     * Removes the last QuadrantRow from the end of the quadrantRows Array.
     * 
     * @param callUpdate   Whether this should call the onRemove trigger 
     *                     with the new row's bounding box.
     * @returns The newly created QuadrantRow.
     */
    popQuadrantRow(callUpdate?: boolean): void;

    /**
     * Removes the last QuadrantCol from the end of the quadrantCols Array.
     * 
     * @param callUpdate   Whether this should call the onRemove trigger 
     *                     with the new row's bounding box.
     */
    popQuadrantCol(callUpdate?: boolean): void;

    /**
     * Adds a QuadrantRow to the beginning of the quadrantRows Array.
     * 
     * @param callUpdate   Whether this should call the onAdd trigger 
     *                     with the new row's bounding box.
     * @returns The newly created QuadrantRow.
     */
    unshiftQuadrantRow(callUpdate?: boolean): IQuadrantRow;

    /**
     * Adds a QuadrantCol to the beginning of the quadrantCols Array.
     * 
     * @param callUpdate   Whether this should call the onAdd trigger 
     *                     with the new row's bounding box.
     * @returns The newly created QuadrantCol.
     */
    unshiftQuadrantCol(callUpdate?: boolean): IQuadrantCol;

    /**
     * Removes a QuadrantRow from the beginning of the quadrantRows Array.
     * 
     * @param callUpdate   Whether this should call the onAdd trigger 
     *                     with the new row's bounding box.
     */
    shiftQuadrantRow(callUpdate?: boolean): void;

    /**
     * Removes a QuadrantCol from the beginning of the quadrantCols Array.
     * 
     * @param callUpdate   Whether this should call the onAdd trigger 
     *                     with the new row's bounding box.
     */
    shiftQuadrantCol(callUpdate?: boolean): void;

    /**
     * Determines the Quadrants for an entire Array of Things. This is done by
     * wiping each quadrant's memory of that Array's group type and determining
     * each Thing's quadrants.
     * 
     * @param group   The name of the group to have Quadrants determined.
     * @param things   The listing of Things in that group.
     */
    determineAllQuadrants(group: string, things: IThing[]): void;

    /**
     * Determines the Quadrants for a single Thing. The starting row and column
     * indices are calculated so every Quadrant within them should contain the
     * Thing. In the process, its old Quadrants and new Quadrants are marked as 
     * changed if it was.
     * 
     * @param thing   A Thing whose Quadrants are to be determined.
     */
    determineThingQuadrants(thing: IThing): void;

    /**
     * Sets a Thing to be inside a Quadrant. The two are marked so they can
     * recognize each other's existence later.
     * 
     * @param thing   A Thing to be placed in the Quadrant.
     * @param quadrant   A Quadrant that now contains the Thing.
     * @param group   The grouping under which the Quadrant should store the 
     *                Thing.
     */
    setThingInQuadrant(thing: IThing, quadrant: IQuadrant, group: string): void;
}
