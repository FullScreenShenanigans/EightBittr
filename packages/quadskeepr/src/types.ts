/**
 * Any rectangular bounding box.
 */
export interface BoundingBox {
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
export interface Actor extends BoundingBox {
    /**
     * Which group of Actors this belongs to.
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
    quadrants: Quadrant<Actor>[];
}

/**
 * Some collection of Actor groups, keyed by group name.
 *
 * @template T   The type of Actor.
 */
export type ActorsCollection<T extends Actor> = Record<string, T[]>;

/**
 * For each group name in a Quadrant, how many Actors it has of that name.
 *
 * @remarks .numActors[groupName] <= .actors[groupName].length, as the .actors
 *          Arrays are not resized when Actors are removed.
 */
export type ActorsCounter = Record<string, number>;

/**
 * A single cell in a grid structure containing any number of Actors.
 *
 * @template T   The type of Actor.
 */
export interface Quadrant<T extends Actor> extends BoundingBox {
    /**
     * Groups of Actors known to overlap (be within) the Quadrant, by group.
     */
    actors: ActorsCollection<T>;

    /**
     * How many Actors are in the Quadrant across all groups.
     */
    numActors: ActorsCounter;
}

/**
 * A straight line of Quadrants, border-to-border.
 *
 * @template T   The type of Actor.
 */
export interface QuadrantCollection<T extends Actor> {
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
    quadrants: Quadrant<T>[];
}

/**
 * A complete row of Quadrants, border-to-border.
 *
 * @template T   The type of Actor.
 */
export interface QuadrantRow<T extends Actor> extends QuadrantCollection<T> {
    /**
     * The Quadrants, in order from left to right.
     */
    quadrants: Quadrant<T>[];
}

/**
 * A complete column of Quadrants, border-to-border.
 *
 * @template T   The type of Actor.
 */
export interface QuadrantCol<T extends Actor> extends QuadrantCollection<T> {
    /**
     * The Quadrants, in order from top to bottom.
     */
    quadrants: Quadrant<T>[];
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
export type QuadrantChangeCallback = (
    direction: string,
    top: number,
    right: number,
    bottom: number,
    left: number
) => void;

/**
 * Settings to initialize a new QuadsKeepr.
 */
export interface QuadsKeeprSettings {
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
     * The names of groups Actors may be in within Quadrants.
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
    onAdd?: QuadrantChangeCallback;

    /**
     * Callback for when Quadrants are removed, called on the formerly contained area.
     */
    onRemove?: QuadrantChangeCallback;

    /**
     * The initial horizontal edge (rounded; by default, 0).
     */
    startLeft?: number;

    /**
     * The initial vertical edge (rounded; by default, 0).
     */
    startTop?: number;
}
