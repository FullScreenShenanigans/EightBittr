/**
 * Any rectangular bounding box.
 */
export interface IBoundingBox {
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
}

/**
 * A bounding box that can be within quadrants.
 */
export interface IThing extends IBoundingBox {
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
    quadrants: IQuadrant<IThing>[];
}

/**
 * Some collection of Thing groups, keyed by group name.
 *
 * @template T   The type of Thing.
 */
export interface IThingsCollection<T extends IThing> {
    [i: string]: T[];
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
 *
 * @template T   The type of Thing.
 */
export interface IQuadrant<T extends IThing> extends IBoundingBox {
    /**
     * Groups of Things known to overlap (be within) the Quadrant, by group.
     */
    things: IThingsCollection<T>;

    /**
     * How many Things are in the Quadrant across all groups.
     */
    numthings: IThingsCounter;
}

/**
 * A straight line of Quadrants, border-to-border.
 *
 * @template T   The type of Thing.
 */
export interface IQuadrantCollection<T extends IThing> {
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
    quadrants: IQuadrant<T>[];
}

/**
 * A complete row of Quadrants, border-to-border.
 *
 * @template T   The type of Thing.
 */
export interface IQuadrantRow<T extends IThing> extends IQuadrantCollection<T> {
    /**
     * The Quadrants, in order from left to right.
     */
    quadrants: IQuadrant<T>[];
}

/**
 * A complete column of Quadrants, border-to-border.
 *
 * @template T   The type of Thing.
 */
export interface IQuadrantCol<T extends IThing> extends IQuadrantCollection<T> {
    /**
     * The Quadrants, in order from top to bottom.
     */
    quadrants: IQuadrant<T>[];
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
export type IQuadrantChangeCallback = (
    direction: string,
    top: number,
    right: number,
    bottom: number,
    left: number
) => void;

/**
 * Settings to initialize a new QuadsKeepr.
 */
export interface IQuadsKeeprSettings {
    /**
     * How many QuadrantRows to keep at a time.
     */
    numRows?: number;

    /**
     * How many QuadrantCols to keep at a time.
     */
    numCols?: number;

    /**
     * How wide each Quadrant should be.
     */
    quadrantWidth?: number;

    /**
     * How high each Quadrant should be.
     */
    quadrantHeight?: number;

    /**
     * The names of groups Things may be in within Quadrants.
     */
    groupNames?: string[];

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
