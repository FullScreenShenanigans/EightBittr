import { Align as Align, Direction, HeightAndWidth } from "./geometry";
import { FixedOrRandomized, FixedOrRandomizedProperties } from "./randomization";
import { Spacing } from "./spacing";

/**
 * Common attributes for possibility children.
 */
export interface PossibilityBase {
    /**
     * How to align children within their container, if not "stretch".
     */
    align?: Align;

    /**
     * How much space this takes up.
     */
    size: HeightAndWidth;
}

/**
 * Recursive possibility child contents a possibility may place.
 */
export interface PossibilityChildPossibility extends PossibilityBase {
    /**
     * Identifier of the child possibility to recurse on.
     */
    title: string;

    /**
     * Type indicating this child is recursive.
     */
    type: "Possibility";
}

/**
 * Output result child contents a possibility may place.
 */
export interface PossibilityChildResult extends Partial<PossibilityBase> {
    /**
     * Any additional properties to pass to generate the child's output.
     */
    properties?: FixedOrRandomized<Record<string, unknown>>;

    /**
     * Identifier of the result child to add.
     */
    title: FixedOrRandomized<string>;

    /**
     * Type indicating this child is an output result.
     */
    type: "Result";
}

/**
 * Child contents a possibility may place.
 */
export type PossibilityChild = PossibilityChildPossibility | PossibilityChildResult;

/**
 * Description for a set of children to be placed.
 */
export interface Possibility extends PossibilityBase {
    /**
     * Children that may be placed.
     */
    children: PossibilityChild | PossibilityChild[];

    /**
     * Cardinal direction to place the children in order towards.
     */
    direction: Direction;

    /**
     * How many times to repeat the children, if not 1.
     */
    repeat?: number;

    /**
     * How much space this takes up.
     */
    size: HeightAndWidth;

    /**
     * How much space should be between children, if not 0.
     */
    spacing?: Spacing;
}

/**
 * Possibilities that may be placed, keyed by title.
 */
export type PossibilitiesContainer = Record<string, FixedOrRandomizedProperties<Possibility>>;
