import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * Timing constants for delayed events.
 */
export class Timing<Game extends EightBittr> extends Section<Game> {
    /**
     * Default time separation between repeated events.
     */
    public readonly timingDefault?: number;
}
