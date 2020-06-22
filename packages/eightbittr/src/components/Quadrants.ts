import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Arranges game physics quadrants.
 */
export class Quadrants<TEightBittr extends EightBittr> extends GeneralComponent<
    TEightBittr
> {
    /**
     * How many Quadrant columns there are in the game, if not 6.
     */
    public readonly numCols?: number;

    /**
     * How many Quadrant rows there are in the game, if not 6.
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
