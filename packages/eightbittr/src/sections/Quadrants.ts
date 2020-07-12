import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * Arranges game physics quadrants.
 */
export class Quadrants<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Groups that should have their quadrants updated.
     */
    public readonly activeGroupNames: string[] = [];

    /**
     * How many Quadrant columns there are in the game.
     */
    public readonly numCols?: number;

    /**
     * How many Quadrant rows there are in the game.
     */
    public readonly numRows?: number;

    /**
     * How tall each quadrant is.
     */
    public readonly quadrantHeight?: number;

    /**
     * How wide each quadrant is.
     */
    public readonly quadrantWidth?: number;
}
