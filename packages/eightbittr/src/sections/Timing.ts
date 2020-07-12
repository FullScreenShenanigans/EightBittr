import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * Timing constants for delayed events.
 */
export class Timing<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Default time separation between repeated events.
     */
    public readonly timingDefault?: number;
}
