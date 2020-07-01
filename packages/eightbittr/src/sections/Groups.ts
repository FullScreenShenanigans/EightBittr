import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * Collection settings for IThing group names.
 */
export class Groups<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Names of known Thing groups, in drawing order.
     */
    public readonly groupNames: string[];
}
