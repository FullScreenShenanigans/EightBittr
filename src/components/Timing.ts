import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Timing constants for delayed events.
 */
export class Timing<TEightBittr extends EightBittr> extends GeneralComponent<TEightBittr> {
    /**
     * Default time separation between repeated events.
     */
    public readonly timingDefault?: number;
}
