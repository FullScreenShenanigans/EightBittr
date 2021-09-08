// This file is referenced in EightBittr documentation.
// If you change it here, please change it there as well!

import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * Collection settings for Actor group names.
 */
export class Groups<Game extends EightBittr> extends Section<Game> {
    /**
     * Names of known Actor groups, in drawing order.
     */
    public readonly groupNames: string[] = [];
}
